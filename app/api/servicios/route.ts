import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const servicios = await prisma.servicio.findMany({
    where: { activo: true },
  });
  return NextResponse.json(servicios);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const servicio = await prisma.servicio.create({ data: body });
  return NextResponse.json(servicio, { status: 201 });
}