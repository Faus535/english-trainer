# Fase 5: Ampliar Contenido C1

## Problema

C1 tiene el **menor numero de unidades** de todos los niveles:

| Modulo | A1 | A2 | B1 | B2 | C1 |
|--------|----|----|----|----|-----|
| Listening | 10 | 12 | 12 | 10 | **8** |
| Vocabulary | 8 | 10 | 10 | 8 | **6** |
| Grammar | 8 | 8 | 10 | 8 | **6** |
| Phrases | 6 | 8 | 8 | 6 | **4** |
| Pronunciation | 6 | 6 | 6 | 4 | **4** |
| **Total** | 38 | 44 | 46 | 36 | **28** |

Paradoja: el salto B2→C1 es el **mas dificil** y tiene el **menos contenido**.

### Por que C1 necesita mas

1. C1 es donde la diferencia entre "saber ingles" y "dominar ingles" se nota
2. Los matices (register, hedging, humor, ironia) requieren mucha practica
3. El listening C1 (acentos fuertes, habla rapida, sin guion) necesita exposicion masiva
4. La pronunciacion C1 (eliminar acento, fluidez natural) es un proceso largo

## Propuesta: Ampliar C1

### C1 Listening: de 8 → 12 unidades

Añadir:
| # | Titulo | Tipo |
|---|--------|------|
| 09 | Debates entre nativos | immersion |
| 10 | Peliculas con argot regional | immersion |
| 11 | Llamadas telefonicas reales | immersion |
| 12 | Presentaciones tecnicas rapidas | immersion |

### C1 Vocabulary: de 6 → 10 unidades

Añadir:
| # | Titulo | Tipo |
|---|--------|------|
| 07 | Vocabulario figurativo (metaforas, analogias) | vocabulary |
| 08 | Vocabulario de opinion matizada | vocabulary |
| 09 | Registro academico vs coloquial | vocabulary |
| 10 | Neologismos y slang actual | vocabulary |

### C1 Grammar: de 6 → 8 unidades

Añadir:
| # | Titulo | Tipo |
|---|--------|------|
| 07 | Emphasis structures (do/does + verb, it-clefts avanzados) | production |
| 08 | Coherencia textual (referencing, substitution, theme/rheme) | production |

### C1 Phrases: de 4 → 6 unidades

Añadir:
| # | Titulo | Tipo |
|---|--------|------|
| 05 | Humor sutil en contexto profesional | phrases |
| 06 | Diplomacia y confrontacion indirecta | phrases |

### C1 Pronunciation: de 4 → 6 unidades (+1 de fase 1)

Añadir (ademas de unit-05 de fase 1):
| # | Titulo | Tipo |
|---|--------|------|
| 06 | Auto-correccion en tiempo real | production |
| 07 | Presentaciones publicas: proyeccion y ritmo | production |

### Resultado

| Modulo | Antes | Despues | Delta |
|--------|-------|---------|-------|
| Listening | 8 | 12 | +4 |
| Vocabulary | 6 | 10 | +4 |
| Grammar | 6 | 8 | +2 |
| Phrases | 4 | 6 | +2 |
| Pronunciation | 4 | 7 | +3 (incl. fase 1) |
| **Total C1** | **28** | **43** | **+15** |

## Acciones Fase 5

### 5.1 Crear 14 ficheros .md de C1 (+1 ya contado en fase 1)
### 5.2 Actualizar modules.js con las nuevas unidades C1
### 5.3 Actualizar estimateSessions() en level-test.js
- Mas unidades C1 = mas sesiones estimadas para llegar a C1
- Ajustar calculo: ~15-18 sesiones por nivel para listening (antes 12-15)
