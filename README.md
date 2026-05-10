# silo-firefox

Extensión para Firefox de [Silo](https://codeberg.org/osdaeg/silo), el gestor de enlaces autoalojado. Permite guardar la pestaña activa en Silo con un clic, con selector de colección.

## Funcionalidades

- Guarda la pestaña activa en Silo con un clic
- Selector de colección antes de guardar
- Recuerda la última colección usada
- Muestra error claro si el servidor no está disponible
- Página de configuración para URL del servidor y token

## Instalación

### Opción A — Extensión no firmada (Firefox ESR / Developer Edition / Nightly)

1. En Firefox, abrí `about:config`
2. Aceptá el aviso de precaución
3. Buscá `xpinstall.signatures.required` y ponelo en `false`
4. Descargá el archivo `silo.xpi` desde la sección [Releases](../../releases)
5. Abrí `about:addons`
6. Hacé clic en el ícono de engranaje → **Instalar complemento desde archivo**
7. Seleccioná el archivo `silo.xpi`

La extensión queda instalada de forma permanente.

> **Nota:** Firefox normal (no ESR) requiere que las extensiones estén firmadas por Mozilla. Se recomienda usar Firefox ESR para extensiones locales sin firma.

### Opción B — Cargar temporalmente (cualquier Firefox, para desarrollo)

1. Abrí `about:debugging`
2. Hacé clic en **Este Firefox**
3. Hacé clic en **Cargar complemento temporal**
4. Seleccioná el archivo `manifest.json` de la carpeta de la extensión

Esta instalación es temporal y se pierde al cerrar Firefox.

### Opción C — Agregar desde el gestor de extensiones de Firefox

[Silo para Firefox](https://addons.mozilla.org/addon/silo-firefox/)


## Configuración

La primera vez que usés la extensión (o cuando hacés clic en ⚙):

1. Ingresá la **URL del servidor** Silo, por ejemplo `http://192.168.1.10:7123`
2. Ingresá el **API Token** (el mismo que `SILO_API_TOKEN` en el `docker-compose.yml`)
3. Usá el botón **▶ PROBAR** para verificar la conexión
4. Guardá con **GUARDAR**

## Uso

1. Navegá a cualquier página
2. Hacé clic en el ícono de Silo en la barra de herramientas
3. Seleccioná una colección (opcional)
4. Hacé clic en **▶ GUARDAR**

El enlace se guarda en Silo y se sincroniza automáticamente con Raindrop si está configurado en el servidor.

## Servidor

Esta extensión requiere una instancia de [Silo](https://codeberg.org/osdaeg/silo) corriendo y accesible desde el navegador.

## Parte del ecosistema Silo

| Cliente | Descripción |
|---------|-------------|
| [silo](https://codeberg.org/osdaeg/silo) | Servidor FastAPI + dashboard web |
| [silo-cli](https://codeberg.org/osdaeg/silo-cli) | Cliente de línea de comandos |
| [silo-tui](https://codeberg.org/osdaeg/silo-tui) | Interfaz de terminal (Python Textual) |
| [silo-plasmoid](https://codeberg.org/osdaeg/silo-plasmoid) | Widget para KDE Plasma 6 |
| **silo-firefox** | **Extensión para Firefox**  ← estás aquí |
| [silo-android](https://codeberg.org/osdaeg/silo-android) | App Android |

