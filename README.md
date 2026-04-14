# ScalperToday Frontend

Aplicación móvil de `ScalperToday` construida con React Native + Expo. Consume el backend del proyecto para mostrar eventos macroeconómicos, briefing diario, alertas personalizadas y análisis enriquecidos con IA.

Este README está orientado a desarrollador y mantenimiento técnico del TFG.

## Objetivo de la app

La app resuelve cuatro casos principales:

- autenticación de usuario;
- consulta del calendario económico diario;
- visualización de briefing y highlights;
- creación y gestión de alertas con notificaciones push.

## Stack técnico

- React Native `0.81`
- Expo `54`
- Expo Router
- TypeScript
- InversifyJS para DI
- MobX + `mobx-react-lite`
- NativeWind para estilos utilitarios
- `@gorhom/bottom-sheet` para modales inferiores
- Jest + `jest-expo`
- ESLint

Dependencias y scripts: [package.json](/Users/rubencarrascofrias/Documents/TFG/proyectoFrontend/package.json)

## Arquitectura real

La app sigue una arquitectura inspirada en Clean Architecture + MVVM.

```text
src/
├── core/           # Contenedor DI, types, token manager
├── data/           # API client, endpoint provider, repositorios
├── domain/         # Entidades, interfaces y casos de uso
├── presentation/   # pantallas, componentes, hooks, viewmodels, modelos
├── services/       # caché y notificaciones
└── config/         # configuración de API
```

### Capa `core`

- contenedor Inversify: [container.ts](/Users/rubencarrascofrias/Documents/TFG/proyectoFrontend/src/core/container.ts)
- identificadores de DI: [types.ts](/Users/rubencarrascofrias/Documents/TFG/proyectoFrontend/src/core/types.ts)
- gestión segura del token JWT

### Capa `data`

- `ApiClient` centraliza fetch, timeout, retry y errores
- `ApiEndpointProvider` construye las rutas del backend
- los repositorios convierten DTO/API -> entidades de dominio

### Capa `domain`

- contiene entidades (`Alert`, `EconomicEvent`, `HomeSummary`, etc.)
- define interfaces de repositorio y contratos de casos de uso
- los casos de uso encapsulan operaciones de negocio consumidas por los ViewModels

### Capa `presentation`

- `app/` define la navegación con Expo Router
- `viewmodels/` contienen el estado observable de cada área funcional
- `components/` agrupan UI reutilizable
- `hooks/` conectan las pantallas con el contenedor DI

## Navegación

La navegación principal se organiza así:

- grupo `(auth)` para login y registro
- grupo `(tabs)` para home, eventos, alertas y ajustes
- layout raíz con proveedor de bottom sheets y manejo de notificaciones

Archivo principal de navegación: [app/_layout.tsx](/Users/rubencarrascofrias/Documents/TFG/proyectoFrontend/app/_layout.tsx)

## Integración con backend

La app consume el backend REST en `/api/v1`.

Configuración por defecto: [api.config.ts](/Users/rubencarrascofrias/Documents/TFG/proyectoFrontend/src/config/api.config.ts)

Por defecto apunta a:

- `https://scalpertoday-ruben.azurewebsites.net/api/v1`

Se puede sobreescribir con:

```bash
EXPO_PUBLIC_API_URL=https://tu-backend/api/v1
```

## Variables y configuración

Actualmente la app no depende de un `.env` complejo. La única sobreescritura prevista en runtime es:

- `EXPO_PUBLIC_API_URL`

Si no está definida, se usa la URL por defecto de Azure configurada en `api.config.ts`.

## Ejecución local

### 1. Instalar dependencias

```bash
cd proyectoFrontend
npm install
```

### 2. Lanzar la app

```bash
npm run start
```

También disponibles:

```bash
npm run android
npm run ios
npm run web
```

## Calidad y validación

### Lint

```bash
npm run lint
```

### Tipos

```bash
npx tsc --noEmit
```

### Tests

```bash
npm test -- --runInBand
```

## Áreas funcionales importantes

### Home

- resumen del día
- briefing generado por IA
- próximo evento
- highlights

### Events

- lista del día
- filtros por importancia, país y búsqueda
- detalle de evento en bottom sheet
- análisis detallado en modal independiente y scrolleable

### Alerts

- listado de alertas
- creación guiada por pasos
- gestión de `status` y `pushEnabled`
- registro de token de dispositivo para notificaciones

### Settings

- estado de sesión
- configuración básica del usuario y sesión

## Decisiones técnicas relevantes

- `ViewModels` en singleton para compartir estado entre pantallas y evitar reconstrucciones innecesarias.
- `CacheService` para respuesta rápida en `home` y `events`.
- `ApiClient` con retry controlado para errores transitorios.
- `status` de alerta y `pushEnabled` se modelan por separado; la UI debe reflejar ambos conceptos sin mezclarlos.
- algunos flujos complejos de bottom sheets se resolvieron moviendo contenido largo a modales dedicados para evitar conflictos de scroll.

## Limitaciones actuales

- la app depende de un backend propio; no funciona de forma aislada.
- el estado offline es parcial, no una estrategia completa offline-first.
- los tests cubren lógica técnica importante, pero no sustituyen validación visual en dispositivo real.

## Documentación relacionada

- arquitectura frontend: [ARCHITECTURE.md](/Users/rubencarrascofrias/Documents/TFG/proyectoFrontend/docs/ARCHITECTURE.md)
- backend del sistema: [README.md](/Users/rubencarrascofrias/Documents/TFG/proyecto/README.md)
