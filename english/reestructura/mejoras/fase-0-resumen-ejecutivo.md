# Plan de Mejoras — Resumen Ejecutivo

## Diagnostico

El sistema modular funciona pero tiene 6 problemas criticos:

| # | Problema | Impacto |
|---|---------|---------|
| 1 | Fonetica incompleta: faltan 8 fonemas + temas clave para hispanohablantes | El alumno no aprende sonidos que necesita |
| 2 | Pronunciacion con peso minimo (10%, 1 de cada 4 sesiones) | Skill critico casi ignorado |
| 3 | Test de nivel insuficiente: listening 5 preguntas, pronunciacion 0 | Clasificacion incorrecta |
| 4 | Sin repaso espaciado: lo completado se olvida | Retencion baja, progreso ilusorio |
| 5 | C1 con menos contenido que A1 | Salto mas dificil con menos material |
| 6 | Modulos aislados, sin conexion tematica | Aprendizaje fragmentado |

## Fases de mejora

| Fase | Descripcion | Ficheros nuevos | Ficheros modificados |
|------|-------------|-----------------|---------------------|
| **1** | Fonetica completa: 13 unidades nuevas, cubrir 44 fonemas | 13 .md | modules.js |
| **2** | Subir peso pronunciacion a 20%, fija en cada sesion | 0 | modules.js, session.js, views.js |
| **3** | Test de nivel: +5 listening, +5 grammar, +8 pronunciation | 0 | level-test.js, app.js, styles.css |
| **4** | Repaso espaciado integrado en warmup | 0 | state.js, session.js, gamification.js |
| **5** | Ampliar C1: +15 unidades | 14 .md | modules.js, level-test.js |
| **6** | Sesiones integradoras cross-module | 21 .md, 1 .js | session.js, views.js |

## Orden de ejecucion recomendado

```
Fase 1 (Fonetica) ─┐
                    ├─→ Fase 2 (Peso) ─→ Fase 3 (Test) ─→ Fase 4 (Repaso)
                    │
Fase 5 (C1) ───────┘
                                                            ↓
                                                     Fase 6 (Integracion)
```

- **Fases 1 y 5** son independientes (contenido .md) → se pueden hacer en paralelo
- **Fase 2** depende de Fase 1 (necesita las nuevas unidades registradas)
- **Fase 3** depende de Fase 2 (el test debe evaluar pronunciacion con su nuevo peso)
- **Fase 4** es independiente pero mejor despues de Fase 3 (repasa con niveles correctos)
- **Fase 6** es la ultima: necesita todo lo anterior estable

## Numeros finales

| Metrica | Antes | Despues |
|---------|-------|---------|
| Unidades pronunciacion | 26 | 39 (+13) |
| Unidades C1 | 28 | 43 (+15) |
| Total unidades | 192 | 234 (+42) |
| Fonemas cubiertos | 85% (38/44) | 100% (44/44) |
| Peso pronunciacion | 10% | 20% |
| Presencia pronunciacion por sesion | 25% (1/4) | 100% (siempre) |
| Preguntas test listening | 5 | 10 |
| Test de pronunciacion | NO | SI (8 preguntas) |
| Repaso espaciado | NO | SI (warmup adaptativo) |
| Sesiones integradoras | NO | SI (21 temas, cada ~5 sesiones) |
| Sesiones estimadas A1→C1 | ~96 | ~110-120 |
