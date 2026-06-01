import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const trabajos = await prisma.trabajoRealizado.findMany({
    include: { servicio: true },
    orderBy: { fecha: "desc" },
  });
  return NextResponse.json(trabajos);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const trabajo = await prisma.trabajoRealizado.create({ data: body });
  return NextResponse.json(trabajo, { status: 201 });
}