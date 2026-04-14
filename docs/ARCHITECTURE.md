# Frontend Architecture

Documento de explicación técnica de la arquitectura del frontend `ScalperToday`.

## Principio general

El frontend separa responsabilidades en capas para evitar acoplar pantallas con detalles de red, persistencia o composición de dependencias.

La intención práctica es:

- facilitar pruebas;
- aislar lógica de negocio de la UI;
- hacer mantenible el crecimiento por módulos (`auth`, `events`, `alerts`, `home`, `settings`).

## Capas

### `app/`

Define navegación y composición de pantallas con Expo Router.

Responsabilidades:

- layouts globales
- grupos de rutas
- pantallas concretas
- conexión final con hooks/ViewModels

No debería contener lógica de acceso a datos compleja.

### `presentation/`

Es la capa de interacción con el usuario.

Incluye:

- componentes visuales
- hooks para obtener dependencias desde el contenedor
- modelos preparados para la UI
- ViewModels observables con MobX

Los `ViewModels` son el punto de unión entre UI y casos de uso.

### `domain/`

Representa la lógica de negocio del cliente.

Incluye:

- entidades del sistema
- contratos de repositorio
- casos de uso

Ejemplo:

- la pantalla no pide datos directamente al `ApiClient`
- la pantalla usa un `ViewModel`
- el `ViewModel` invoca un caso de uso
- el caso de uso depende de una interfaz de repositorio

### `data/`

Implementa el acceso real a red.

Incluye:

- `ApiClient`
- `ApiEndpointProvider`
- implementaciones de repositorio
- tipos de payload/DTO si aplica

Aquí es donde se traduce HTTP a entidades de dominio.

### `core/`

Contiene infraestructura compartida del cliente:

- contenedor Inversify
- símbolos de DI
- persistencia segura de token

## Inyección de dependencias

La composición central vive en [container.ts](/Users/rubencarrascofrias/Documents/TFG/proyectoFrontend/src/core/container.ts).

El contenedor registra:

- servicios singleton (`TokenManager`, `CacheService`, `ApiClient`)
- repositorios
- casos de uso
- ViewModels singleton

Esto permite:

- reutilizar estado entre pantallas;
- testear clases sin depender de la UI;
- mantener un punto único de ensamblaje.

## Gestión de estado

La app usa `MobX` con `mobx-react-lite`.

Los `ViewModels`:

- exponen estado observable;
- encapsulan carga, errores, caché y acciones de usuario;
- reducen lógica en las pantallas.

Ejemplos:

- `HomeViewModel`
- `EventsViewModel`
- `AlertsViewModel`
- `AuthViewModel`
- `SettingsViewModel`

## Servicios clave

### `ApiClient`

Responsable de:

- construir peticiones HTTP
- aplicar timeout
- aplicar retry sobre errores transitorios
- manejar `401` y callback de desautorización
- centralizar logs y errores de red

### `CacheService`

Se usa para acelerar pantallas como `home` y `events` y mejorar degradación cuando la red falla.

### `NotificationService`

Centraliza listeners y comportamiento asociado a notificaciones de Expo.

## Flujos importantes

### Autenticación

1. pantalla de login/registro
2. `AuthViewModel`
3. casos de uso de auth
4. repositorio de auth
5. backend FastAPI
6. almacenamiento seguro del token

### Home

1. `HomeViewModel.refresh()`
2. carga de resumen y briefing
3. uso de caché cuando procede
4. render de componentes de home

### Events

1. `EventsViewModel.loadEvents()` obtiene eventos filtrados
2. se aplican filtros y caché
3. detalle del evento se abre en bottom sheet
4. análisis largo se lee en modal independiente scrolleable

### Alerts

1. wizard de creación en `CreateAlertModal`
2. `AlertsViewModel.createAlert()`
3. persistencia en backend
4. representación separada de `status` y `pushEnabled`

## Decisión importante: `status` vs `pushEnabled`

Una alerta tiene dos dimensiones distintas:

- `status`: activa, pausada o eliminada
- `pushEnabled`: si debe enviar notificación push

No deben mezclarse en UI ni en lógica:

- una alerta puede estar activa y no enviar push
- pausar una alerta no es lo mismo que desactivar solo el push

## Criterios de calidad aplicados

- commits pequeños y aislados
- `eslint` activo
- comprobación de tipos con TypeScript
- tests unitarios de piezas críticas
- correcciones de estabilidad priorizadas frente a rediseño visual
