import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Consulta ultra ligera para mantener activa la base de datos
    await prisma.$executeRawUnsafe("SELECT 1;");
    
    console.log("[Keep-Alive Cron]: Database pinged successfully at", new Date().toISOString());
    
    return NextResponse.json({ 
      success: true, 
      message: "Database pinged successfully. Keep-alive active." 
    });
  } catch (error) {
    console.error("[Keep-Alive Cron Error]:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Could not ping database." 
    }, { status: 500 });
  }
}
