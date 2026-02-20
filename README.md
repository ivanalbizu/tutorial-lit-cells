# 01 — Setup del proyecto

> Rama: `01-setup` | [Volver al índice](../../tree/main)

## Qué hemos hecho

Configurar un proyecto desde cero con **Vite + Lit + TypeScript**.

## Comparativa con Stencil

| Aspecto | Stencil | Lit + Vite |
|---------|---------|------------|
| **Scaffold** | `npm init stencil` | Manual con Vite |
| **Compilador** | Stencil compiler (produce vanilla WC) | No hay compilador — Lit es runtime puro |
| **Bundler** | Rollup integrado | Vite (esbuild + Rollup) |
| **TypeScript** | Integrado | Configuración manual (`tsconfig.json`) |
| **Dev server** | Integrado | Vite dev server (HMR) |

## Estructura del proyecto

```
tutorial-lit/
├── index.html          ← Punto de entrada HTML (Vite lo usa como entry)
├── package.json        ← Dependencias: lit, vite, typescript
├── tsconfig.json       ← Configuración TypeScript con decoradores
├── vite.config.ts      ← Configuración de Vite
└── src/
    └── index.ts        ← Punto de entrada JS
```

## Puntos clave

### 1. Lit es runtime, no compilador

En Stencil, el compilador transforma tus componentes en Web Components vanilla.
En Lit, **no hay compilación** — tu código usa directamente la API de Web Components
del navegador, con Lit como librería de ayuda en runtime.

### 2. Decoradores experimentales

En `tsconfig.json` activamos:
```json
{
  "experimentalDecorators": true,
  "useDefineForClassFields": false
}
```
Esto es necesario porque Lit usa decoradores de TypeScript (`@customElement`, `@property`, etc.),
igual que Stencil (`@Component`, `@Prop`, etc.).

### 3. Vite como dev server

Vite ofrece HMR (Hot Module Replacement) y es extremadamente rápido.
En Stencil esto viene integrado; aquí lo configuramos aparte.

## Cómo ejecutar

```bash
npm install
npm run dev
```

## Siguiente paso

```bash
git checkout 02-primer-componente
```
