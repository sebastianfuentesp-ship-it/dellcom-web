import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const producto = await prisma.producto.findUnique({
    where: { id: Number(params.id) },
    include: { categoria: true },
  });
  if (!producto) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(producto);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const producto = await prisma.producto.update({
    where: { id: Number(params.id) },
    data: body,
  });
  return NextResponse.json(producto);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  await prisma.producto.update({
    where: { id: Number(params.id) },
    data: { activo: false }, // soft delete
  });
  return NextResponse.json({ ok: true });
}