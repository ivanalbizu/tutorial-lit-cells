# 06 — Ciclo de vida

> Rama: `06-ciclo-de-vida` | Anterior: `05-eventos` | [Índice](../../tree/main)

## Qué hemos hecho

Un reloj en tiempo real (`<my-clock>`) que demuestra todos los métodos del ciclo de vida, con un wrapper (`<my-lifecycle-demo>`) que permite montarlo y desmontarlo.

## Ciclo de vida: Stencil vs Lit

### Tabla completa

| Orden | Stencil | Lit | Cuándo |
|-------|---------|-----|--------|
| 1 | `constructor()` | `constructor()` | Al crear la instancia |
| 2 | `connectedCallback()` | `connectedCallback()` | Al añadir al DOM |
| 3 | `componentWillLoad()` | _(no existe)_ | Antes del primer render (solo Stencil) |
| 4 | — | `willUpdate(changedProps)` | Antes de cada render |
| 5 | `render()` | `render()` | Genera el template |
| 6 | `componentDidLoad()` | `firstUpdated()` | Después del primer render |
| 7 | `componentDidRender()` | `updated(changedProps)` | Después de cada render |
| 8 | `disconnectedCallback()` | `disconnectedCallback()` | Al quitar del DOM |

### Reemplazar @Watch()

En Stencil:
```tsx
@Watch('name')
nameChanged(newVal: string, oldVal: string) {
  console.log(`name cambió de ${oldVal} a ${newVal}`);
}
```

En Lit, usas `willUpdate` o `updated`:
```ts
willUpdate(changedProps: Map<string, unknown>) {
  if (changedProps.has('name')) {
    const oldVal = changedProps.get('name') as string;
    console.log(`name cambió de ${oldVal} a ${this.name}`);
  }
}
```

**Diferencia clave:** `changedProps.get('prop')` retorna el valor **anterior**, y `this.prop` ya tiene el valor **nuevo**.

## Detalle de cada método

### `constructor()`
- **Siempre** llama a `super()` primero
- No accedas al DOM (Shadow DOM aún no existe)
- Inicializa estado por defecto

### `connectedCallback()`
- **Siempre** llama a `super.connectedCallback()`
- Ideal para: timers, suscripciones, event listeners globales
- Puede ejecutarse múltiples veces si el elemento se mueve en el DOM

### `willUpdate(changedProps)`
- Se ejecuta **antes** del render
- Puedes modificar estado aquí **sin causar render extra**
- `changedProps` es un `Map<string, unknown>` con los valores anteriores

### `render()`
- Debe ser **puro**: solo retorna template
- No hagas side effects aquí

### `firstUpdated()`
- Se ejecuta **una sola vez** después del primer render
- El Shadow DOM ya existe — puedes hacer `this.shadowRoot.querySelector(...)`
- Ideal para: focus, mediciones, inicializaciones que necesitan el DOM

### `updated(changedProps)`
- Se ejecuta **después** de cada render
- El DOM ya está actualizado
- Cuidado: modificar estado aquí **causa otro render**

### `disconnectedCallback()`
- **Siempre** llama a `super.disconnectedCallback()`
- Limpia todo: timers, listeners, suscripciones

## Cómo ejecutar

```bash
npm run dev
```

Prueba a montar/desmontar el reloj y observa:
- El log dentro del componente muestra los hooks
- La consola del navegador muestra constructor y disconnectedCallback

## Siguiente paso

```bash
git checkout 07-estilos
```
