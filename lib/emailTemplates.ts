const LOGO_SVG = `
<svg viewBox="0 0 100 100" width="48" height="48" xmlns="http://www.w3.org/2000/svg" style="display:block;">
  <circle cx="50" cy="50" r="46" stroke="#dc2626" stroke-width="3" fill="none" opacity="0.85"/>
  <circle cx="50" cy="50" r="43" fill="#000000"/>
  <path d="M 48 20 C 40 20, 36 24, 36 28 C 30 28, 27 33, 29 39 C 24 41, 23 48, 26 53 C 21 57, 21 64, 25 68 C 23 74, 28 80, 35 80 C 38 80, 42 78, 44 76 C 46 78, 48 80, 48 80 Z" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M 48 32 C 40 32, 38 38, 44 42 C 34 46, 38 56, 44 56 C 36 60, 40 70, 48 70" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <line x1="50" y1="18" x2="50" y2="82" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="3 3"/>
  <path d="M 52 24 L 66 24 L 66 32 M 52 38 L 74 38 L 74 46 M 52 50 L 64 50 L 72 58 M 52 64 L 72 64 M 52 74 L 64 74 L 64 68" stroke="#dc2626" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle cx="66" cy="32" r="3" fill="#dc2626"/>
  <circle cx="74" cy="46" r="3" fill="#dc2626"/>
  <circle cx="72" cy="58" r="3" fill="#dc2626"/>
  <circle cx="72" cy="64" r="3" fill="#dc2626"/>
  <circle cx="64" cy="68" r="3" fill="#dc2626"/>
</svg>`;

const emailWrapper = (content: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>DELLCOM SAC - Portal de Gestión</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8fafc;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(15,23,42,0.03);">
          
          <!-- Top Accent Bar -->
          <tr>
            <td height="4" style="background-color:#dc2626;line-height:4px;font-size:4px;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="background-color:#09090b;padding:32px 36px;border-bottom:1px solid #27272a;">
              <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                <tr>
                  <td style="vertical-align:middle;padding-right:16px;">${LOGO_SVG}</td>
                  <td style="vertical-align:middle;">
                    <p style="margin:0;font-size:19px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;font-family:'Outfit',sans-serif;line-height:1.2;">DELLCOM SAC</p>
                    <p style="margin:2px 0 0 0;font-size:9px;font-weight:700;color:#dc2626;text-transform:uppercase;letter-spacing:2px;font-family:'Outfit',sans-serif;line-height:1.1;">Portal de Gestión Interna</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="background-color:#ffffff;padding:40px 36px 32px 36px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f1f5f9;border-top:1px solid #e2e8f0;padding:20px 36px;text-align:center;">
              <p style="margin:0;font-size:10px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:1px;line-height:1.4;">
                © 2026 DELLCOM SAC — Av. Santa Elvira, Los Olivos, Lima, Perú
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export function welcomeEmail(params: {
  nombre: string;
  usuario: string;
  tempPassword: string;
  rol: string;
  loginUrl: string;
}): string {
  const rolLabel: Record<string, string> = {
    admin: "Administrador",
    tecnico: "Técnico",
    vendedor: "Vendedor",
  };

  return emailWrapper(`
    <h1 style="margin:0 0 10px 0;font-size:22px;font-weight:900;color:#0f172a;font-family:'Outfit',sans-serif;">¡Bienvenido/a, ${params.nombre}!</h1>
    <p style="margin:0 0 24px 0;font-size:14px;color:#475569;line-height:1.6;">
      Tu cuenta en el portal de gestión interna de DELLCOM SAC ha sido creada exitosamente con el rol de
      <strong style="color:#0f172a;">${rolLabel[params.rol] ?? params.rol}</strong>.
      Usa las siguientes credenciales para realizar tu primer acceso:
    </p>

    <!-- Credentials Card -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;margin-bottom:24px;border-collapse:collapse;">
      <tr>
        <td style="padding:20px 24px;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
            <tr>
              <td style="padding-bottom:16px;">
                <span style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1.5px;font-family:'Outfit',sans-serif;display:block;margin-bottom:4px;">Usuario</span>
                <code style="font-size:15px;font-weight:700;color:#0f172a;background-color:#e2e8f0;padding:6px 12px;border-radius:6px;display:inline-block;font-family:monospace;border:1px solid #cbd5e1;">${params.usuario}</code>
              </td>
            </tr>
            <tr>
              <td>
                <span style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1.5px;font-family:'Outfit',sans-serif;display:block;margin-bottom:4px;">Contraseña Temporal</span>
                <code style="font-size:15px;font-weight:700;color:#dc2626;background-color:#fee2e2;padding:6px 12px;border-radius:6px;display:inline-block;font-family:monospace;border:1px solid #fecaca;">${params.tempPassword}</code>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Warning Callout Box -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fffbeb;border:1px solid #fef3c7;border-radius:12px;margin-bottom:28px;border-collapse:collapse;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0;font-size:12.5px;color:#92400e;font-weight:600;line-height:1.6;font-family:'Outfit',sans-serif;">
            ⚠️ Al ingresar por primera vez, el sistema te solicitará que establezcas tu propia contraseña de acceso segura. Esta contraseña temporal quedará invalidada inmediatamente después de realizar ese cambio.
          </p>
        </td>
      </tr>
    </table>

    <!-- CTA Button -->
    <div style="text-align:left;margin-top:24px;">
      <a href="${params.loginUrl}" style="display:inline-block;background-color:#dc2626;color:#ffffff;font-weight:700;font-size:14px;padding:14px 32px;border-radius:999px;text-decoration:none;letter-spacing:0.5px;text-transform:uppercase;box-shadow:0 4px 10px rgba(220,38,38,0.2);font-family:'Outfit',sans-serif;">
        Acceder al portal →
      </a>
    </div>
  `);
}

export function resetPasswordEmail(params: {
  nombre: string;
  usuario: string;
  resetUrl: string;
}): string {
  return emailWrapper(`
    <h1 style="margin:0 0 10px 0;font-size:22px;font-weight:900;color:#0f172a;font-family:'Outfit',sans-serif;">Restablecer contraseña</h1>
    <p style="margin:0 0 24px 0;font-size:14px;color:#475569;line-height:1.6;">
      Hola <strong style="color:#0f172a;">${params.nombre}</strong>,<br />
      Hemos recibido una solicitud para restablecer la contraseña de acceso a tu cuenta de usuario <strong style="color:#0f172a;">${params.usuario}</strong> en nuestro panel administrativo. Haz clic en el botón inferior para establecer una nueva credencial:
    </p>

    <!-- CTA Button -->
    <div style="text-align:left;margin:28px 0;">
      <a href="${params.resetUrl}" style="display:inline-block;background-color:#dc2626;color:#ffffff;font-weight:700;font-size:14px;padding:14px 32px;border-radius:999px;text-decoration:none;letter-spacing:0.5px;text-transform:uppercase;box-shadow:0 4px 10px rgba(220,38,38,0.2);font-family:'Outfit',sans-serif;">
        Restablecer contraseña →
      </a>
    </div>

    <!-- Info Callout Box -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;margin-top:24px;border-collapse:collapse;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0;font-size:12.5px;color:#64748b;line-height:1.6;font-family:'Outfit',sans-serif;">
            🔒 Este enlace de recuperación es de <strong>un solo uso</strong> y expira automáticamente en <strong>1 hora</strong>. Si no has solicitado este cambio, por favor ignora este correo de forma segura — tu contraseña actual no será modificada.
          </p>
        </td>
      </tr>
    </table>
  `);
}
