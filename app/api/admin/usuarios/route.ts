import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import bcrypt from "bcryptjs";

// Validation Schemas
const CreateUserSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  usuario: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
  email: z.string().email("El correo electrónico no es válido"),
  contrasena: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
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

// Helper validation for role
async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  if (!session) return { authorized: false, errorResponse: NextResponse.json({ error: "No autorizado" }, { status: 401 }) };
  
  const userRole = (session.user as any).role;
  if (userRole !== "admin") {
    return { authorized: false, errorResponse: NextResponse.json({ error: "Permisos insuficientes" }, { status: 403 }) };
  }
  
  return { authorized: true };
}

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
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("[API Admin Usuarios GET Error]:", error);
    return NextResponse.json(
      { error: "Error interno al obtener los usuarios" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await checkAdminAuth();
    if (!auth.authorized) return auth.errorResponse!;

    const body = await req.json();
    const result = CreateUserSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { nombre, usuario, email, contrasena, rol } = result.data;

    // Check unique username
    const existingUsername = await prisma.usuario.findUnique({
      where: { usuario },
    });
    if (existingUsername) {
      return NextResponse.json({ errors: { usuario: ["El nombre de usuario ya está registrado"] } }, { status: 400 });
    }

    // Check unique email
    const existingEmail = await prisma.usuario.findUnique({
      where: { email },
    });
    if (existingEmail) {
      return NextResponse.json({ errors: { email: ["El correo electrónico ya está registrado"] } }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        usuario,
        email,
        contrasena: hashedPassword,
        rol,
        activo: true,
      },
      select: {
        id: true,
        nombre: true,
        usuario: true,
        email: true,
        rol: true,
        activo: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, data: nuevoUsuario }, { status: 201 });
  } catch (error) {
    console.error("[API Admin Usuarios POST Error]:", error);
    return NextResponse.json(
      { error: "Error interno al crear el usuario" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await checkAdminAuth();
    if (!auth.authorized) return auth.errorResponse!;

    const body = await req.json();
    const result = UpdateUserSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { id, nombre, usuario, email, contrasena, rol } = result.data;

    // Check unique username for other users
    const existingUsername = await prisma.usuario.findFirst({
      where: { usuario, id: { not: id } },
    });
    if (existingUsername) {
      return NextResponse.json({ errors: { usuario: ["El nombre de usuario ya está en uso"] } }, { status: 400 });
    }

    // Check unique email for other users
    const existingEmail = await prisma.usuario.findFirst({
      where: { email, id: { not: id } },
    });
    if (existingEmail) {
      return NextResponse.json({ errors: { email: ["El correo electrónico ya está en uso"] } }, { status: 400 });
    }

    // Prepare update data
    const updateData: any = {
      nombre,
      usuario,
      email,
      rol,
    };

    if (contrasena && contrasena.trim() !== "") {
      updateData.contrasena = await bcrypt.hash(contrasena, 10);
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        nombre: true,
        usuario: true,
        email: true,
        rol: true,
        activo: true,
      },
    });

    return NextResponse.json({ success: true, data: usuarioActualizado });
  } catch (error) {
    console.error("[API Admin Usuarios PUT Error]:", error);
    return NextResponse.json(
      { error: "Error interno al actualizar el usuario" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await checkAdminAuth();
    if (!auth.authorized) return auth.errorResponse!;

    const body = await req.json();
    const result = ToggleStatusSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { id, activo } = result.data;

    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const loggedInUser = await prisma.usuario.findUnique({
      where: { email },
    });

    if (loggedInUser && loggedInUser.id === id && !activo) {
      return NextResponse.json({ error: "No puedes desactivar tu propia cuenta" }, { status: 400 });
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data: { activo },
      select: {
        id: true,
        nombre: true,
        usuario: true,
        activo: true,
      },
    });

    return NextResponse.json({ success: true, data: usuarioActualizado });
  } catch (error) {
    console.error("[API Admin Usuarios PATCH Error]:", error);
    return NextResponse.json(
      { error: "Error interno al actualizar el estado del usuario" },
      { status: 500 }
    );
  }
}
