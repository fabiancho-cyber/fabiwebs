# FABIWEBS

Sitio web premium para FABIWEBS, enfocado en experiencias digitales, diseño y desarrollo web.

## Características

- Landing page responsive con identidad visual FABIWEBS.
- Animaciones y transiciones con GSAP.
- Demos interactivas:
  - Portafolio digital.
  - Tienda e-commerce.
  - Sitio corporativo.
  - Formulario dinámico de cotización.
- Navegación con React Router.
- Favicon y título personalizado para la pestaña del navegador.
- Formulario de contacto con nombre, email, teléfono y mensaje.
- Envío de solicitudes mediante FormSubmit hacia `fabitechft@hotmail.com`.

## Tecnologías

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- GSAP
- React Router

## Instalación

Requisitos:

- Node.js
- npm

Instala las dependencias:

```bash
npm install
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:8443`.

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la build de producción |
| `npm run preview` | Sirve localmente la build generada |
| `npm run format` | Formatea el código |

## Build de producción

```bash
npm run build
npm run preview
```

La carpeta `dist/` se genera automáticamente y no se versiona en Git.

## Estructura principal

```text
src/
├── components/       Componentes reutilizables
├── demos/             Demos interactivas
├── pages/             Páginas principales
├── assets/            Recursos gráficos
├── App.tsx            Configuración de rutas
└── main.tsx           Punto de entrada de React
public/
└── favicon.svg        Icono de la pestaña
```

## Publicación

Repositorio:

https://github.com/fabiancho-cyber/fabiwebs

Para publicar la aplicación, genera primero la build de producción y despliega la carpeta `dist/` en un servicio compatible con aplicaciones estáticas, como GitHub Pages, Vercel o Netlify.

GitHub Pages se despliega automáticamente mediante GitHub Actions en cada push a `main`.

## Contacto

FABIWEBS  
Email: `fabitechft@hotmail.com`  
WhatsApp: `+57 316 459 8263`
