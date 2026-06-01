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
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const licencia = await prisma.licencia.create({ data: body });
  return NextResponse.json(licencia, { status: 201 });
}