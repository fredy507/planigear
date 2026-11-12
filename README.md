# Plandra

CAD para topografía (Rust-IA), para Windows y Linux. Uso gratuito.

> ⚠️ **Versión ALFA (de prueba).** Puede tener errores. Las curvas de nivel, la nivelación de plataformas, el cálculo de volúmenes y el diseño de caminos y calles están **en desarrollo**: sus resultados son orientativos y deben comprobarse con otro método antes de usarlos en planos, presupuestos u obras. Guarde copias de sus proyectos. Lea `AVISO_ALFA.txt`.

## Cómo se hizo

Plandra está escrito en **Rust** con **asistencia de inteligencia artificial**. El código fuente se escribió con varias herramientas de inteligencia artificial, bajo la dirección del autor. Son obra del autor la concepción, el diseño, los requisitos y la arquitectura del programa; la selección y el orden del código; y la revisión, corrección y rechazo de cada cambio, que probó en el propio programa.

## Descargar

Ve a **[Releases](../../releases/latest)** y baja el archivo de tu sistema:

| Sistema | Archivo | Cómo se instala |
|---|---|---|
| Windows 10/11 (64 bits) | `Plandra-<versión>-windows-instalador.exe` | Doble clic y seguir el asistente |
| Windows sin instalar | `Plandra-<versión>-windows-portable.zip` | Descomprimir y abrir `Plandra.exe` |
| Linux Mint, Ubuntu, Debian | `Plandra-<versión>-linux-amd64.deb` | Doble clic → «Instalar paquete» |
| Otras distribuciones Linux | `Plandra-<versión>-linux-x86_64.AppImage` | Permitir ejecutar y doble clic |

## Requisitos

| | Mínimo | Recomendado |
|---|---|---|
| Sistema | Windows 10 64 bits · Linux de 2022 en adelante (Ubuntu 22.04, Mint 21, Debian 12) | Windows 11 · Mint 22 / Ubuntu 24.04 |
| Procesador | 2 núcleos | 4 núcleos o más |
| RAM | 4 GB | 8 GB (16 GB para DXF muy grandes) |
| Gráficos | OpenGL 2.0 | OpenGL 3.3 |
| Pantalla | 1366 × 768 | 1920 × 1080 |
| Disco | 200 MB | 1 GB |

El OCR (leer tablas desde imágenes) es opcional y usa Tesseract; ver `LEEME.txt`.

## Licencia

Plandra es **software propietario de uso gratuito**: puedes usarlo sin costo, también para trabajos profesionales, pero no modificarlo, revenderlo ni incluirlo en otros productos. Lee [LICENSE.txt](LICENSE.txt).

Este repositorio solo contiene las descargas; el código fuente no es público.

© 2026 Alonso Frederik Arauz Jordan (Panamá) · Identificador de la obra: `PLD-8E9961BF-A3EF-4497-9ADE-B1838F4C5F90`
