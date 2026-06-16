/**
 * API Route: /api/archivos
 * Repositorio de archivos técnicos: programas, drivers, plantillas Excel, links.
 * GET  — lista todos los archivos con el nombre de quien los subió (requiere sesión)
 * POST — registra un archivo nuevo (requiere sesión activa)
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/apiAuth";
import { z } from "zod";

// Esquema Zod para crear un archivo técnico
const ArchivoSchema = z.object({
  nombre: z.string().min(1, "El nombre del archivo es requerido"),
  // Tipos válidos definidos en el modelo Prisma
  tipo: z.enum(["programa", "driver", "excel", "link"], {
    errorMap: () => ({ message: "Tipo inválido. Debe ser: programa, driver, excel o link" }),
  }),
  url_archivo: z.string().min(1, "La URL del archivo es requerida"),
  descripcion: z.string().nullable().optional(),
});

// Devuelve los archivos ordenados por fecha de subida (más reciente primero)
export async function GET() {
  const archivos = await prisma.archivoTecnico.findMany({
    include: { usuario: { select: { nombre: true } } },
    orderBy: { fecha_subida: "desc" },
  });
  return NextResponse.json(archivos);
}

// Crea un archivo nuevo asignado al usuario autenticado
export async function POST(req: NextRequest) {
  const auth = await requireRole(["admin", "tecnico"]);
  if (!auth.authorized) return auth.errorResponse;

  // Busca el usuario para obtener su ID y asignarlo al registro
  const user = await prisma.usuario.findUnique({ where: { email: auth.email } });
  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

  const body = await req.json();
  const result = ArchivoSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ errors: result.error.flatten().fieldErrors }, { status: 400 });
  }

  const archivo = await prisma.archivoTecnico.create({
    data: { ...result.data, id_usuario: user.id },
  });
  return NextResponse.json(archivo, { status: 201 });
}
