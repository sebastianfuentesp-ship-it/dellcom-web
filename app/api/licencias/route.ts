import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const licencias = await prisma.licencia.findMany({
    include: { usuario: { select: { nombre: true, usuario: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(licencias);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const user = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

  const body = await req.json();
  
  // Format dates correctly from ISO strings
  const data = {
    ...body,
    id_usuario: user.id,
    fecha_inicio: body.fecha_inicio ? new Date(body.fecha_inicio) : new Date(),
    fecha_fin: body.fecha_fin ? new Date(body.fecha_fin) : null,
  };

  const licencia = await prisma.licencia.create({ data });
  return NextResponse.json(licencia, { status: 201 });
}