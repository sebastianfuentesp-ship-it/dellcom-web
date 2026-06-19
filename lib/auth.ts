/**
 * Configuración de NextAuth.js para la autenticación del panel DELLCOM.
 * Estrategia: JWT (sin base de datos de sesiones) con CredentialsProvider.
 * Roles soportados: "admin" | "tecnico" | "vendedor"
 */
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        usuario: { label: "Usuario", type: "text" },
        contrasena: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        // Rechaza inmediatamente si faltan campos
        if (!credentials?.usuario || !credentials?.contrasena) {
          return null;
        }

        try {
          const user = await prisma.usuario.findUnique({
            where: { usuario: credentials.usuario },
          });

          // Verifica que el usuario exista y esté activo
          if (!user || !user.activo) {
            return null;
          }

          // Compara la contraseña enviada con el hash almacenado (bcrypt)
          const valid = await bcrypt.compare(credentials.contrasena, user.contrasena);

          if (!valid) {
            return null;
          }

          // Devuelve los datos que se guardarán en el token JWT
          return {
            id: String(user.id),
            name: user.nombre,
            email: user.email,
            role: user.rol,
            mustChangePassword: user.mustChangePassword,
          };
        } catch (error) {
          console.error("[Auth] Database connection or query error during authorize:", error);
          return null;
        }
      },
    }),
  ],
  // Usa JWT en lugar de sesiones en base de datos (sin tabla de sesiones)
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as { role?: string; mustChangePassword?: boolean; id?: string };
        token.role = u.role;
        token.mustChangePassword = u.mustChangePassword;
        token.id = u.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const su = session.user as { role?: string; mustChangePassword?: boolean; id?: string };
        su.role = token.role as string;
        su.mustChangePassword = token.mustChangePassword as boolean;
        su.id = token.id as string;
      }
      return session;
    },
  },
  // Redirige a esta página cuando se requiere autenticación
  pages: { signIn: "/admin/login" },
  secret: process.env.NEXTAUTH_SECRET,
};
