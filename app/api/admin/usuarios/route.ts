/**
 * API Route: /api/admin/usuarios  (solo admin)
 * CRUD completo de usuarios del panel de administración.
 * GET   — lista todos los usuarios (sin el campo contrasena)
 * POST  — crea usuario: genera username/password, envía email de bienvenida
 * PUT   — edita datos de un usuario (contraseña opcional)
 * PATCH — activa o desactiva un usuario (no se puede auto-desactivar)
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { transporter, FROM } from "@/lib/mailer";
import { welcomeEmail } from "@/lib/emailTemplates";
import crypto from "crypto";

// ── Schemas ────────────────────────────────────────────────────────────────

const CreateUserSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("El correo electrónico no es válido"),
  rol: z.enum(["admin", "tecnico", "vendedor"], { errorMap: () => ({ message: "Rol inválido" }) }),
});

const UpdateUserSchema = z.object({
  id: z.number({ required_error: "ID de usuario es requerido" }),
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  usuario: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
  email: z.string().email("El correo electrónico no es válido"),
  contrasena: z.string().min(6).optional().or(z.literal("")),
  rol: z.enum(["admin", "tecnico", "vendedor"], { errorMap: () => ({ message: "Rol inválido" }) }),
});

const ToggleStatusSchema = z.object({
  id: z.number({ required_error: "ID de usuario es requerido" }),
  activo: z.boolean({ required_error: "Estado activo es requerido" }),
});

// ── Helpers ────────────────────────────────────────────────────────────────

function normalizeStr(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

async function generateUniqueUsername(nombre: string): Promise<string> {
  const parts = nombre.trim().split(/\s+/);
  const base =
    parts.length >= 2
      ? normalizeStr(parts[0][0]) + normalizeStr(parts[1])
      : normalizeStr(parts[0]);

  let candidate = base;
  let counter = 2;
  while (await prisma.usuario.findUnique({ where: { usuario: candidate } })) {
    candidate = `${base}${counter++}`;
  }
  return candidate;
}

function generateTempPassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const symbols = "@#!%*?&";

  const pick = (chars: string) => chars[crypto.randomInt(chars.length)];

  const chars = [
    pick(upper), pick(upper),
    pick(lower), pick(lower), pick(lower), pick(lower),
    pick(digits), pick(digits),
    pick(symbols),
  ];

  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join("");
}


async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  if (!session) return { authorized: false, errorResponse: NextResponse.json({ error: "No autorizado" }, { status: 401 }) };

  const userRole = (session.user as any).role;
  if (userRole !== "admin") {
    return { authorized: false, errorResponse: NextResponse.json({ error: "Permisos insuficientes" }, { status: 403 }) };
  }

  return { authorized: true };
}

// ── GET ────────────────────────────────────────────────────────────────────

export async function GET() {
  try {
    const auth = await checkAdminAuth();
    if (!auth.authorized) return auth.errorResponse!;

    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        usuario: true,
        email: true,
        rol: true,
        activo: true,
        mustChangePassword: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("[API Admin Usuarios GET Error]:", error);
    return NextResponse.json({ error: "Error interno al obtener los usuarios" }, { status: 500 });
  }
}

// ── POST ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const auth = await checkAdminAuth();
    if (!auth.authorized) return auth.errorResponse!;

    const body = await req.json();
    const result = CreateUserSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ errors: result.error.flatten().fieldErrors }, { status: 400 });
    }

    const { nombre, email, rol } = result.data;
    const emailLower = email.toLowerCase().trim();

    const existingEmail = await prisma.usuario.findUnique({ where: { email: emailLower } });
    if (existingEmail) {
      return NextResponse.json({ errors: { email: ["El correo electrónico ya está registrado"] } }, { status: 400 });
    }

    const usuario = await generateUniqueUsername(nombre);
    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        usuario,
        email: emailLower,
        contrasena: hashedPassword,
        rol,
        activo: true,
        mustChangePassword: true,
      },
      select: {
        id: true,
        nombre: true,
        usuario: true,
        email: true,
        rol: true,
        activo: true,
        mustChangePassword: true,
        createdAt: true,
      },
    });

    // Send welcome email with credentials
    try {
      await transporter.sendMail({
        from: FROM,
        to: emailLower,
        subject: "Bienvenido/a a DELLCOM SAC — Tus credenciales de acceso",
        html: welcomeEmail({
          nombre,
          usuario,
          tempPassword,
          rol,
          loginUrl: `${process.env.NEXTAUTH_URL}/admin/login`,
        }),
      });
    } catch (emailErr) {
      console.error("[API Admin Usuarios] Email send failed:", emailErr);
      // Don't fail the request if email fails — user was created
    }

    return NextResponse.json({ success: true, data: nuevoUsuario }, { status: 201 });
  } catch (error) {
    console.error("[API Admin Usuarios POST Error]:", error);
    return NextResponse.json({ error: "Error interno al crear el usuario" }, { status: 500 });
  }
}

// ── PUT ────────────────────────────────────────────────────────────────────

export async function PUT(req: NextRequest) {
  try {
    const auth = await checkAdminAuth();
    if (!auth.authorized) return auth.errorResponse!;

    const body = await req.json();
    const result = UpdateUserSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ errors: result.error.flatten().fieldErrors }, { status: 400 });
    }

    const { id, nombre, usuario, email, contrasena, rol } = result.data;

    const existingUsername = await prisma.usuario.findFirst({ where: { usuario, id: { not: id } } });
    if (existingUsername) {
      return NextResponse.json({ errors: { usuario: ["El nombre de usuario ya está en uso"] } }, { status: 400 });
    }

    const existingEmail = await prisma.usuario.findFirst({ where: { email, id: { not: id } } });
    if (existingEmail) {
      return NextResponse.json({ errors: { email: ["El correo electrónico ya está en uso"] } }, { status: 400 });
    }

    const updateData: any = { nombre, usuario, email, rol };
    if (contrasena && contrasena.trim() !== "") {
      updateData.contrasena = await bcrypt.hash(contrasena, 10);
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data: updateData,
      select: { id: true, nombre: true, usuario: true, email: true, rol: true, activo: true },
    });

    return NextResponse.json({ success: true, data: usuarioActualizado });
  } catch (error) {
    console.error("[API Admin Usuarios PUT Error]:", error);
    return NextResponse.json({ error: "Error interno al actualizar el usuario" }, { status: 500 });
  }
}

// ── PATCH ──────────────────────────────────────────────────────────────────

export async function PATCH(req: NextRequest) {
  try {
    const auth = await checkAdminAuth();
    if (!auth.authorized) return auth.errorResponse!;

    const body = await req.json();
    const result = ToggleStatusSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ errors: result.error.flatten().fieldErrors }, { status: 400 });
    }

    const { id, activo } = result.data;

    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const loggedInUser = await prisma.usuario.findUnique({ where: { email } });
    if (loggedInUser && loggedInUser.id === id && !activo) {
      return NextResponse.json({ error: "No puedes desactivar tu propia cuenta" }, { status: 400 });
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data: { activo },
      select: { id: true, nombre: true, usuario: true, activo: true },
    });

    return NextResponse.json({ success: true, data: usuarioActualizado });
  } catch (error) {
    console.error("[API Admin Usuarios PATCH Error]:", error);
    return NextResponse.json({ error: "Error interno al actualizar el estado del usuario" }, { status: 500 });
  }
}
