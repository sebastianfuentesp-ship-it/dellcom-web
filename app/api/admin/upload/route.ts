/**
 * API Route: /api/admin/upload
 * Sube un archivo enviado como multipart/form-data (campo "file").
 * Estrategia dual:
 *   - Si AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY y AWS_BUCKET_NAME están configurados
 *     → sube a S3 y devuelve la URL pública del objeto.
 *   - Si no → guarda en /public/uploads/ del servidor como fallback local.
 * Devuelve { success, url, name, size, storage: "s3" | "local" }.
 */
import { NextRequest, NextResponse } from "next/server";
import { requireRole, type Rol } from "@/lib/apiAuth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Configurar cliente de AWS S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// Qué roles pueden subir a cada carpeta (además de admin, que siempre puede)
const folderAllowedRoles: Record<string, Rol[]> = {
  productos: ["admin", "vendedor"],
  portfolio: ["admin", "tecnico"],
  uploads: ["admin", "tecnico"],
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folderParam = (formData.get("folder") as string | null) || "uploads";

    // Only allow known folder names to avoid path traversal
    const allowedFolders: Record<string, string> = {
      productos: "productos",
      portfolio: "portfolio",
      uploads: "uploads",
    };
    const folder = allowedFolders[folderParam] ?? "uploads";

    // Verificar autenticación y que el rol pueda subir a esta carpeta específica
    const auth = await requireRole(folderAllowedRoles[folder]);
    if (!auth.authorized) return auth.errorResponse;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generar un nombre de archivo único para evitar colisiones
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.name);
    const originalName = path.basename(file.name, fileExtension).replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `${originalName}-${uniqueSuffix}${fileExtension}`;

    // Validar si las credenciales de AWS S3 están configuradas
    const hasS3Config =
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.AWS_BUCKET_NAME;

    if (hasS3Config) {
      const bucketName = process.env.AWS_BUCKET_NAME!;
      const region = process.env.AWS_REGION || "us-east-1";
      const key = `${folder}/${filename}`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: buffer,
          ContentType: file.type || "application/octet-stream",
        })
      );

      const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

      return NextResponse.json({
        success: true,
        url: s3Url,
        name: file.name,
        size: file.size,
        storage: "s3",
      });
    } else {
      // Fallback local en caso de no contar con variables de entorno de S3
      const uploadDir = path.join(process.cwd(), "public", folder);

      // Asegurar que la carpeta de destino exista
      await mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);

      const relativeUrl = `/${folder}/${filename}`;

      return NextResponse.json({
        success: true,
        url: relativeUrl,
        name: file.name,
        size: file.size,
        storage: "local",
      });
    }
  } catch (error) {
    console.error("[API Admin Upload Error]:", error);
    return NextResponse.json(
      { error: "Error interno al procesar la carga del archivo" },
      { status: 500 }
    );
  }
}
