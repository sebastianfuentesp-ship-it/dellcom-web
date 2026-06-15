import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const secretFromEnv = process.env.CRON_SECRET;
    if (!secretFromEnv) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const expectedAuth = `Bearer ${secretFromEnv}`;

    if (authHeader !== expectedAuth) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const now = new Date();

    // Buscar y actualizar las licencias activas que hayan expirado
    const resultado = await prisma.licencia.updateMany({
      where: {
        estado: "activo",
        fecha_fin: {
          lt: now,
        },
      },
      data: {
        estado: "vencido",
      },
    });

    return NextResponse.json({
      success: true,
      mensaje: "Comprobacion de licencias completada",
      actualizadas: resultado.count,
    });
  } catch (error) {
    console.error("[CRON Check Licencias Error]:", error);
    return NextResponse.json(
      { error: "Error interno al ejecutar la comprobacion de licencias" },
      { status: 500 }
    );
  }
}

// Tambien permitir POST por flexibilidad de invocacion
export async function POST(req: NextRequest) {
  return GET(req);
}
