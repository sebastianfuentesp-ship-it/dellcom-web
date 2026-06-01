import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const categorias = await prisma.categoria.findMany({
    where: { activo: true },
  });
  return NextResponse.json(categorias);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const categoria = await prisma.categoria.create({ data: body });
  return NextResponse.json(categoria, { status: 201 });
}