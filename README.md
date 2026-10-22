# Anida · Landing

Landing de Anida (crédito hipotecario), con Hornero como guía.

## Estructura
- `src/tpl.html`: plantilla HTML y CSS, con marcadores `%%...%%`.
- `src/main.js`: interacciones (hero, Cómo funciona, manifiesto, Hornero, simulador y chat).
- `src/app.html`: la app que se ve dentro de la laptop del hero.
- `src/hb_defs.html`: símbolo SVG de Hornero.
- `assets/`: imagen del hero, video del cielo, ilustraciones y logos.
- `modules/casa-seguridad.html`: módulo aparte de la casa despiezada, en exploración.
- `index.html`: la landing final, un solo archivo autocontenido.

## Build
```
python3 build.py
```
Genera `index.html` con todos los assets incrustados en base64.

## Dependencias (CDN)
GSAP 3.12.5, ScrollTrigger y Lenis 1.3.26.

## Notas
- La escena del hero cambia según la hora del visitante: noche de 20 a 6 h, con ventanas encendidas.
- Al tipear el CUIL se enciende la lámpara.
- Hornero no promete contacto humano.
