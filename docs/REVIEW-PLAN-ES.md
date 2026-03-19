# English Trainer — Plan de Revision y Rediseno

> Documento vivo. Actualizar despues de completar cada fase.

---

## FASE 1: Auditoria UI/UX para lectura en iPhone

### 1.1 Analisis de Color y Contraste

| Elemento | Actual | Contraste vs fondo (#1a1a2e) | WCAG AA (4.5:1) | Veredicto |
|----------|--------|-------------------------------|------------------|-----------|
| Texto principal `--text` | #eee | ~13:1 | PASA | OK |
| Secundario `--text2` | #aab | ~6.5:1 | PASA | OK |
| Atenuado `--muted` | #778 | ~3.8:1 | FALLA | Demasiado tenue para texto. Solo valido para etiquetas |
| Acento `--accent` | #e94560 | ~4.8:1 | PASA (justo) | Falla sobre fondos `--bg3` |
| Verde `--green` | #4ecca3 | ~8.5:1 | PASA | OK |
| Purpura `--accent2` | #533483 | ~2.1:1 | FALLA | Texto IPA ilegible con poca luz |

**Problemas encontrados:**
- `--muted` (#778) se usa para numeros de dia, titulos de semana, tips, previews — se vuelven invisibles al aire libre o en habitaciones con mucha luz en iPhone
- `--accent2` (#533483) usado para la pronunciacion IPA tiene un contraste criticamente bajo — el elemento mas importante en una app de pronunciacion
- `--accent` (#e94560) sobre fondos `--bg3` (#0f3460) (cabeceras de semana, tiempos de actividad) cae por debajo de 3:1
- El tema oscuro es bueno para estudiar de noche pero la oscuridad extrema (#1a1a2e) lucha contra el brillo automatico del iPhone a la luz del dia

### 1.2 Analisis de Tipografia

| Elemento | Tamano | Problema |
|----------|--------|----------|
| Etiquetas de pestana | 0.65rem (~10.4px) | Por debajo del minimo de Apple HIG (11px). Dificil de leer |
| Preview del dia | 0.65rem | Oculto en movil (<500px) pero sigue renderizado |
| Titulo de semana | 0.75rem (~12px) | Limite para texto de subtitulo |
| Celdas de tabla | 0.85rem (~13.6px) | OK pero apretado con botones de reproduccion |
| Numero de dia | 0.75rem | Pequeno + color atenuado = doble penalizacion |
| Selector de voz | 0.72rem | Diminuto en iPhone, dificil tocar el texto del dropdown |
| Contenido MD p | hereda (~16px) | Buen tamano base |
| Palabra flashcard | 2.4rem / 1.8rem movil | Bien |

**Problemas encontrados:**
- 5 elementos estan por debajo de 12px de tamano efectivo — Apple HIG recomienda 11pt minimo, pero la legibilidad para contenido de aprendizaje deberia apuntar a 14px+
- Las alturas de linea en areas de contenido (1.4–1.5) son aceptables pero se beneficiarian de 1.6 para comodidad de lectura
- Sin escalado dinamico de fuente — `user-scalable=no` en el meta viewport impide activamente el zoom con pellizco, lo cual es una violacion de accesibilidad

### 1.3 Layout y Zonas Tactiles

| Componente | Problema |
|------------|----------|
| Header | Apretado en iPhone SE: titulo + slider + dropdown + 3 botones en una fila. Se desborda mal |
| Grid de dias | 7 columnas en tablet, 4 en movil — los tiles se hacen diminutos (< 70px de ancho) con contenido truncado |
| Botones play | 32px visual, pero ::before extiende a 44px — ingenioso pero el tamano visual se siente pequeno |
| Slider de velocidad | 60px de ancho — dificil de controlar con precision en tactil |
| Nav inferior | Bien: fijo, 44px+ de alto, padding de area segura |
| Visor de archivos | max-height 50vh en movil — corta el contenido, el usuario debe hacer scroll dentro de un scroll (scroll anidado) |

**Problemas encontrados:**
- `user-scalable=no` — hay que quitarlo. Usuarios con problemas de vision no pueden hacer zoom
- Desbordamiento del header en pantallas pequenas — demasiados controles compitiendo por espacio
- Scroll anidado (visor de archivos dentro de main) crea confusion en iOS (rebote elastico en ambos)
- El salto de grid de dias de 7 columnas a 4 es abrupto; no hay breakpoint intermedio

### 1.4 Problemas Especificos de iPhone

- **Area segura**: Gestionada correctamente con `env(safe-area-inset-*)` — bien
- **Barra de estado**: `black-translucent` funciona pero el fondo oscuro del header se funde con la barra de estado, sin separacion visual
- **Rebote elastico**: El scroll anidado en el visor de archivos dispara el overscroll de iOS en el contenedor equivocado
- **TTS**: iOS Safari pausa despues de 15s — ya gestionado con intervalo de resume — bien
- **Bloqueo vertical**: `orientation: portrait` en el manifest — correcto para lectura
- **Pantalla de inicio**: Modo standalone probado — funciona, pero el splash es generico

### 1.5 Veredicto

**La UI funciona pero no esta optimizada para lectura prolongada en iPhone.** Problemas principales ordenados por impacto:

1. **Critico**: El color del IPA (#533483) es casi invisible — esto anula el proposito principal
2. **Critico**: `user-scalable=no` bloquea el zoom de accesibilidad
3. **Alto**: Texto atenuado demasiado tenue para uso exterior/con luz en multiples elementos clave
4. **Alto**: El header esta sobrecargado en iPhones pequenos (SE, Mini)
5. **Medio**: Fuente de etiquetas de pestana demasiado pequena (0.65rem)
6. **Medio**: UX de scroll anidado en el visor de archivos
7. **Bajo**: Sin opcion de tema claro para uso diurno

---

## FASE 2: Rediseno de UI — COMPLETADA 2026-03-19

### 2.1 Correcciones de Color — HECHO

- [x] `--accent2`: cambiado de #533483 a #a78bfa (purpura claro, ~7:1 de contraste)
- [x] `--muted`: cambiado de #778 a #99a (sube a ~5:1, pasa AA)
- [x] `--text2`: subido de #aab a #bbc para mejor legibilidad del texto secundario
- [x] Anadida variable `--ipa-color` (#c4b5fd) especificamente para texto fonetico
- [x] Eliminado `user-scalable=no` del meta viewport
- [ ] Probar todas las combinaciones de color con verificador WebAIM (verificacion manual pendiente)

### 2.2 Correcciones de Tipografia — HECHO

- [x] Etiquetas de pestana: subidas de 0.65rem a 0.72rem
- [x] Titulos de semana: subidos de 0.75rem a 0.82rem + color cambiado de --muted a --text2
- [x] Numeros de dia: subidos de 0.75rem a 0.8rem + usa --text2 en lugar de --muted
- [x] Selector de voz: subido de 0.72rem a 0.8rem (ahora en panel de ajustes)
- [x] Parrafos de contenido MD: fijados a 0.95rem con line-height 1.65
- [x] Preview de dias: subido de 0.65rem a 0.72rem + color --text2
- [x] Elementos IPA: subidos de 0.85em a 0.88em + usa --ipa-color
- [ ] Anadir opcion `font: -apple-system-body` para Dynamic Type en iOS (futuro)

### 2.3 Mejoras de Layout — HECHO

- [x] Header: movidos slider de velocidad + selector de voz + exportar/reiniciar a panel de ajustes desplegable (icono engranaje)
- [x] Header simplificado: titulo + boton parar + toggle tema + icono engranaje
- [x] Grid de dias: cambiado a `repeat(auto-fill, minmax(80px, 1fr))` para columnas fluidas
- [x] Visor de archivos: se abre como overlay a pantalla completa en movil (<600px)
- [x] Anadido padding safe-area-inset-top al header para separacion de barra de estado
- [x] Panel de ajustes responsive: se apila verticalmente en movil

### 2.4 Tema Claro — HECHO

- [x] Anadidas propiedades CSS personalizadas para modo claro via clase `.light-theme`
- [x] Respeta media query `prefers-color-scheme: light` automaticamente
- [x] Anadido boton toggle de tema (icono luna/sol) en el header
- [x] Tema persistido en localStorage (`english_plan_theme`)
- [x] Actualizacion dinamica del meta theme-color al cambiar
- [x] Todos los fondos semi-transparentes adaptados para fondos claros

---

## FASE 3: Analisis de la Estrategia de Aprendizaje

### 3.1 Revision de la Estructura Actual

**Lo que el plan hace bien:**
- 16 semanas / 112 dias es un plazo realista para progresar de A2 a B1
- Sesiones diarias de 25 min coinciden con la investigacion sobre atencion (tipo Pomodoro)
- Dias de descanso cada 7o dia previenen el agotamiento
- Enfoque de pronunciacion primero (Schwa → vocales → consonantes) respaldado por investigacion fonetica
- Repeticion espaciada a traves de repasos semanales
- Multimodal: lectura + escucha + habla (TTS) + escritura (dictado)

**Lo que necesita evaluacion:**
- **Ritmo de progresion**: ¿Saltar de la Schwa (semana 1) a gramatica de Past Simple (semana 2) es demasiado rapido? Mezclar fonetica + gramatica en la misma sesion puede sobrecargar la memoria de trabajo
- **Sin practica activa de habla**: El TTS habla AL usuario, pero no hay mecanismo para que el usuario hable y reciba feedback (reconocimiento de voz)
- **Sin algoritmo de repeticion espaciada**: Las flashcards son aleatorias, no SM-2 ni Leitner. Palabras vistas una vez pueden no volver nunca
- **Dependencia de video**: El dictado depende de YouTube externo — si los videos caen, esas actividades se rompen
- **Sin test de nivel**: Todos empiezan en el Dia 1 sin importar su nivel. Un estudiante A2 y un principiante completo siguen el mismo camino
- **Integracion de gramatica**: Los temas gramaticales (tiempos verbales, condicionales) aparecen dispersos. No hay un hilo claro de progresion gramatical
- **Sin practica de conversacion**: El milestone dice "primera conversacion real" en la semana 13, pero nada en la app practica conversacion
- **Techo de vocabulario**: 1209 palabras cubre bien A2-B1, pero no hay priorizacion por frecuencia de uso en el flujo de estudio
- **Sin seguimiento de errores**: El usuario no puede ver en que tiene dificultades — sin enfoque en areas debiles

### 3.2 Consideraciones de Rediseno

**Mantener (efectividad comprobada):**
- Micro-sesiones diarias (20-30 min)
- Pronunciacion como base
- Gamificacion (XP, rachas, logros)
- Bloques de dificultad progresiva (A→D)
- Dias de descanso
- Integracion de TTS

**Mejorar:**
- [ ] **Separar pistas de pronunciacion y gramatica**: Que los usuarios hagan pronunciacion diaria (10 min) + gramatica 2x/semana (15 min) en vez de mezclar ambas
- [ ] **Anadir repeticion espaciada a flashcards**: Implementar sistema Leitner (5 cajas) — las palabras suben cuando aciertas, bajan cuando fallas
- [ ] **Anadir reconocimiento de voz**: Usar Web Speech API (`SpeechRecognition`) para practica de pronunciacion con feedback
- [ ] **Anadir test de nivel**: Quiz de 5 minutos al inicio para saltar material conocido (saltar Bloque A si el usuario sabe lo basico)
- [ ] **Hoja de ruta de gramatica**: Crear una progresion gramatical visible separada de la pronunciacion
- [ ] **Seguimiento de areas debiles**: Registrar que flashcards se fallan mas, que puntuaciones de dictado son bajas
- [ ] **Contenido offline seguro**: Reemplazar algunas dependencias de YouTube con audio inline o clips descargables
- [ ] **Simulador de conversacion**: Ejercicios simples de pregunta-respuesta (incluso sin IA, los dialogos con guion funcionan)

**Alternativa radical (si se redisena completamente):**
- Cambiar del plan lineal basado en dias a un **modelo de arbol de habilidades**: el usuario elige que estudiar (pronunciacion, gramatica, vocabulario, escucha) con prerequisitos
- Cada habilidad tiene niveles (1→5) con objetivos claros
- Camino diario sugerido pero libertad para elegir
- Esto es mas complejo de implementar pero mejora drasticamente el engagement para usuarios que no son principiantes completos

### 3.3 Matriz de Prioridades

| Cambio | Impacto | Esfuerzo | Prioridad |
|--------|---------|----------|-----------|
| Corregir colores IPA/atenuado | Alto | Bajo | HACER PRIMERO |
| Eliminar user-scalable=no | Alto | Trivial | HACER PRIMERO |
| Simplificar header | Medio | Bajo | Fase 2.3 |
| Flashcards Leitner | Alto | Medio | Proximo sprint |
| Reconocimiento de voz | Alto | Medio | Proximo sprint |
| Test de nivel | Medio | Bajo | Proximo sprint |
| Separar pista de gramatica | Medio | Medio | Rediseno del plan |
| Tema claro | Bajo | Medio | Backlog |
| Modelo de arbol de habilidades | Muy Alto | Muy Alto | V2.0 |

---

## Orden de Ejecucion

```
Fase 2.1 → Correcciones de color (1-2 horas)
Fase 2.2 → Correcciones de tipografia (1 hora)
Fase 2.3 → Mejoras de layout (2-3 horas)
Fase 3.2 → Flashcards Leitner + reconocimiento de voz (1-2 dias)
Fase 3.2 → Test de nivel + separacion de gramatica (1 dia)
Fase 2.4 → Tema claro (medio dia, opcional)
Fase 3.2 → Modelo de arbol de habilidades (V2.0, reescritura mayor)
```

---

*Ultima actualizacion: 2026-03-19*
