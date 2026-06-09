import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const method = req.method;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    // Técnico y vendedor NO pueden modificar licencias ni archivos
    // Solo pueden verlos (GET)
    const esAdmin = token.role === "admin";
    const esEscritura = ["POST", "PUT", "DELETE"].includes(method);

    if (
      (path.startsWith("/api/licencias") ||
        path.startsWith("/api/archivos")) &&
      !esAdmin &&
      esEscritura
    ) {
      return NextResponse.json(
        { error: "No tienes permisos para esta acción" },
        { status: 403 }
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        const method = req.method;

        // Public GET API routes that do not require authentication
        const isPublicGetApi =
          (path.startsWith("/api/productos") ||
            path.startsWith("/api/servicios") ||
            path.startsWith("/api/trabajos") ||
            path.startsWith("/api/categorias") ||
            path.startsWith("/api/archivos")) &&
          method === "GET";

        if (isPublicGetApi) {
          return true;
        }

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/productos/:path*",
    "/admin/servicios/:path*",
    "/admin/trabajos/:path*",
    "/admin/categorias/:path*",
    "/admin/licencias/:path*",
    "/admin/archivos/:path*",
    "/api/productos/:path*",
    "/api/servicios/:path*",
    "/api/trabajos/:path*",
    "/api/categorias/:path*",
    "/api/licencias/:path*",
    "/api/archivos/:path*",
  ],
};