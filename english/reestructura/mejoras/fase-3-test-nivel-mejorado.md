# Fase 3: Mejorar el Test de Nivel

## Problemas detectados

### 3.1 Listening: solo 5 preguntas, no llega a C1

| Nivel | Preguntas actuales | Problema |
|-------|-------------------|---------|
| A1 | 1 | Insuficiente — 1 pregunta no determina nivel |
| A2 | 1 | Insuficiente |
| B1 | 2 | Apenas aceptable |
| B2 | 1 | Insuficiente |
| C1 | 0 | **NO EXISTE** — imposible clasificar C1 |

Para ser el skill principal de la app, el test de listening es ridiculo.

### 3.2 Gramatica desbalanceada

- B1 tiene 3 preguntas, C1 solo 1
- Una sola pregunta de C1 (inversion) no es representativa

### 3.3 Pronunciacion: NO SE TESTEA

El test no evalua pronunciacion en absoluto. El nivel se hereda de listening:
```javascript
profile.levels.pronunciation = CEFR_LEVELS[Math.max(0, lisIdx)];
```

Para un modulo que va a ser el 20% de la app, esto es insuficiente.

### 3.4 Umbrales fragiles

Con 2-4 preguntas por nivel, un solo error te baja un nivel entero. Con 50% de umbral y 2 preguntas, si fallas 1 ya eres del nivel anterior.

## Propuesta de nuevo test

### Estructura: 4 fases (antes eran 3)

| Fase | Preguntas | Tiempo | Formato |
|------|-----------|--------|---------|
| Vocabulario | 20 | 3 min | Traduce ES→EN (sin cambios) |
| Gramatica | 15 | 3 min | Elige opcion (ampliado) |
| Listening | 10 | 4 min | Escucha y escribe (ampliado x2) |
| Pronunciacion | 8 | 3 min | Minimal pairs: ¿que palabra oyes? |
| **Total** | **53** | **~13 min** | |

### Nuevas preguntas de Listening (de 5 → 10)

```
A1 (2 preguntas):
1. "I would like a glass of water, please." (0.8x)
2. "Can you help me find the station?" (0.8x)

A2 (2 preguntas):
3. "What time does the train leave tomorrow morning?" (0.9x)
4. "I've been waiting here for about twenty minutes." (0.9x)

B1 (2 preguntas):
5. "I'm gonna go to the store. Do you wanna come?" (1.0x)
6. "She should have told him about it earlier." (1.0x)

B2 (2 preguntas):
7. "I wouldn't have bothered if I'd known it was gonna be cancelled." (1.1x)
8. "The thing is, he's not exactly what you'd call reliable, is he?" (1.1x)

C1 (2 preguntas):
9. "Had I known about the redundancies, I wouldn't have taken the position in the first place." (1.2x)
10. "She reckons they'll have sorted it out by the time we get there, but I wouldn't count on it." (1.2x)
```

### Nuevo test de Pronunciacion (8 preguntas)

Formato: TTS reproduce una palabra → alumno elige entre 2-3 opciones cual oyo.
Evalua percepcion de fonemas (no produccion, que requeriria microfono).

```
A1 (2 preguntas):
1. Reproduce "think" → opciones: think / tink / sink
2. Reproduce "very" → opciones: very / berry / ferry

A2 (2 preguntas):
3. Reproduce "ship" → opciones: ship / sheep / chip
4. Reproduce "cat" → opciones: cat / cut / cart

B1 (2 preguntas):
5. Reproduce "comfortable" (reducido) → opciones: 3 silabas / 4 silabas / 2 silabas
6. Reproduce "I'm gonna go" → ¿cuantas palabras oyes? 3 / 4 / 5

B2 (2 preguntas):
7. Reproduce frase con inversion de stress → identificar la palabra enfatizada
8. Reproduce frase con linking → identificar cuantas palabras hay
```

### Nuevas preguntas de Gramatica (de 10 → 15)

Añadir:
- 1 mas de A1 (articulos: a/an/the)
- 1 mas de A2 (present perfect + just/already/yet)
- 1 mas de B2 (participle clauses)
- 2 mas de C1 (subjunctive + nominalizations)

### Nuevo calculo de nivel de pronunciacion

```javascript
// Antes: copiado de listening
profile.levels.pronunciation = CEFR_LEVELS[lisIdx];

// Despues: calculado independientemente
profile.levels.pronunciation = calculateLevel(testState.pronunciationAnswers);
```

## Acciones Fase 3

### 3.1 Actualizar level-test.js
- Ampliar TEST_LISTENING de 5 → 10 preguntas
- Ampliar TEST_GRAMMAR de 10 → 15 preguntas
- Crear TEST_PRONUNCIATION (8 preguntas, nuevo formato minimal-pair)
- Actualizar renderTest() para nueva fase 'pronunciation'
- Actualizar calculateResults() para nivel independiente de pronunciacion

### 3.2 Actualizar app.js
- Nuevas acciones: submitPronunciation, playPronunciationAudio

### 3.3 Actualizar CSS
- Estilos para test de pronunciacion (opciones de audio, boton de replay)

### 3.4 Actualizar renderTestIntro()
- Mostrar 4 pasos en vez de 3
- Actualizar tiempo estimado: "~13 minutos"
