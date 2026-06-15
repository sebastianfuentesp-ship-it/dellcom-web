# DELLCOM SAC - Plataforma Corporativa y Sistema Administrativo IT

Este repositorio contiene la solucion de software integral para la corporacion DELLCOM SAC, un centro tecnologico especializado en soporte tecnico de computadoras, redes y suministros IT, ubicado en Los Olivos, Lima. El proyecto combina un portal publico de alta gama con un panel administrativo protegido de nivel empresarial para tecnicos y administradores.

La solucion esta desarrollada utilizando Next.js con arquitectura App Router, Tailwind CSS v4 para el diseno visual, Prisma ORM con MySQL en Railway para la persistencia, y un conjunto de herramientas de ingenieria de software de alta calidad (Zod, Jest, GitHub Actions).

---

## Estructura Completa de Directorios del Proyecto

A continuacion se presenta la estructura visual del arbol de carpetas y archivos mas importantes que conforman la aplicacion:

```
DELLCOM-WEB/
├── .github/
│   └── workflows/
│       └── nextjs.yml          # Flujo de trabajo de Integracion Continua en GitHub Actions
├── __tests__/
│   └── api.test.ts             # Pruebas unitarias de esquemas de datos con Jest
├── app/
│   ├── admin/                  # Seccion administrativa (Dashboard de Gestion)
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Interfaz de panel principal (Tablas y Modales de CRUD)
│   │   ├── login/
│   │   │   └── page.tsx        # Formulario de inicio de sesion con estetica glassmorphic
│   │   └── layout.tsx          # Componente layout para inyeccion de SessionProvider de Auth
│   ├── api/                    # Endpoints API REST de Next.js (Handlers de Servidor)
│   │   ├── admin/              # APIs administrativas protegidas por rol de usuario
│   │   │   ├── contacto/
│   │   │   │   └── route.ts    # Control de lectura y eliminacion de mensajes de contacto
│   │   │   ├── upload/
│   │   │   │   └── route.ts    # Carga fisica de archivos (AWS S3 con local fallback)
│   │   │   └── usuarios/
│   │   │       └── route.ts    # CRUD administrativo de personal técnico (bcrypt hashes)
│   │   ├── archivos/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts    # APIs especificas para descarga/edicion de archivos
│   │   │   └── route.ts        # Endpoint general de archivos y drivers de soporte
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts    # Handler de enrutamiento interno para NextAuth.js
│   │   ├── categorias/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts    # CRUD especifico de categorias de productos
│   │   │   └── route.ts        # Listado y creacion de categorias del catalogo
│   │   ├── contacto/
│   │   │   └── route.ts        # API de recepcion y persistencia de mensajes (Zod validation)
│   │   ├── cron/
│   │   │   └── check-licencias/
│   │   │       └── route.ts    # Job programado para marcar vigencias de licencias vencidas
│   │   ├── licencias/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts    # CRUD e informes de licencias especificas de clientes
│   │   │   └── route.ts        # Listado y registro de licencias de software vendidas
│   │   ├── productos/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts    # Edicion y eliminacion de productos del catalogo
│   │   │   └── route.ts        # Listado general de productos activos y filtros
│   │   ├── servicios/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts    # Edicion y eliminacion de servicios mostrados
│   │   │   └── route.ts        # Listado general de servicios de TI
│   │   └── trabajos/
│   │       ├── [id]/
│   │       │   └── route.ts    # Edicion y eliminacion de trabajos de portafolio
│   │       └── route.ts        # Galeria de trabajos tecnicos del portafolio
│   ├── components/             # Componentes modulares y reutilizables del frontend
│   │   ├── CleanFooter.tsx     # Pie de pagina corporativo con accesos rapidos y redes
│   │   ├── ScrollRevealObserver.tsx # Observador de scroll para animaciones de fade-in
│   │   └── StatusHeader.tsx    # Barra de navegacion principal con logo SVG y menu activo
│   ├── contacto/
│   │   └── page.tsx            # Formulario estructurado publico de consultas
│   ├── descargas/
│   │   └── page.tsx            # Repositorio publico de drivers y manuales
│   ├── nosotros/
│   │   └── page.tsx            # Trayectoria, vision, mision y valores corporativos
│   ├── productos/
│   │   └── page.tsx            # Catalogo virtual interactivo de repuestos y suministros
│   ├── servicios/
│   │   └── page.tsx            # Seccion publica de servicios en filas alternas
│   ├── soporte/
│   │   └── page.tsx            # Reproductor cinemático AnyDesk y guia paso a paso
│   ├── globals.css             # Estilos globales y configuracion de Tailwind CSS v4
│   ├── layout.tsx              # Raiz de paginas, tipografia Outfit e iconos Material
│   └── page.tsx                # Pagina de aterrizaje principal (Inicio)
├── lib/
│   ├── auth.ts                 # Configuracion central de proveedores y callbacks de NextAuth
│   └── prisma.ts               # Instancia unificada del cliente de Prisma ORM
├── prisma/
│   └── schema.prisma           # Archivo de modelos de datos relacionales y conectores SQL
├── public/                     # Archivos estaticos
│   ├── img/
│   │   └── servicios/          # Imagenes locales de soporte tecnico, redes y licencias
│   └── uploads/                # Directorio local de fallback para subida fisica de archivos
├── scripts/
│   └── seed.ts                 # Script de poblado inicial de la base de datos (npx prisma db seed)
├── eslint.config.mjs           # Archivo de configuracion para ESLint
├── jest.config.js              # Archivo de configuracion para las pruebas de Jest
├── middleware.ts               # Filtro de autenticacion y control de acceso basado en roles
├── next-env.d.ts               # Declaraciones de tipos por defecto para Next.js
├── next.config.ts              # Configuracion de compilacion y optimizaciones de Next.js
├── package.json                # Dependencias, scripts de compilacion y configuracion general
└── tsconfig.json               # Configuracion de compilacion de TypeScript
```

---

## Modulos y Funcionalidades Principales

### 1. Portal Corporativo Publico (Frontend UX Premium)
* **Pagina de Inicio (Hero & Bento Grid)**: Seccion de bienvenida cinemática con accesos a soporte instantaneo por WhatsApp y bento grid unificado 2-1 que expone la propuesta de valor.
* **Servicios Corporativos (Filas Alternas)**: Visualizacion dinamica de los servicios (Soporte, Redes, Licenciamiento, Hardware) mediante layouts flexibles que alternan descripciones estructuradas y fotografias locales de alta calidad.
* **Catalogo Virtual Activo y Carrito de Cotización**: Exposición de suministros y licencias con filtros por categoría y búsqueda en tiempo real. Incorpora un **Carrito de Cotización Dinámico** (vía `localStorage`) que envía las solicitudes formateadas a WhatsApp, y un modal de **"Vista Rápida" (Quick View)** de alto rendimiento implementado mediante React Portal para mejorar la tasa de conversión. El catálogo ha sido expandido y sincronizado completamente con la base de datos Railway a través de 6 categorías principales y 17 productos.
* **Seccion de Descargas de Soporte**: Repositorio publico donde clientes y tecnicos pueden descargar drivers oficiales y manuales.
* **Modulo de Soporte Remoto (/soporte)**: Interfaz de streaming cinemática con reproductor de video integrado para guias paso a paso de AnyDesk/RustDesk y consola interactiva de consulta de IDs de conexion.
* **Formulario de Contacto Real (/contacto)**: Formulario estructurado con iconos vectoriales de Google Material Symbols. Valida datos en tiempo real y persiste las consultas directamente en la base de datos MySQL.
* **Asistente Virtual Inteligente (Chatbot)**: Asistente interactivo en la esquina inferior derecha (con ocultación inteligente en secciones de administración `/admin/*`) que ofrece botones rápidos y responde automáticamente consultas libres buscando palabras clave sobre horarios, localización, soporte remoto AnyDesk y servicios.


### 2. Panel Administrativo Protegido (Dashboard)
* **Area de Login Glassmorphic**: Interfaz de acceso limpia con un overlay translúcido sobre un video tecnico de fondo, focos de acento en rojo puro (#ff0000) y proteccion por token JWT.
* **Modulo de Licencias de Software**: Registro detallado de cuentas de correo, contrasenas, fechas de vigencia y observaciones de licencias (Windows, Office, Antivirus) vendidas a clientes, con codigos de color de alerta segun proximidad de vencimiento (urgente, por vencer, activo).
* **Modulo de Archivos y Drivers**: Permite subir ejecutables y manuales asignandoles etiquetas de categoria (programa, driver, excel, link).
* **Modulo de Catalogo de Productos**: Control de stock virtual para anadir, editar, desactivar o eliminar productos del catalogo publico.
* **Modulo de Mensajes de Contacto**: Bandeja de entrada interna del taller donde los administradores pueden leer consultas de clientes, marcarlas como leidas/no leidas y eliminarlas tras su resolucion.
* **Modulo de Gestion de Personal (CRUD Admin-Only)**: Panel de control exclusivo para usuarios con rol 'admin' que permite dar de alta a nuevos tecnicos/vendedores, editar sus perfiles y activar o desactivar su acceso general.

---

## Calidad de Software e Ingenieria de Codigo

* **Validacion Estricta con Zod**: Todos los payloads y consultas que ingresan a las APIs administrativas son analizados con esquemas Zod en el servidor, garantizando que no se introduzcan valores nulos, correos invalidos o textos de longitud inapropiada.
* **Seguridad Criptografica**: Las contrasenas de las cuentas de personal se procesan con hashes de seguridad mediante `bcryptjs` con salt rounds optimizados antes de ser persistidas.
* **Control de Acceso basado en Roles (RBAC)**: Integracion de roles a traves de callbacks de JWT en NextAuth.js. El middleware restringe el acceso al CRUD de usuarios solo a administradores.
* **Automatizacion de Licencias (Cron Job)**: Endpoint `/api/cron/check-licencias` configurado para actualizar automaticamente el estado de licencias vencidas basandose en la fecha del servidor, protegido por validacion de Bearer Token.
* **Carga Fisica de Archivos (Hibrido AWS S3 / Local)**: Endpoint `/api/admin/upload` con logica de auto-deteccion. Si las variables de S3 estan en el archivo `.env`, envia el archivo de forma directa y asincrona al Bucket de AWS S3 mediante el SDK `@aws-sdk/client-s3`. Si no estan configuradas, escribe en el disco local (`public/uploads`) de forma transparente.
* **Pruebas Automatizadas con Jest**: Suite de pruebas unitarias configurada con `ts-jest` en el directorio `__tests__/` para auditar la validez y consistencia del parseo de datos.
* **Pipeline de Integracion Continua (CI)**: Flujo de trabajo automatizado en GitHub Actions (`.github/workflows/nextjs.yml`) ejecutado en cada push a main/master para instalar dependencias, auditar linter, correr tests unitarios, compilar tipos y validar el build final de Next.js.
* **Estandarizacion de Codigo Limpio (Sin Emojis)**: Toda la base de código y scripts de base de datos (`seed.ts`, etc.) se mantienen libres de caracteres emoji crudos. Esto garantiza la máxima portabilidad, evita problemas de codificación de caracteres en consolas Windows, y asegura salidas limpias en producción.

---

## Esquema y Relaciones de Base de Datos (Prisma ORM)

El esquema de datos (`prisma/schema.prisma`) define las siguientes tablas y relaciones en la base de datos MySQL:

### 1. Sistema Administrativo
* **Usuario (`Usuario`)**:
  * Representa al personal tecnico o vendedores de la empresa.
  * Atributos clave: `id_usuario`, `nombre`, `usuario` (unico), `email` (unico), `contrasena` (hasheada), `rol` (enum: admin, tecnico, vendedor) y `activo` (booleano).
  * Relaciones: Tiene relacion de uno a muchos con las tablas `ArchivoTecnico` y `Licencia`.
* **Licencia (`Licencia`)**:
  * Almacena las suscripciones de software vendidas a clientes.
  * Atributos clave: `id_licencia`, `software`, `correo_cuenta`, `contrasena`, `fecha_inicio`, `fecha_fin` (opcional), `nombre_cliente`, `telefono`, `estado` (enum: activo, vencido), `observaciones`.
  * Relaciones: Relacionada de muchos a uno con `Usuario` para identificar que tecnico registro o vendio la licencia.
* **ArchivoTecnico (`ArchivoTecnico`)**:
  * Registra instaladores de programas y controladores cargados en la plataforma.
  * Atributos clave: `id_archivo`, `nombre`, `tipo` (enum: programa, driver, excel, link), `url_archivo` (URL local o S3), `descripcion`, `fecha_subida`.
  * Relaciones: Relacionada de muchos a uno con `Usuario` para identificar el autor de la subida.

### 2. Sistema Web Publico
* **Servicio (`Servicio`)**: Servicios expuestos en el catalogo corporativo. Relacionado de uno a muchos con la tabla `TrabajoRealizado`.
* **Categoria (`Categoria`)**: Clasificacion para estructurar los suministros (ej. ribbons, tintas, discos). Relacionado de uno a muchos con `Producto`.
* **Producto (`Producto`)**: Articulos en stock mostrados en el catalogo publico. Atributos: `id_producto`, `nombre`, `descripcion`, `precio`, `imagen_url`, `activo`. Relacionado de muchos a uno con `Categoria`.
* **TrabajoRealizado (`TrabajoRealizado`)**: Fotos de portafolio de instalaciones y proyectos de cableado o reparaciones. Relacionado de muchos a uno con `Servicio` (opcional).
* **MensajeContacto (`MensajeContacto`)**: Registra y persiste los correos enviados por clientes. Atributos: `id_mensaje`, `nombre`, `correo`, `telefono`, `asunto`, `mensaje`, `leido` (default: false), `fecha`.

---

## Variables de Entorno (.env)

Cree un archivo `.env` en la raiz del proyecto con el siguiente formato:

```env
# 1. Base de Datos
DATABASE_URL="mysql://usuario:contrasena@host:puerto/nombre_base_datos"

# 2. NextAuth Autenticacion
NEXTAUTH_SECRET="escribe_aqui_una_clave_secreta_y_larga_de_minimo_32_caracteres"
NEXTAUTH_URL="http://localhost:3000"

# 3. AWS S3 (Opcional, de lo contrario se guardara en public/uploads/)
AWS_ACCESS_KEY_ID="tu_access_key_id_de_iam"
AWS_SECRET_ACCESS_KEY="tu_secret_access_key_de_iam"
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="nombre_del_bucket_s3"

# 4. Automatizacion (Cron Key, requerido para /api/cron/check-licencias)
CRON_SECRET="genera_una_clave_aleatoria_segura_aqui"
```

---

## Instrucciones de Instalacion y Despliegue Local

1. Clonar el repositorio e instalar las dependencias:
   ```bash
   npm install
   ```

2. Generar el cliente de base de datos de Prisma:
   ```bash
   npx prisma generate
   ```

3. Sincronizar el esquema de Prisma con tu base de datos remota/local:
   ```bash
   npx prisma db push
   ```

4. Poblar la base de datos con los servicios corporativos iniciales y el administrador por defecto:
   ```bash
   npx prisma db seed
   ```
   *Nota: Las credenciales por defecto son: usuario `admin` y contrasena `admin123`. Modificalas inmediatamente al ingresar.*

5. Iniciar el servidor de desarrollo local:
   ```bash
   npm run dev
   ```

El sitio web estara disponible en `http://localhost:3000`.

---

## Catalogo de Endpoints de la API

### Servicios Publicos
* `GET /api/productos` - Obtiene la lista de productos activos para el catalogo.
* `GET /api/servicios` - Obtiene los servicios estructurados del taller.
* `GET /api/trabajos` - Obtiene las imagenes del portafolio.
* `GET /api/categorias` - Obtiene las categorias registradas.
* `GET /api/archivos` - Obtiene los drivers y manuales disponibles para descarga.
* `POST /api/contacto` - Guarda un mensaje de contacto enviado desde la web publica (Validado con Zod).

### Modulo Administrativo (Requiere sesion activa)
* `GET /api/admin/contacto` - Obtiene la lista completa de mensajes recibidos de clientes.
* `PUT /api/admin/contacto` - Cambia el estado de lectura de un mensaje (`id` y `leido` en el body).
* `DELETE /api/admin/contacto?id=X` - Elimina un mensaje del sistema.
* `POST /api/admin/upload` - Procesa un archivo adjunto del dashboard y lo guarda en AWS S3 o carpeta local.
* `GET /api/admin/usuarios` - Lista el personal registrado en DELLCOM SAC (Solo Administrador).
* `POST /api/admin/usuarios` - Registra un nuevo tecnico/vendedor con password hash (Solo Administrador).
* `PUT /api/admin/usuarios` - Actualiza perfil y rol de un miembro del personal (Solo Administrador).
* `PATCH /api/admin/usuarios` - Activa o desactiva la cuenta de un tecnico (Solo Administrador).

### Tareas de Automatizacion
* `GET /api/cron/check-licencias` - Actualiza licencias activas cuya fecha de fin sea menor a hoy (Requiere `Authorization: Bearer <CRON_SECRET>`).

---

## Control de Calidad y Compilacion

### Ejecutar Pruebas Locales
Para correr la suite de pruebas unitarias configuradas en Jest:
```bash
npm run test
```

### Comprobacion de Tipado de TypeScript
Para verificar que el tipado estatico del proyecto sea correcto sin generar archivos de salida:
```bash
npx tsc --noEmit
```

### Compilar Proyecto para Produccion
Para empaquetar y compilar la aplicacion optimizada para produccion:
```bash
npm run build
```

Una vez finalizado, puedes levantar la aplicacion compilada localmente con:
```bash
npm run start
```
