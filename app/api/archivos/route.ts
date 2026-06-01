import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const archivos = await prisma.archivoTecnico.findMany({
    include: { usuario: { select: { nombre: true } } },
    orderBy: { fecha_subida: "desc" },
  });
  return NextResponse.json(archivos);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const user = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

  const body = await req.json();
  const data = {
    ...body,
    id_usuario: user.id,
  };

  const archivo = await prisma.archivoTecnico.create({ data });
  return NextResponse.json(archivo, { status: 201 });
}