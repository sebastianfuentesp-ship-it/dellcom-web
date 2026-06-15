# DELLCOM SAC - Plataforma Corporativa y Sistema Administrativo IT

Este repositorio contiene la solucion de software integral para la corporacion DELLCOM SAC, un centro tecnologico especializado en soporte tecnico de computadoras, redes y suministros IT, ubicado en Los Olivos, Lima. El proyecto combina un portal publico de alta gama con un panel administrativo protegido de nivel empresarial para tecnicos y administradores.

La solucion esta desarrollada con Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Prisma ORM con MySQL en Railway, NextAuth.js para autenticacion JWT, y un conjunto de herramientas de ingenieria de software de alta calidad (Zod, bcryptjs, Jest, GitHub Actions).

---

## Estructura Completa de Directorios del Proyecto

```
DELLCOM-WEB/
├── .github/
│   └── workflows/
│       └── nextjs.yml                  # Pipeline de CI: lint, tests, typecheck y build
├── __tests__/
│   └── api.test.ts                     # Pruebas unitarias de esquemas de datos con Jest
├── app/
│   ├── admin/
│   │   ├── dashboard/
│   │   │   └── page.tsx                # Panel principal con 8 modulos CRUD (tabs + modales)
│   │   ├── login/
│   │   │   └── page.tsx                # Login glassmorphic con video de fondo y JWT
│   │   └── layout.tsx                  # Layout con SessionProvider de NextAuth
│   ├── api/
│   │   ├── admin/
│   │   │   ├── contacto/
│   │   │   │   └── route.ts            # GET/PUT/DELETE mensajes de contacto (admin)
│   │   │   ├── upload/
│   │   │   │   └── route.ts            # POST carga de archivos: AWS S3 o fallback local
│   │   │   └── usuarios/
│   │   │       └── route.ts            # GET/POST/PUT/PATCH CRUD de personal (solo admin)
│   │   ├── archivos/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts            # PUT/DELETE archivo especifico
│   │   │   └── route.ts                # GET/POST archivos y drivers tecnicos
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts            # Handler interno de NextAuth.js
│   │   ├── categorias/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts            # PUT/DELETE categoria especifica
│   │   │   └── route.ts                # GET/POST categorias del catalogo
│   │   ├── contacto/
│   │   │   └── route.ts                # POST formulario publico (Zod + rate limiting + sanitizacion HTML)
│   │   ├── cron/
│   │   │   └── check-licencias/
│   │   │       └── route.ts            # GET/POST job de vencimiento de licencias (Bearer token)
│   │   ├── licencias/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts            # PUT/DELETE licencia especifica
│   │   │   └── route.ts                # GET/POST licencias de software de clientes
│   │   ├── productos/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts            # GET/PUT/DELETE producto especifico
│   │   │   └── route.ts                # GET/POST productos del catalogo
│   │   ├── servicios/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts            # PUT/DELETE servicio especifico
│   │   │   └── route.ts                # GET/POST servicios de TI
│   │   └── trabajos/
│   │       ├── [id]/
│   │       │   └── route.ts            # PUT/DELETE trabajo de portafolio especifico
│   │       └── route.ts                # GET/POST trabajos realizados (portafolio)
│   ├── components/
│   │   ├── AnyDeskConsole.tsx          # Consola interactiva de consulta de IDs AnyDesk
│   │   ├── CleanFooter.tsx             # Pie de pagina corporativo con redes y accesos
│   │   ├── CotizadorExpress.tsx        # Generador rapido de cotizaciones
│   │   ├── HomeHeroSearch.tsx          # Buscador de diagnostico de fallas con autocomplete
│   │   ├── PortfolioGallery.tsx        # Carrusel de trabajos realizados con modal
│   │   ├── ScrollRevealObserver.tsx    # Animaciones de fade-in por scroll (IntersectionObserver)
│   │   ├── SmartAssistant.tsx          # Chatbot flotante con respuestas por palabras clave
│   │   └── StatusHeader.tsx            # Barra de navegacion principal con logo SVG
│   ├── contacto/
│   │   ├── layout.tsx
│   │   └── page.tsx                    # Formulario publico de consultas con validacion
│   ├── descargas/
│   │   ├── layout.tsx
│   │   └── page.tsx                    # Repositorio publico de drivers y manuales
│   ├── nosotros/
│   │   └── page.tsx                    # Trayectoria, vision, mision y valores corporativos
│   ├── productos/
│   │   ├── layout.tsx
│   │   └── page.tsx                    # Catalogo virtual con filtros, carrito y vista rapida
│   ├── servicios/
│   │   └── page.tsx                    # Servicios de TI en layout de filas alternas
│   ├── soporte/
│   │   └── page.tsx                    # Guia de soporte remoto AnyDesk con consola interactiva
│   ├── globals.css                     # Estilos globales y tokens de Tailwind CSS v4
│   ├── layout.tsx                      # Raiz de la app: tipografia Outfit e iconos Material
│   └── page.tsx                        # Landing page principal (Hero, Bento Grid, Portafolio)
├── lib/
│   ├── auth.ts                         # Configuracion de NextAuth: proveedor, callbacks JWT, roles
│   └── prisma.ts                       # Cliente Prisma singleton (previene multiples instancias)
├── prisma/
│   └── schema.prisma                   # Modelos relacionales y conectores MySQL
├── public/
│   ├── img/
│   │   ├── portafolio/                 # Fotos de trabajos realizados
│   │   ├── productos/                  # Imagenes del catalogo de suministros
│   │   └── servicios/                  # Imagenes de servicios de TI
│   ├── vid/
│   │   └── laptop_video.mp4            # Video de fondo del login administrativo
│   └── uploads/                        # Directorio de fallback para archivos subidos localmente
├── scripts/
│   └── seed.ts                         # Poblado inicial de la BD (npx prisma db seed)
├── Dockerfile                          # Imagen Docker de produccion
├── docker-compose.yml                  # Orquestacion de contenedores para desarrollo
├── eslint.config.mjs                   # Configuracion ESLint (next/core-web-vitals + typescript)
├── jest.config.js                      # Configuracion Jest con ts-jest
├── middleware.ts                       # Control de acceso por roles (RBAC) y rutas protegidas
├── next.config.ts                      # Configuracion de compilacion de Next.js
├── package.json                        # Dependencias y scripts del proyecto
└── tsconfig.json                       # Configuracion de TypeScript en modo estricto
```

---

## Modulos y Funcionalidades Principales

### 1. Portal Corporativo Publico (Frontend)

* **Landing Page (Hero & Bento Grid)**: Seccion de bienvenida con acceso directo a soporte por WhatsApp, buscador de diagnostico de fallas con autocomplete (`HomeHeroSearch`) y bento grid con propuesta de valor.
* **Servicios de TI**: Visualizacion dinamica de servicios (Soporte, Redes, Licenciamiento, Hardware) con layout de filas alternas que combina descripciones y fotografias locales.
* **Catalogo Virtual y Carrito de Cotizacion**: Exposicion de suministros con filtros por categoria y busqueda en tiempo real. Incluye carrito de cotizacion via `localStorage` que envia solicitudes formateadas a WhatsApp, y modal de Vista Rapida implementado con React Portal.
* **Portafolio de Trabajos**: Carrusel animado (`PortfolioGallery`) con fotos reales de instalaciones, cableado y reparaciones realizadas.
* **Descargas de Soporte**: Repositorio publico de drivers oficiales, manuales e instaladores clasificados por tipo.
* **Soporte Remoto (/soporte)**: Guia paso a paso de AnyDesk con consola interactiva de consulta de IDs de conexion (`AnyDeskConsole`).
* **Formulario de Contacto (/contacto)**: Validacion con Zod, rate limiting por IP (5 envios cada 10 minutos) y sanitizacion HTML antes de persistir en la BD.
* **Asistente Virtual (Chatbot)**: Componente flotante (`SmartAssistant`) con respuestas automaticas por palabras clave (horarios, ubicacion, AnyDesk, servicios). Se oculta automaticamente en rutas `/admin/*`.

### 2. Panel Administrativo Protegido (/admin/dashboard)

Acceso restringido por JWT. Los roles disponibles son `admin`, `tecnico` y `vendedor`.

* **Gestion de Licencias**: Registro de cuentas de correo, claves y vigencias de licencias de software (Windows, Office, Antivirus) vendidas a clientes. Alertas visuales por proximidad de vencimiento (activo / por vencer / vencido).
* **Archivos y Drivers**: Repositorio interno de ejecutables, drivers, planillas Excel y enlaces utiles con subida fisica via AWS S3 o fallback local.
* **Catalogo de Productos**: CRUD completo de suministros (ribbons, tintas, memorias, accesorios). Incluye subida de imagen, asignacion de categoria y toggle de visibilidad en la web publica.
* **Categorias de Productos**: Creacion y desactivacion de las categorias que agrupan el catalogo virtual.
* **Gestion de Servicios**: Alta, edicion y desactivacion de los servicios de TI mostrados en la web publica. El icono se configura con un nombre de Material Symbol.
* **Portafolio / Trabajos Realizados**: Registro de fotos y descripcion de proyectos completados, asociados opcionalmente a un servicio.
* **Mensajes de Contacto**: Bandeja de entrada con mensajes del formulario publico. Permite marcar como leido/no leido y eliminar.
* **Gestion de Personal (solo admin)**: CRUD de usuarios con hash bcrypt de contrasenas, asignacion de roles y activacion/desactivacion de cuentas.

---

## Calidad de Software e Ingenieria de Codigo

* **Validacion con Zod**: Todos los endpoints administrativos y el formulario de contacto validan los payloads con esquemas Zod en el servidor.
* **Seguridad Criptografica**: Contrasenas de personal hasheadas con `bcryptjs` (10 salt rounds) antes de persistirse. Nunca se almacenan en texto plano.
* **Sanitizacion de Inputs**: Los campos de texto del formulario de contacto publico son sanitizados para eliminar etiquetas HTML antes de guardarse en la base de datos.
* **Rate Limiting**: El endpoint `POST /api/contacto` limita a 5 envios por IP cada 10 minutos, retornando HTTP 429 si se supera el limite.
* **Control de Acceso basado en Roles (RBAC)**: El middleware protege todas las rutas administrativas. Solo los administradores pueden gestionar usuarios; tecnicos y vendedores tienen acceso de solo lectura a licencias y archivos.
* **Automatizacion de Licencias (Cron Job)**: Endpoint `GET /api/cron/check-licencias` protegido por Bearer Token que actualiza automaticamente el estado de licencias cuya fecha de fin ya paso. Requiere la variable `CRON_SECRET` en produccion.
* **Carga de Archivos Hibrida (AWS S3 / Local)**: El endpoint `POST /api/admin/upload` detecta automaticamente si las credenciales de S3 estan configuradas. Si lo estan, sube el archivo al bucket S3. Si no, escribe en `public/uploads/` de forma transparente.
* **Pruebas con Jest**: Suite de pruebas unitarias en `__tests__/` configurada con `ts-jest` para validar esquemas y logica de datos.
* **Pipeline CI con GitHub Actions**: Se ejecuta en cada push a `main`: instala dependencias, genera cliente Prisma, corre ESLint, ejecuta Jest, valida TypeScript y compila el build de Next.js.

---

## Esquema de Base de Datos (Prisma ORM + MySQL)

### Sistema Administrativo

| Modelo | Descripcion | Campos clave |
|--------|-------------|--------------|
| `Usuario` | Personal de DELLCOM | `usuario` (unico), `email` (unico), `contrasena` (hash), `rol` (admin/tecnico/vendedor), `activo` |
| `Licencia` | Licencias de software vendidas a clientes | `software`, `correo_cuenta`, `contrasena`, `fecha_inicio`, `fecha_fin`, `nombre_cliente`, `estado` (activo/vencido) |
| `ArchivoTecnico` | Drivers, instaladores y documentos | `nombre`, `tipo` (programa/driver/excel/link), `url_archivo`, `fecha_subida` |

### Sistema Web Publico

| Modelo | Descripcion | Campos clave |
|--------|-------------|--------------|
| `Servicio` | Servicios de TI ofrecidos | `nombre`, `descripcion`, `icono_url` (Material Symbol), `activo` |
| `Categoria` | Categorias del catalogo | `nombre` (unico), `activo` |
| `Producto` | Suministros del catalogo | `nombre`, `precio` (Decimal 10,2), `imagen_url`, `activo`, `id_categoria` |
| `TrabajoRealizado` | Fotos del portafolio | `titulo`, `descripcion`, `imagen_url`, `fecha`, `id_servicio` (opcional) |
| `MensajeContacto` | Consultas del formulario publico | `nombre`, `correo`, `telefono`, `asunto`, `mensaje`, `leido`, `fecha` |

**Relaciones:** `Usuario` 1:N `Licencia`, `Usuario` 1:N `ArchivoTecnico`, `Categoria` 1:N `Producto`, `Servicio` 1:N `TrabajoRealizado`.

---

## Variables de Entorno (.env)

Cree un archivo `.env` en la raiz del proyecto:

```env
# 1. Base de Datos
DATABASE_URL="mysql://usuario:contrasena@host:puerto/nombre_base_datos"

# 2. NextAuth
NEXTAUTH_SECRET="clave_aleatoria_segura_de_minimo_32_caracteres"
NEXTAUTH_URL="http://localhost:3000"

# 3. AWS S3 (Opcional - si no se configura, los archivos se guardan en public/uploads/)
AWS_ACCESS_KEY_ID="tu_access_key_id_de_iam"
AWS_SECRET_ACCESS_KEY="tu_secret_access_key_de_iam"
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="nombre_del_bucket_s3"

# 4. Cron Job (Requerido para /api/cron/check-licencias)
CRON_SECRET="clave_aleatoria_segura_para_el_cron"
```

---

## Instalacion y Despliegue Local

1. Clonar el repositorio e instalar dependencias:
   ```bash
   npm install
   ```

2. Generar el cliente de Prisma:
   ```bash
   npx prisma generate
   ```

3. Sincronizar el esquema con la base de datos:
   ```bash
   npx prisma db push
   ```

4. Poblar la base de datos con datos iniciales y el administrador por defecto:
   ```bash
   npx prisma db seed
   ```
   > Las credenciales por defecto son `admin` / `admin123`. Cambialas inmediatamente al ingresar al panel.

5. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

La aplicacion estara disponible en `http://localhost:3000` y el panel admin en `http://localhost:3000/admin/login`.

---

## Catalogo de Endpoints de la API

### Publicos (sin autenticacion)

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/productos` | Lista productos activos. `?all=true` para incluir inactivos |
| GET | `/api/productos/[id]` | Detalle de un producto |
| GET | `/api/servicios` | Lista servicios activos |
| GET | `/api/categorias` | Lista categorias activas |
| GET | `/api/trabajos` | Lista trabajos del portafolio |
| GET | `/api/archivos` | Lista drivers y manuales disponibles |
| POST | `/api/contacto` | Envia mensaje de contacto (rate limit: 5/10min por IP) |

### Administrativos (requieren sesion activa)

| Metodo | Endpoint | Rol minimo | Descripcion |
|--------|----------|------------|-------------|
| GET | `/api/licencias` | tecnico | Lista todas las licencias |
| POST | `/api/licencias` | tecnico | Registra nueva licencia |
| PUT | `/api/licencias/[id]` | tecnico | Edita licencia |
| DELETE | `/api/licencias/[id]` | tecnico | Elimina licencia |
| GET | `/api/archivos` | tecnico | Lista archivos tecnicos |
| POST | `/api/archivos` | tecnico | Registra nuevo archivo |
| PUT | `/api/archivos/[id]` | admin | Edita archivo |
| DELETE | `/api/archivos/[id]` | admin | Elimina archivo |
| POST | `/api/productos` | tecnico | Crea producto |
| PUT | `/api/productos/[id]` | tecnico | Edita producto |
| DELETE | `/api/productos/[id]` | tecnico | Desactiva producto (soft delete) |
| POST | `/api/categorias` | tecnico | Crea categoria |
| PUT | `/api/categorias/[id]` | tecnico | Edita categoria |
| DELETE | `/api/categorias/[id]` | tecnico | Desactiva categoria |
| POST | `/api/servicios` | tecnico | Crea servicio |
| PUT | `/api/servicios/[id]` | tecnico | Edita servicio |
| DELETE | `/api/servicios/[id]` | tecnico | Desactiva servicio |
| POST | `/api/trabajos` | tecnico | Registra trabajo de portafolio |
| PUT | `/api/trabajos/[id]` | tecnico | Edita trabajo |
| DELETE | `/api/trabajos/[id]` | tecnico | Elimina trabajo |
| POST | `/api/admin/upload` | tecnico | Sube archivo a S3 o local |
| GET | `/api/admin/contacto` | tecnico | Lista mensajes de contacto |
| PUT | `/api/admin/contacto` | tecnico | Marca mensaje como leido/no leido |
| DELETE | `/api/admin/contacto?id=X` | tecnico | Elimina mensaje |
| GET | `/api/admin/usuarios` | admin | Lista personal registrado |
| POST | `/api/admin/usuarios` | admin | Crea nuevo usuario |
| PUT | `/api/admin/usuarios` | admin | Edita perfil de usuario |
| PATCH | `/api/admin/usuarios` | admin | Activa o desactiva cuenta |

### Automatizacion

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET/POST | `/api/cron/check-licencias` | Marca como vencidas las licencias expiradas. Requiere header `Authorization: Bearer <CRON_SECRET>` |

---

## Control de Calidad y Compilacion

```bash
# Pruebas unitarias
npm run test

# Verificacion de tipos TypeScript
npx tsc --noEmit

# Lint
npm run lint

# Build de produccion
npm run build

# Iniciar en produccion
npm run start
```
