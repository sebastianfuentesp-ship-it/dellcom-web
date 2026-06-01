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
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const archivo = await prisma.archivoTecnico.create({ data: body });
  return NextResponse.json(archivo, { status: 201 });
}