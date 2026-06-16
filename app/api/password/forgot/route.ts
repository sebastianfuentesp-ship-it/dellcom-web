import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { transporter, FROM } from "@/lib/mailer";
import { resetPasswordEmail } from "@/lib/emailTemplates";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Correo requerido." }, { status: 400 });
    }

    const user = await prisma.usuario.findUnique({ where: { email: email.toLowerCase().trim() } });

    if (user && user.activo) {
      await prisma.passwordResetToken.updateMany({
        where: { email: user.email, used: false },
        data: { used: true },
      });

      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await prisma.passwordResetToken.create({
        data: { token, email: user.email, expiresAt },
      });

      const resetUrl = `${process.env.NEXTAUTH_URL}/admin/reset-password?token=${token}`;

      await transporter.sendMail({
        from: FROM,
        to: user.email,
        subject: "Restablecer contraseña — DELLCOM SAC",
        html: resetPasswordEmail({ nombre: user.nombre, usuario: user.usuario, resetUrl }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[forgot-password]", error);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
