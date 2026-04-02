# Tasks App

Aplicación de gestión de tareas construida con **Ionic 8**, **Angular 20** y **Capacitor 8**. Permite crear, completar y eliminar tareas con persistencia local mediante `localStorage`.

---

## Tabla de Contenidos

- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Scripts Disponibles](#scripts-disponibles)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura](#arquitectura)
- [Modelo de Datos](#modelo-de-datos)
- [Ejecución en Dispositivos](#ejecución-en-dispositivos)

---

## Características

- Crear tareas con un campo de texto y confirmación por tecla Enter o botón.
- Marcar tareas como completadas o pendientes mediante checkbox.
- Eliminar tareas con gesto de deslizamiento (swipe-to-delete).
- Separación visual entre tareas pendientes y completadas.
- Estado vacío con indicador visual cuando no hay tareas.
- Persistencia automática en `localStorage`.
- Interfaz nativa adaptable a iOS y Android gracias a Ionic.

---

## Stack Tecnológico


| Tecnología | Versión | Propósito                         |
| ---------- | ------- | --------------------------------- |
| Angular    | 20      | Framework principal               |
| Ionic      | 8       | Componentes de UI multiplataforma |
| Capacitor  | 8.3     | Runtime nativo (iOS / Android)    |
| TypeScript | 5.9     | Tipado estático                   |


---

## Requisitos Previos

- [Node.js](https://nodejs.org/) >= 22.14.0
- npm >= 10.9.2
- [Ionic CLI](https://ionicframework.com/docs/cli) >= 7.2.1

```bash
npm install -g @ionic/cli
```

### Para Android

- [Android Studio](https://developer.android.com/studio) (Hedgehog o superior)
- Android SDK con al menos una API level instalada (recomendado: API 34)
- Un dispositivo físico con **depuración USB activada** o un emulador configurado desde el AVD Manager de Android Studio

### Para iOS (solo macOS)

- [Xcode](https://developer.apple.com/xcode/) 15 o superior
- Command Line Tools de Xcode instaladas (`xcode-select --install`)
- [CocoaPods](https://cocoapods.org/) (`sudo gem install cocoapods`)
- Un simulador de iOS disponible en Xcode o un dispositivo físico con una cuenta de desarrollador Apple configurada

---

## Instalación

```bash
# Clonar el repositorio
git clone git@github.com:eduardoqb/tasks-app.git
cd tasks

# Instalar dependencias
npm install
```

---

## Scripts Disponibles


| Comando                      | Descripción                                                 |
| ---------------------------- | ----------------------------------------------------------- |
| `npm start`                  | Inicia el servidor de desarrollo en `http://localhost:4200` |
| `npm run watch`              | Build en modo watch para desarrollo                         |
| `npm run start:android:dev`  | Build de desarrollo + sync + abre Android Studio            |
| `npm run start:android:prod` | Build de producción + sync + abre Android Studio            |
| `npm run start:ios:dev`      | Build de desarrollo + sync + abre Xcode                     |
| `npm run start:ios:prod`     | Build de producción + sync + abre Xcode                     |


---

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   └── task-list/            # Componente reutilizable de lista de tareas
│   │       ├── task-list.component.ts
│   │       ├── task-list.component.html
│   │       └── task-list.component.scss
│   ├── home/                     # Página principal (crear y gestionar tareas)
│   │   ├── home.page.ts
│   │   ├── home.page.html
│   │   └── home.page.scss
│   ├── layout/                   # Layout global (header + router-outlet)
│   │   ├── layout.component.ts
│   │   ├── layout.component.html
│   │   └── layout.component.scss
│   ├── models/
│   │   └── task.model.ts         # Interfaz Task
│   ├── services/
│   │   └── task.service.ts       # Servicio central de gestión de estado
│   ├── app.component.ts          # Componente raíz
│   ├── app.component.html
│   └── app.routes.ts             # Configuración de rutas (lazy loading)
├── assets/
├── environments/
├── theme/
│   └── variables.scss            # Variables de tema Ionic
├── global.scss
├── index.html
└── main.ts                       # Bootstrap de la aplicación
```

---

## Arquitectura

La aplicación sigue una arquitectura basada en **componentes standalone** (sin `NgModule`) y **Angular Signals** para el manejo reactivo del estado.

### Flujo de datos

```
TaskService (Signals + localStorage)
        │
        ├── tasks          → Signal de solo lectura con todas las tareas
        ├── pendingTasks   → Signal computada (tareas no completadas)
        ├── completedTasks → Signal computada (tareas completadas)
        └── pendingCount   → Signal computada (cantidad pendiente)
        │
        ▼
    HomePage ──────────► TaskListComponent
   (crea tareas)       (renderiza + emite eventos toggle/delete)
```

### Rutas

Todas las rutas utilizan **lazy loading** con `loadComponent`:


| Ruta    | Componente | Descripción                            |
| ------- | ---------- | -------------------------------------- |
| `/home` | `HomePage` | Vista principal con la lista de tareas |


---

## Modelo de Datos

```typescript
interface Task {
  id: string;        // UUID generado con crypto.randomUUID()
  title: string;     // Título descriptivo
  completed: boolean; // Estado de la tarea
  createdAt: number;  // Timestamp de creación (epoch ms)
}
```

Las tareas se persisten bajo la clave `todo_tasks` en `localStorage`.

---

## Ejecución en Dispositivos

La app usa Capacitor para compilar y ejecutar en plataformas nativas. Los scripts del proyecto automatizan el flujo completo: **build → sync → apertura del IDE nativo**.

### 1. Agregar plataformas (solo la primera vez)

```bash
npx cap add android
npx cap add ios        # solo macOS
```

Esto crea las carpetas `android/` e `ios/` con los proyectos nativos.

### 2. Android

#### Con emulador

1. Abre Android Studio y ve a **Tools → Device Manager**.
2. Crea un dispositivo virtual (AVD) si no tienes uno (ej. Pixel 7, API 34).
3. Inicia el emulador desde el Device Manager.
4. Ejecuta desde la terminal:

```bash
# Modo desarrollo
npm run start:android:dev

# Modo producción
npm run start:android:prod
```

1. Android Studio se abrirá automáticamente. Presiona **Run ▶** o `Shift + F10` para instalar la app en el emulador.

#### Con dispositivo físico

1. Activa **Opciones de desarrollador** en el dispositivo (toca 7 veces el número de compilación en Ajustes → Acerca del teléfono).
2. Habilita **Depuración USB** dentro de Opciones de desarrollador.
3. Conecta el dispositivo por USB y acepta el diálogo de depuración.
4. Ejecuta `npm run start:android:dev` o `npm run start:android:prod`.
5. En Android Studio, selecciona tu dispositivo en el selector de destino y presiona **Run ▶**.

### 3. iOS (solo macOS)

#### Con simulador

1. Ejecuta desde la terminal:

```bash
# Modo desarrollo
npm run start:ios:dev

# Modo producción
npm run start:ios:prod
```

1. Xcode se abrirá automáticamente. Selecciona un simulador en la barra superior (ej. iPhone 16).
2. Presiona **Run ▶** o `Cmd + R` para compilar e iniciar la app en el simulador.

#### Con dispositivo físico

1. Conecta el iPhone/iPad por USB.
2. En Xcode, ve a **Signing & Capabilities** y selecciona tu equipo de desarrollo (Apple ID personal o cuenta de organización).
3. Selecciona tu dispositivo en el selector de destino.
4. Presiona **Run ▶** o `Cmd + R`. La primera vez puede solicitar que confíes en el certificado desde el dispositivo (Ajustes → General → Gestión de dispositivos).

