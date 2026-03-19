# Fase 4: Sistema de Repaso Espaciado

## Problema

Actualmente: si completas una unidad, **nunca vuelves a ella**. El sistema es lineal.

En aprendizaje de idiomas, el olvido es el enemigo principal. Sin repaso espaciado:
- El 80% del vocabulario nuevo se olvida en 1 semana
- Las estructuras gramaticales se "des-activan" si no se usan
- Los fonemas que cuestan se fosilizan en la pronunciacion incorrecta

## Propuesta: Spaced Repetition Light

No implementar un SRS completo tipo Anki. Es demasiado complejo y cambia la UX de "sesion guiada" a "tarjetas sueltas". En su lugar: **repaso integrado en las sesiones**.

### Mecanismo

Cada unidad completada entra en una cola de repaso con intervalo creciente:

```
Dia 0: Completas la unidad
Dia 1: Mini-repaso (2 min en el warmup de la siguiente sesion)
Dia 3: Mini-repaso
Dia 7: Mini-repaso
Dia 14: Mini-repaso
Dia 30: Mini-repaso final → unidad "consolidada"
```

### Implementacion en sesiones

El bloque de **warmup** (actualmente 2 min generico) se convierte en **repaso activo**:

```
Warmup (3 min):
1. 1 pregunta de vocabulario de una unidad en cola de repaso
2. 1 frase de listening de una unidad en cola de repaso
3. 1 minimal pair de pronunciacion de una unidad en cola de repaso
```

Si no hay unidades en cola de repaso (primeras sesiones), el warmup es el actual.

### Datos a guardar en localStorage

```javascript
// Nuevo campo en profile
moduleProgress: {
  listening_b1: {
    completedUnits: ['l-b1-01', 'l-b1-02'],
    currentUnit: 2,
    // NUEVO: cola de repaso
    reviewQueue: [
      { unitId: 'l-b1-01', nextReview: '2026-03-22', interval: 3, reviews: 1 },
      { unitId: 'l-b1-02', nextReview: '2026-03-20', interval: 1, reviews: 0 },
    ]
  }
}
```

### Logica de repaso

```
Al completar una unidad:
  → Añadir a reviewQueue con interval=1, nextReview=mañana

Al iniciar sesion:
  → Buscar unidades donde nextReview <= hoy
  → Seleccionar hasta 3 para el warmup
  → Al completar mini-repaso:
    → reviews++
    → interval = interval * 2 (1→3→7→14→30)
    → Si reviews >= 5: eliminar de cola ("consolidada")
```

### Que se repasa por modulo

| Modulo | Formato de repaso rapido |
|--------|------------------------|
| Listening | Reproduce 1 frase → escribe lo que oyes (dictation flash) |
| Vocabulary | 3 palabras: ve español → escribe ingles (flash) |
| Grammar | 1 frase fill-the-blank |
| Phrases | 1 situacion → ¿que dirias? (seleccion multiple) |
| Pronunciation | 1 minimal pair: ¿que oyes? |

### Impacto en duracion de sesion

El warmup pasa de 2 min → 3 min. La sesion total crece ~1 min.

| Modo | Antes | Despues |
|------|-------|---------|
| Short | 13 min | 14 min |
| Full | 20 min | 21 min |
| Extended | 30 min | 31 min |

Impacto minimo en tiempo, impacto enorme en retencion.

## Acciones Fase 4

### 4.1 Actualizar state.js
- Añadir reviewQueue a moduleProgress
- Funciones: addToReviewQueue(), getUnitsForReview(), completeReview()

### 4.2 Actualizar session.js
- Bloque warmup ahora consulta reviewQueue
- Render de mini-ejercicios de repaso (1 por modulo, max 3 total)
- Al completar warmup, actualizar intervalos

### 4.3 Crear ejercicios de repaso por modulo
- Extraer 1 ejercicio representativo de cada unidad .md
- Formato ligero: pregunta + respuesta, sin explicacion extensa

### 4.4 Actualizar gamification.js
- Achievement: "Racha de repaso: 7 dias seguidos"
- XP bonus por completar repaso (10 XP por sesion con repaso)
