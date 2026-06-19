/**
 * API Route: /api/admin/contacto
 * Gestión de los mensajes recibidos desde el formulario de contacto público.
 * GET    — lista todos los mensajes (del más reciente al más antiguo)
 * PUT    — marca un mensaje como leído o no leído (body: { id, leido })
 * DELETE — elimina un mensaje permanentemente (?id=<número> en la URL)
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/apiAuth";
import { z } from "zod";

// Esquema Zod para cambiar el estado de lectura de un mensaje
const UpdateReadSchema = z.object({
  id: z.number({ required_error: "ID de mensaje es requerido" }),
  leido: z.boolean({ required_error: "Estado leido es requerido" }),
});

// Devuelve todos los mensajes de contacto ordenados por fecha descendente
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const mensajes = await prisma.mensajeContacto.findMany({
      orderBy: { fecha: "desc" },
    });

    return NextResponse.json(mensajes);
  } catch (error) {
    console.error("[API Admin Contacto GET Error]:", error);
    return NextResponse.json(
      { error: "Error interno al obtener los mensajes" },
      { status: 500 }
    );
  }
}

// Actualiza el campo `leido` de un mensaje específico
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const result = UpdateReadSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { id, leido } = result.data;
    const userId = Number((session.user as any).id);

    const mensajeActualizado = await prisma.mensajeContacto.update({
      where: { id },
      data: {
        leido,
        id_usuario_leido: leido ? userId : null,
      },
    });

    return NextResponse.json({ success: true, data: mensajeActualizado });
  } catch (error) {
    console.error("[API Admin Contacto PUT Error]:", error);
    return NextResponse.json(
      { error: "Error interno al actualizar el mensaje" },
      { status: 500 }
    );
  }
}

// Elimina un mensaje de forma permanente usando el ID en el query string (?id=X)
export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireRole(["admin"]);
    if (!auth.authorized) return auth.errorResponse;

    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");
    if (!idParam) {
      return NextResponse.json({ error: "ID de mensaje requerido" }, { status: 400 });
    }

    const id = Number(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID de mensaje inválido" }, { status: 400 });
    }

    await prisma.mensajeContacto.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Mensaje eliminado exitosamente" });
  } catch (error) {
    console.error("[API Admin Contacto DELETE Error]:", error);
    return NextResponse.json(
      { error: "Error interno al eliminar el mensaje" },
      { status: 500 }
    );
  }
}
