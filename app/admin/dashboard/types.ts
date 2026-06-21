export interface Licencia {
  id: number;
  software: string;
  correo_cuenta: string;
  contrasena: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  nombre_cliente: string;
  telefono: string | null;
  estado: string;
  observaciones: string | null;
}

export interface ArchivoTecnico {
  id: number;
  nombre: string;
  tipo: string;
  url_archivo: string;
  descripcion: string | null;
  fecha_subida: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string | null;
  activo: boolean;
  id_categoria: number;
  categoria?: {
    id: number;
    nombre: string;
  };
  imagen_url: string | null;
}

export interface MensajeContacto {
  id: number;
  nombre: string;
  correo: string;
  telefono: string | null;
  asunto: string;
  mensaje: string;
  leido: boolean;
  fecha: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  usuario: string;
  email: string;
  rol: string;
  activo: boolean;
  createdAt: string;
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  icono_url: string | null;
  activo: boolean;
}

export interface TrabajoRealizado {
  id: number;
  id_servicio: number | null;
  servicio?: Servicio | null;
  titulo: string;
  descripcion: string | null;
  imagen_url: string;
  fecha: string;
}
