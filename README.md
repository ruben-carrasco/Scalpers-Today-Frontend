# ScalperToday - React Native App

Aplicación móvil profesional de calendario económico con análisis de IA, alertas y notificaciones push en tiempo real.

## 🛠️ Stack Tecnológico

- **Framework**: Expo 50.x + Expo Router 3.x
- **Lenguaje**: TypeScript 5.x
- **Gestión de Estado**: MobX 6.x
- **Inyección de Dependencias**: InversifyJS 6.x
- **Estilos**: NativeWind (Tailwind CSS)
- **Feedback**: Expo Haptics (Vibración premium)
- **Notificaciones**: Expo Notifications

## 🏛️ Arquitectura (Clean Architecture + MVVM)

Separación estricta de responsabilidades para un código escalable y mantenible:

```
┌─────────────────────────────────────────────────┐
│  PRESENTATION (Screens, ViewModels, Components) │
├─────────────────────────────────────────────────┤
│  DOMAIN (Entities, UseCases, Interfaces)        │
├─────────────────────────────────────────────────┤
│  DATA (API, Repositories, Mappers)              │
├─────────────────────────────────────────────────┤
│  CORE (DI Container, Storage, Validation)       │
└─────────────────────────────────────────────────┘
```

## 🚀 Inicio Rápido

```bash
cd proyectoFrontend
npm install
npx expo start
```

### 🔐 Configuración de API
La aplicación está configurada para conectar automáticamente con el backend en Azure. Si deseas usar un backend local, configura la variable de entorno:

```env
EXPO_PUBLIC_API_URL=http://tu-ip-local:8000/api/v1
```

## ✨ Características Premium

- **Dashboard Inteligente**: Saludos dinámicos, estadísticas del día y próximo evento.
- **AI Briefing**: Resumen diario del mercado generado por Inteligencia Artificial.
- **Featured Events**: Acceso rápido a las noticias más importantes con un toque.
- **Haptic Experience**: Respuesta táctil en todas las interacciones clave.
- **Notificaciones Push**: Registro de tokens para recibir alertas personalizadas.
- **Filtros Avanzados**: Búsqueda por país, importancia y divisa.

## 📂 Estructura del Proyecto

```
proyectoFrontend/
├── app/                          # Expo Router (Sistema de rutas)
│   ├── (auth)/                   # Login y Registro
│   └── (tabs)/                   # Dashboard, Eventos, Alertas, Ajustes
├── src/
│   ├── core/                     # InversifyJS, Errores, TokenManager
│   ├── domain/                   # Entidades, Casos de Uso e Interfaces
│   ├── data/                     # Cliente API y Repositorios
│   ├── presentation/             # ViewModels, Componentes y Hooks
│   └── services/                 # Servicios nativos (Notificaciones)
```

## 📡 Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/home/summary` | Resumen del Dashboard (Datos Reales) |
| GET | `/brief` | Briefing generado por IA |
| GET | `/macro` | Listado completo de eventos |
| POST | `/alerts` | Gestión de alertas personalizadas |
| POST | `/alerts/device-token` | Registro para notificaciones push |

## ⚖️ Licencia

MIT - Rubén Carrasco Frías
