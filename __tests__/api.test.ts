import { z } from "zod";

// ─── Helpers ────────────────────────────────────────────────────────────────

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "").trim();
}

// ─── Schemas (mirrors de los usados en las rutas de API) ────────────────────

const ContactSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres").transform(stripHtml),
  correo: z.string().email("El correo electronico no es valido"),
  telefono: z.string().nullable().optional().transform((v) => (v ? stripHtml(v) : v)),
  asunto: z.string().min(3, "El asunto debe tener al menos 3 caracteres").transform(stripHtml),
  mensaje: z.string().min(5, "El mensaje debe tener al menos 5 caracteres").transform(stripHtml),
});

const CreateUserSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  usuario: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
  email: z.string().email("El correo electronico no es valido"),
  contrasena: z.string().min(6, "La contrasena debe tener al menos 6 caracteres"),
  rol: z.enum(["admin", "tecnico", "vendedor"]),
});

const LicenciaSchema = z.object({
  software: z.string().min(1),
  correo_cuenta: z.string().email(),
  contrasena: z.string().min(1),
  nombre_cliente: z.string().min(1),
  telefono: z.string().nullable().optional(),
  fecha_inicio: z.string(),
  fecha_fin: z.string().nullable().optional(),
  observaciones: z.string().nullable().optional(),
  estado: z.enum(["activo", "vencido"]),
});

// ─── Tests: Formulario de Contacto ──────────────────────────────────────────

describe("ContactSchema - Validacion de formulario de contacto", () => {
  it("acepta datos correctos y los pasa sin cambios", () => {
    const input = {
      nombre: "Juan Perez",
      correo: "juan.perez@example.com",
      telefono: "987654321",
      asunto: "Soporte Tecnico",
      mensaje: "Tengo un problema con la impresora Zebra que no imprime etiquetas.",
    };
    const result = ContactSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("rechaza nombre menor a 3 caracteres", () => {
    const result = ContactSchema.safeParse({
      nombre: "Jo",
      correo: "juan@example.com",
      asunto: "Soporte",
      mensaje: "Ayuda con algo",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.nombre).toBeDefined();
    }
  });

  it("rechaza correo electronico invalido", () => {
    const result = ContactSchema.safeParse({
      nombre: "Juan Perez",
      correo: "no-es-un-correo",
      asunto: "Soporte",
      mensaje: "Ayuda con la impresora",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.correo).toBeDefined();
    }
  });

  it("rechaza mensaje menor a 5 caracteres", () => {
    const result = ContactSchema.safeParse({
      nombre: "Maria Lopez",
      correo: "maria@example.com",
      asunto: "Consulta",
      mensaje: "ok",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.mensaje).toBeDefined();
    }
  });

  it("acepta telefono como campo opcional (undefined)", () => {
    const result = ContactSchema.safeParse({
      nombre: "Ana Torres",
      correo: "ana@example.com",
      asunto: "Consulta de precio",
      mensaje: "Quisiera saber el precio del ribbon Zebra.",
    });
    expect(result.success).toBe(true);
  });

  it("acepta telefono como null explícito", () => {
    const result = ContactSchema.safeParse({
      nombre: "Carlos Ruiz",
      correo: "carlos@example.com",
      telefono: null,
      asunto: "Reparacion laptop",
      mensaje: "Mi laptop no enciende desde ayer.",
    });
    expect(result.success).toBe(true);
  });
});

// ─── Tests: Sanitizacion HTML ────────────────────────────────────────────────

describe("stripHtml - Sanitizacion de etiquetas HTML", () => {
  it("elimina etiquetas HTML de un string dejando el contenido de texto", () => {
    expect(stripHtml("<script>alert('xss')</script>Hola")).toBe("alert('xss')Hola");
  });

  it("elimina etiquetas de formato tipico", () => {
    expect(stripHtml("<b>Negrita</b> y <i>cursiva</i>")).toBe("Negrita y cursiva");
  });

  it("deja texto plano sin cambios", () => {
    expect(stripHtml("Texto normal sin etiquetas")).toBe("Texto normal sin etiquetas");
  });

  it("elimina atributos dentro de etiquetas", () => {
    expect(stripHtml('<a href="http://evil.com">click</a>')).toBe("click");
  });

  it("los campos del ContactSchema aplican sanitizacion al transformar", () => {
    const result = ContactSchema.safeParse({
      nombre: "<b>Juan</b>",
      correo: "juan@example.com",
      asunto: "<script>xss</script>Soporte",
      mensaje: "Mensaje normal de prueba.",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.nombre).toBe("Juan");
      expect(result.data.asunto).toBe("xssSoporte");
    }
  });
});

// ─── Tests: Creacion de Usuario ──────────────────────────────────────────────

describe("CreateUserSchema - Validacion de registro de personal", () => {
  it("acepta un usuario valido con rol tecnico", () => {
    const result = CreateUserSchema.safeParse({
      nombre: "Pedro Sanchez",
      usuario: "pedro_s",
      email: "pedro@dellcom.pe",
      contrasena: "clave123",
      rol: "tecnico",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza rol invalido", () => {
    const result = CreateUserSchema.safeParse({
      nombre: "Pedro Sanchez",
      usuario: "pedro_s",
      email: "pedro@dellcom.pe",
      contrasena: "clave123",
      rol: "superusuario",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza contrasena menor a 6 caracteres", () => {
    const result = CreateUserSchema.safeParse({
      nombre: "Pedro Sanchez",
      usuario: "pedro_s",
      email: "pedro@dellcom.pe",
      contrasena: "123",
      rol: "vendedor",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.contrasena).toBeDefined();
    }
  });

  it("rechaza usuario menor a 3 caracteres", () => {
    const result = CreateUserSchema.safeParse({
      nombre: "Ana Gil",
      usuario: "ag",
      email: "ana@dellcom.pe",
      contrasena: "clave123",
      rol: "admin",
    });
    expect(result.success).toBe(false);
  });

  it("acepta los tres roles validos", () => {
    const roles = ["admin", "tecnico", "vendedor"] as const;
    roles.forEach((rol) => {
      const result = CreateUserSchema.safeParse({
        nombre: "Usuario Test",
        usuario: "usr_test",
        email: "test@dellcom.pe",
        contrasena: "clave123",
        rol,
      });
      expect(result.success).toBe(true);
    });
  });
});

// ─── Tests: Licencias ────────────────────────────────────────────────────────

describe("LicenciaSchema - Validacion de licencias de software", () => {
  it("acepta una licencia valida con estado activo", () => {
    const result = LicenciaSchema.safeParse({
      software: "Windows 11 Professional",
      correo_cuenta: "cliente@empresa.com",
      contrasena: "clave_licencia_123",
      nombre_cliente: "Corporacion ABC S.A.C.",
      telefono: "51987654321",
      fecha_inicio: "2026-01-01",
      fecha_fin: "2027-01-01",
      observaciones: "Licencia anual renovable",
      estado: "activo",
    });
    expect(result.success).toBe(true);
  });

  it("acepta licencia sin fecha de vencimiento (licencia permanente)", () => {
    const result = LicenciaSchema.safeParse({
      software: "Microsoft Office 2021",
      correo_cuenta: "cliente@empresa.com",
      contrasena: "clave_123",
      nombre_cliente: "Empresa XYZ",
      fecha_inicio: "2026-01-01",
      fecha_fin: null,
      estado: "activo",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza estado invalido", () => {
    const result = LicenciaSchema.safeParse({
      software: "Antivirus Pro",
      correo_cuenta: "test@test.com",
      contrasena: "pass",
      nombre_cliente: "Cliente Test",
      fecha_inicio: "2026-01-01",
      estado: "pendiente",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza correo de cuenta invalido", () => {
    const result = LicenciaSchema.safeParse({
      software: "Adobe Acrobat",
      correo_cuenta: "no-es-correo",
      contrasena: "pass",
      nombre_cliente: "Cliente Test",
      fecha_inicio: "2026-01-01",
      estado: "activo",
    });
    expect(result.success).toBe(false);
  });
});
