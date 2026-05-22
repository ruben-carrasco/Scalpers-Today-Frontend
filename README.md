# ScalperToday Frontend

Aplicación móvil de `ScalperToday` construida con React Native + Expo. Consume el backend del proyecto para mostrar eventos macroeconómicos, briefing diario, alertas personalizadas, análisis enriquecidos con IA y un asistente conversacional integrado.

Este README está orientado a desarrollador y mantenimiento técnico del TFG.

## Objetivo de la app

La app resuelve cinco casos principales:

- autenticación de usuario;
- consulta del calendario económico semanal con foco en el día actual;
- visualización de briefing, highlights y próximo evento;
- creación y gestión de alertas con notificaciones push;
- consulta de análisis y ayuda contextual con chatbot.

## Stack técnico

- React Native `0.81`
- Expo `54`
- Expo Router
- TypeScript
- InversifyJS para DI
- MobX + `mobx-react-lite`
- NativeWind para estilos utilitarios
- Expo Notifications
- Expo Auth Session
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
- `theme/` centraliza el modo claro/oscuro y los tokens visuales

## Navegación

La navegación principal se organiza así:

- grupo `(auth)` para login, registro y recuperación de contraseña
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

Archivo base: [.env.example](/Users/rubencarrascofrias/Documents/TFG/proyectoFrontend/.env.example)

Variables previstas:

- `EXPO_PUBLIC_API_URL`
- `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` (solo si se necesita compatibilidad técnica con flujo web)

Si `EXPO_PUBLIC_API_URL` no está definida, se usa la URL por defecto de Azure configurada en `api.config.ts`.

### Requisitos Google OAuth para APK Android

Para que Google Sign-In funcione en build APK (EAS), además de las variables anteriores:

- el cliente OAuth de tipo Android debe usar el paquete `com.rubencorrasco.scalpertoday`;
- debe incluir la huella SHA-1 del keystore de EAS;
- hay que activar la opción `Enable custom URI scheme` en ese cliente Android;
- el valor de `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` en EAS (`preview`/`production`) debe coincidir exactamente con ese cliente.

## Ejecución local

### 1. Instalar dependencias

```bash
cd proyectoFrontend
npm install
cp .env.example .env
```

### 2. Lanzar la app

```bash
npm run start
```

Para abrir la app móvil:

```bash
npm run android
npm run ios
```

`npm run web` existe solo como soporte técnico de Expo, pero la entrega y el producto objetivo son móviles.

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
- noticias y highlights

### Events

- lista semanal con selector de día
- filtros por importancia, país y búsqueda
- detalle de evento en bottom sheet
- análisis detallado en modal independiente y scrolleable

### Alerts

- listado de alertas
- creación guiada por pasos
- gestión de `status` y `pushEnabled`
- triggers por impacto, país, divisa y tipo de evento
- registro de token de dispositivo para notificaciones

### Settings

- estado de sesión
- configuración básica del usuario y sesión
- cambio de tema claro/oscuro

### Assistant

- chatbot autenticado para dudas sobre conceptos macroeconómicos
- ayuda contextual integrada en la propia app

## Decisiones técnicas relevantes

- `ViewModels` en singleton para compartir estado entre pantallas y evitar reconstrucciones innecesarias.
- `CacheService` para respuesta rápida en `home` y `events`.
- `ApiClient` con retry controlado para errores transitorios.
- `status` de alerta y `pushEnabled` se modelan por separado; la UI debe reflejar ambos conceptos sin mezclarlos.
- `NotificationService` encapsula permisos, registro de token Expo y listeners de notificaciones.
- algunos flujos complejos de bottom sheets se resolvieron moviendo contenido largo a modales dedicados para evitar conflictos de scroll.

## Limitaciones actuales

- la app depende de un backend propio; no funciona de forma aislada.
- el estado offline es parcial, no una estrategia completa offline-first.
- el login con Google depende de credenciales válidas por plataforma.
- los tests cubren lógica técnica importante, pero no sustituyen validación visual en dispositivo real.

## Documentación relacionada

- arquitectura frontend: [ARCHITECTURE.md](/Users/rubencarrascofrias/Documents/TFG/proyectoFrontend/docs/ARCHITECTURE.md)
- backend del sistema: [README.md](/Users/rubencarrascofrias/Documents/TFG/proyecto/README.md)
