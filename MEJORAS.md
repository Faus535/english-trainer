# Mejoras UX - English Fast Learning

## Fase 1: Saltar test + nivel global [IMPLEMENTADA]

### 1.1 Opción "Elegir mi nivel" en pantalla de test
- Antes de iniciar el test, mostrar alternativa: "Ya sé mi nivel"
- Selector con niveles A1, A2, B1, B2, C1
- Descripción breve de cada nivel para orientar al usuario
- Un solo nivel para TODOS los módulos (listening, vocabulary, grammar, phrases, pronunciation)

### 1.2 Aplicar nivel global
- Al elegir nivel, asignar ese nivel a todos los módulos en `profile.levels`
- Marcar `testCompleted = true`
- Redirigir al dashboard directamente

---

## Fase 2: Navegación por bloques [IMPLEMENTADA]

### 2.1 Barra de progreso de sesión (arriba)
- Mostrar los bloques de la sesión actual como steps/breadcrumbs
- Ejemplo: `Repaso > Listening > Pronunciación > Vocabulario > Práctica`
- Bloque activo resaltado, completados con check, pendientes en gris
- Visible durante toda la sesión

### 2.2 Vista bloque-a-bloque
- Mostrar UN solo bloque a la vez (no todos con scroll)
- Botón "Siguiente bloque" al final de cada bloque
- Botón "Bloque anterior" para volver a bloques ya completados
- NO permitir avanzar a bloques futuros (botón deshabilitado)

### 2.3 Bloqueo de avance sin completar
- Definir criterio de "completado" por tipo de bloque:
  - Listening: todos los audios escuchados + respuestas reveladas
  - Vocabulario: todos los items vistos/respondidos
  - Pronunciación: todos los ejercicios completados
  - Warmup/Practice: marcar como visto (sin validación estricta)
- Botón "Siguiente" deshabilitado hasta cumplir criterio
- Indicador visual de progreso dentro del bloque (3/5 completados)

---

## Fase 3: Ejercicios item-a-item [IMPLEMENTADA]

### 3.1 Listening: audios de 1 en 1
- Micro-dictation muestra UN item a la vez (play + input + ver respuesta)
- Navegación: "Siguiente" solo tras interactuar (escuchar + escribir o ver respuesta)
- Indicador: "Ejercicio 2 de 5"
- Al completar último item, bloque marcado como completado

### 3.2 Vocabulario: palabras de 1 en 1
- En ejercicios de vocabulario en sesión, mostrar UNA palabra/ejercicio a la vez
- Misma mecánica: interactuar antes de avanzar
- Indicador de progreso

### 3.3 Traducciones ES-EN en respuestas
- Al pulsar "Ver respuesta" en listening, mostrar:
  - Texto en inglés (como ahora)
  - Traducción al español debajo
  - Nota explicativa (si existe)
- Añadir traducciones al español en `getMicroDictationSentences()` y ejercicios similares
- Formato: `"Turn it off, please." → "Apágalo, por favor."`

---

---

## Fase 4: Validación de pronunciación por voz [IMPLEMENTADA]

### 4.1 Motor de reconocimiento de voz
- Usar Web Speech Recognition API (`SpeechRecognition` / `webkitSpeechRecognition`)
- Forzar `lang: 'en-US'` para que sea estricto con pronunciación inglesa
- Detección de soporte del navegador con fallback graceful (ocultar botón si no soporta)

### 4.2 Componente reutilizable de grabación
- Botón micrófono con estados: idle → grabando (pulso rojo) → procesando → resultado
- Timeout automático de 10 segundos
- Cancelar grabación en cualquier momento

### 4.3 Comparación y feedback
- Comparar transcripción vs texto esperado palabra a palabra
- Mostrar: porcentaje de acierto, palabras correctas en verde, falladas en rojo
- Confidence score de la API como indicador de claridad
- Permitir reintentar ilimitadamente
- Mensaje motivacional según score (0-50% "Inténtalo de nuevo", 50-80% "Casi!", 80-100% "Perfecto!")

### 4.4 Integración en ejercicios existentes
- **Micro-dictation**: botón "Repite la frase" después de ver la respuesta
- **Vocabulario**: botón micrófono en la card de palabra para pronunciarla
- **Pronunciación**: ejercicio dedicado "escucha, repite y compara"

---

---

## Fase 5: Tab "Hablar" — Quiz de pronunciación con frases [IMPLEMENTADA]

### 5.1 Nueva pestaña "Hablar"
- 5a pestaña en bottom nav con icono de micrófono
- Accesible en cualquier momento, independiente de las sesiones

### 5.2 Banco de frases por nivel CEFR
- A1: 15 frases básicas (presentaciones, necesidades, preguntas simples)
- A2: 15 frases intermedias (tiempos verbales, opiniones, peticiones)
- B1: 15 frases con condicionales, modales, phrasal verbs
- B2: 10 frases complejas (inversiones, participios, reported speech)
- C1: 8 frases avanzadas (registro formal, matices, expresiones nativas)

### 5.3 Flujo del quiz
1. Selector de nivel CEFR arriba (A1-C1), predeterminado al nivel del usuario
2. Botón "Escuchar frase" — TTS lee la frase en inglés
3. Botón "Repite la frase" — graba al usuario y valida pronunciación
4. Texto de la frase visible para comprobar
5. Traducción al español (oculta, revelar manualmente)
6. Navegación Anterior/Siguiente entre frases aleatorias

---

## Orden de implementación

1. **Fase 1** → Cambio rápido, mejora onboarding
2. **Fase 2** → Reestructura la sesión, base para fase 3
3. **Fase 3** → Mejora la calidad de cada ejercicio individual
4. **Fase 4** → Validación de pronunciación por voz (Speech Recognition API)
5. **Fase 5** → Tab "Hablar" con quiz de frases por nivel
