# Fase 2: Aumentar Peso de Fonetica en el Sistema

## Problema actual

Pronunciacion tiene peso **0.10** (10%) — el mas bajo de los 5 modulos.
Solo aparece 1 de cada 4 sesiones en rotacion secundaria.

Un alumno que hace 3 sesiones/semana ve pronunciacion **menos de 1 vez por semana**.

### Pesos actuales

| Modulo | Peso | Presencia por sesion |
|--------|------|---------------------|
| Listening | 0.40 | Siempre (40% del tiempo) |
| Vocabulary | 0.20 | 1 de cada 4 sesiones |
| Grammar | 0.15 | 1 de cada 4 sesiones |
| Phrases | 0.15 | 1 de cada 4 sesiones |
| Pronunciation | 0.10 | 1 de cada 4 sesiones |

## Propuesta: Pronunciacion como skill principal junto a Listening

### Argumento

1. **Sin fonetica no hay listening.** Si no puedes producir /θ/, no puedes reconocerlo al oirlo
2. **Sin fonetica no hay speaking.** Saber gramatica y vocabulario es inutil si no te entienden
3. **Fonetica y listening son dos caras del mismo skill.** Percepcion y produccion del sonido
4. **Para hispanohablantes es LA barrera.** Saben leer ingles, no lo entienden al oirlo porque los sonidos no estan en su cerebro

### Nuevos pesos propuestos

| Modulo | Peso anterior | Peso nuevo | Cambio |
|--------|--------------|------------|--------|
| Listening | 0.40 | 0.35 | -0.05 |
| Pronunciation | 0.10 | **0.20** | +0.10 |
| Vocabulary | 0.20 | 0.15 | -0.05 |
| Grammar | 0.15 | 0.15 | = |
| Phrases | 0.15 | 0.15 | = |

### Nuevo sistema de rotacion

Actualmente: `vocabulary → grammar → phrases → pronunciation` (1 de 4)

**Propuesta:** Pronunciacion sale de la rotacion secundaria y se convierte en **modulo fijo** igual que listening.

Estructura de cada sesion:
```
1. Warmup (2 min) — review rapido
2. Listening (7-8 min) — 35% del tiempo — SIEMPRE
3. Pronunciacion (4-5 min) — 20% del tiempo — SIEMPRE
4. Modulo secundario (4-5 min) — 15% del tiempo — ROTA: vocab → grammar → phrases
5. Practica integradora (2-3 min) — combina lo visto
```

### Ventajas

- Pronunciacion aparece en **TODAS las sesiones** (no 1 de cada 4)
- Se puede vincular listening + pronunciacion en la misma sesion (ej: escuchar /θ/ → producir /θ/)
- La rotacion secundaria se simplifica a 3 modulos: vocab, grammar, phrases
- 3 sesiones/semana = cada modulo secundario aparece 1 vez/semana (mas predecible)

## Acciones Fase 2

### 2.1 Actualizar modules.js
- Cambiar `weight` de pronunciation: 0.10 → 0.20
- Cambiar `weight` de listening: 0.40 → 0.35
- Cambiar `weight` de vocabulary: 0.20 → 0.15

### 2.2 Actualizar session.js
- Sacar pronunciation de `SECONDARY_ROTATION`
- `SECONDARY_ROTATION = ['vocabulary', 'grammar', 'phrases']` (3 en vez de 4)
- Añadir bloque fijo de pronunciacion despues de listening
- Vincular tematica listening ↔ pronunciacion cuando sea posible

### 2.3 Actualizar views.js
- Dashboard: pronunciacion aparece destacada junto a listening como "skills de audio"
- Mostrar la vinculacion listening + pronunciacion visualmente

### 2.4 Actualizar gamification.js
- XP por bloque de pronunciacion (actualmente no existe como bloque fijo)
- Achievements: "Domina /θ/ y /ð/", "Todos los diptongos", etc.
