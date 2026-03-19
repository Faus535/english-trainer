# Fase 5 — Plan de Implementacion

## Decisiones tomadas

| Decision | Resultado |
|----------|-----------|
| Arquitectura | **Modular** — cada modulo con progresion independiente |
| Foco principal | **Listening (40%)**, balanceado con vocabulario, gramatica, frases, pronunciacion |
| day-XXX actuales | **Se reemplazan** — no se mantiene modo clasico |
| Duracion variable | Cada alumno llega a C1 a su ritmo (60-90+ sesiones segun nivel inicial) |

---

## Estructura de contenido modular

### Directorios nuevos

```
english/
  modules/
    listening/
      a1/          # Sesiones listening nivel A1
      a2/
      b1/
      b2/
      c1/
    vocabulary/
      a1/
      a2/
      b1/
      b2/
      c1/
    grammar/
      a1/
      a2/
      b1/
      b2/
      c1/
    phrases/
      a1/
      a2/
      b1/
      b2/
      c1/
    pronunciation/
      a1/
      a2/
      b1/
      b2/
      c1/
  test-nivel/
    vocabulario.md
    gramatica.md
    listening.md
```

### Formato de una unidad modular

Cada fichero dentro de `modules/[modulo]/[nivel]/` es una unidad autocontenida. No depende de unidades anteriores (puede referenciarlas para repaso, pero se entiende sola).

Ejemplo: `modules/listening/a2/unit-003-reduced-forms-modals.md`

```markdown
# Listening A2 — Unit 3: Reduced Forms en Modales

## Objetivo
Reconocer shoulda/coulda/woulda en audio real.

## Contenido (8-10 min)
[Explicacion + ejemplos + audio TTS]

## Practica (4-5 min)
[Ejercicios de reconocimiento + dictation]

## Warm-up material
[5 items de repaso para usar como warm-up en sesiones futuras]
```

### Cuantas unidades por modulo y nivel

| Modulo | A1 | A2 | B1 | B2 | C1 | Total |
|--------|----|----|----|----|-----|-------|
| Listening | 10 | 12 | 12 | 10 | 8 | 52 |
| Vocabulario | 8 | 10 | 10 | 8 | 6 | 42 |
| Gramatica | 8 | 8 | 10 | 8 | 6 | 40 |
| Frases | 6 | 8 | 8 | 6 | 4 | 32 |
| Pronunciacion | 6 | 6 | 6 | 4 | 4 | 26 |

**Nota**: Un alumno NO hace todas las unidades. Solo las de su nivel y superiores. Un alumno que entra en A2 de listening y B1 de gramatica hace:
- Listening: 12 (A2) + 12 (B1) + 10 (B2) + 8 (C1) = 42 unidades
- Gramatica: 10 (B1) + 8 (B2) + 6 (C1) = 24 unidades

Como listening tiene mas unidades y es el 40% de cada sesion, el listening siempre marca el ritmo.

---

## Logica de generacion de sesion (en la app)

La app genera cada sesion asi:

```
1. Leer nivel actual de cada modulo (localStorage)
2. Seleccionar la siguiente unidad de listening (SIEMPRE presente)
3. Seleccionar la siguiente unidad del modulo secundario que toque hoy:
   - Sesion 1 de la semana: Vocabulario
   - Sesion 2: Gramatica
   - Sesion 3: Frases
   - Sesion 4 (bonus): Pronunciacion o repaso
4. Generar warm-up con material de unidades completadas recientemente
5. Montar sesion: warm-up (3 min) + listening (8 min) + secundario (5 min) + practica (4 min)
```

### Sesion tipo generada

| Bloque | Tiempo | Fuente |
|--------|--------|--------|
| Warm-up | 3 min | Items de repaso de ultimas 3 unidades completadas |
| Listening | 8 min | `modules/listening/[nivel]/unit-XXX.md` — contenido + ejercicios |
| Modulo secundario | 5 min | `modules/[vocabulario|gramatica|frases|pronunciacion]/[nivel]/unit-XXX.md` |
| Practica activa | 4 min | Ejercicio integrado: usa lo del listening + lo del secundario |
| **Total** | **20 min** | |

### Sesion corta (dia con poco tiempo)

| Bloque | Tiempo | Fuente |
|--------|--------|--------|
| Warm-up | 2 min | Repaso rapido |
| Listening | 8 min | Unidad normal |
| Practica | 3 min | Solo listening |
| **Total** | **13 min** | |

### Sesion extendida (dia con ganas)

| Bloque | Tiempo | Fuente |
|--------|--------|--------|
| Warm-up | 3 min | Repaso |
| Listening | 10 min | Unidad + extra |
| Modulo secundario | 7 min | Unidad completa |
| Practica | 5 min | Ejercicio integrado |
| Bonus | 5 min | Serie/podcast/reto |
| **Total** | **30 min** | |

---

## Progresion y ritmo

### Como sube de nivel un modulo

Cada unidad tiene ejercicios con puntuacion. La app trackea:
- **Aciertos en la unidad**: >80% = unidad completada
- **Cada 4-5 unidades**: Mini-test automatico del nivel actual
- **Si aprueba el mini-test**: Pasa al siguiente nivel del modulo
- **Si no aprueba**: Repite unidades de refuerzo (no repite las mismas, nuevos ejercicios)

### Ejemplo de caminos diferentes

**Alumno A** — Reading B1, Listening A1, habitual del instituto:
- Test: Listening A1, Vocabulario A2, Gramatica A2-B1, Frases A2, Pronunciacion A1
- Camino: ~80 sesiones hasta C1 de listening (el mas lento)
- Gramatica llega a C1 en ~50 sesiones (va mas rapido)
- **Duracion estimada**: 20-25 semanas a 3-4 sesiones/semana

**Alumno B** — Reading B1-B2, Listening A2, trabaja con emails en ingles:
- Test: Listening A2, Vocabulario B1, Gramatica B1, Frases A2, Pronunciacion A1
- Camino: ~60 sesiones hasta C1 de listening
- Vocabulario y gramatica llegan a C1 en ~35 sesiones
- **Duracion estimada**: 15-20 semanas

**Alumno C** — Apenas A1 en todo:
- Test: Todo A1
- Camino completo: ~90 sesiones
- **Duracion estimada**: 23-30 semanas

---

## Orden de implementacion

### Sprint 1: Fundamento (lo primero)
1. **Test de nivel** — Preguntas + logica de clasificacion
2. **Modulo Listening A1-A2** — Las primeras 22 unidades (el core del producto)
3. **Modulo Vocabulario A1-A2** — Las primeras 18 unidades
4. **Motor de sesion en app.js** — Generador de sesiones a partir de modulos

### Sprint 2: Contenido core
5. **Modulo Gramatica A1-A2** — 16 unidades
6. **Modulo Frases A1-A2** — 14 unidades
7. **Modulo Pronunciacion A1-A2** — 12 unidades
8. **Sistema de progresion** — Tracking, mini-tests, subida de nivel

### Sprint 3: Nivel intermedio
9. **Todos los modulos B1** — ~46 unidades total
10. **Warm-up inteligente** — Repaso espaciado real

### Sprint 4: Nivel avanzado
11. **Todos los modulos B2** — ~36 unidades
12. **Todos los modulos C1** — ~28 unidades

### Sprint 5: Pulido
13. **Sesion corta / extendida** — Flexibilidad de tiempo
14. **Onboarding y UX** — Mensajes, progreso visible, metricas

---

## Que pasa con el contenido actual

| Contenido actual | Destino |
|-----------------|---------|
| `trainer/day-XXX.md` (93 ficheros) | **Se eliminan**. El contenido util se extrae y redistribuye en los modulos. |
| `vocabulary/top-*.md` | **Se reutiliza** como fuente para `modules/vocabulary/` |
| `grammar/*.md` | **Se reutiliza** como referencia para `modules/grammar/` |
| `listening/*.md` | **Se reutiliza** como fuente para `modules/listening/` |
| `phrases/*.md` | **Se reutiliza** como fuente para `modules/phrases/` |
| `pronunciation/*.md` | **Se reutiliza** como fuente para `modules/pronunciation/` |
| `my-plan.md` | **Se elimina** — reemplazado por sistema adaptativo |
| `listening/training-plan.md` | **Se elimina** — integrado en modulos |
| `daily/*.md` | **Se evalua** — puede integrarse en frases/vocabulario |
| `skills/*.md` | **Se evalua** — puede integrarse en modulos |

**Nota**: Los .md de referencia (`vocabulary/top-*.md`, `grammar/*.md`, etc.) NO se eliminan. Se mantienen como fuente/referencia. Solo se eliminan los que definen el flujo lineal (trainer, plans).

---

## Siguiente paso concreto

Empezar por el **Sprint 1**: crear el test de nivel y las primeras unidades de Listening A1-A2. Es lo que el alumno ve primero y lo que define si se queda o se va.

¿Procedemos?
