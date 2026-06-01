import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const productos = await prisma.producto.findMany({
    include: { categoria: true },
    where: { activo: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(productos);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const producto = await prisma.producto.create({ data: body });
  return NextResponse.json(producto, { status: 201 });
}