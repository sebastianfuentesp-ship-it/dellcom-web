/**
 * Helper de autorización por rol para las rutas API del panel admin.
 * Roles: "admin" | "tecnico" | "vendedor"
 */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export type Rol = "admin" | "tecnico" | "vendedor";

type AuthResult =
  | { authorized: true; role: Rol; email: string }
  | { authorized: false; errorResponse: NextResponse };

// Verifica que haya sesión activa y que el rol esté en la lista permitida
export async function requireRole(allowedRoles: Rol[]): Promise<AuthResult> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { authorized: false, errorResponse: NextResponse.json({ error: "No autorizado" }, { status: 401 }) };
  }

  const role = (session.user as { role?: Rol })?.role as Rol;
  if (!allowedRoles.includes(role)) {
    return { authorized: false, errorResponse: NextResponse.json({ error: "Permisos insuficientes" }, { status: 403 }) };
  }

  return { authorized: true, role, email: session.user?.email || "" };
}
