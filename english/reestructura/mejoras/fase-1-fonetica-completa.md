# Fase 1: Fonetica Completa — Auditoría y Ampliacion

## Diagnostico

Cobertura actual: **85% de los 44 fonemas del ingles** (26 unidades en 5 niveles).

### Fonemas que FALTAN

#### Consonantes no enseñadas (4/24)

| Fonema | Ejemplo | Problema para hispanohablantes |
|--------|---------|-------------------------------|
| /p/ aspirada | **p**en, **p**aper | En ingles /p/ inicial se aspira (sale aire). En español no. "paper" suena como "phaper" |
| /k/ aspirada | **c**at, **k**ing | Mismo problema de aspiracion que /p/ |
| /g/ variantes | **g**oat, bi**g** | Variacion alofonico: /g/ vs /ɣ/ no existe en ingles |
| /f/ | **f**ish, lea**f** | Menos problematico pero no se enseña explicitamente |

#### Diptongos no enseñados (3/8)

| Fonema | Ejemplo | Notas |
|--------|---------|-------|
| /ɪə/ | h**ear**, b**eer**, d**ear** | No existe en español. Critico para comprension |
| /eə/ | **air**, c**are**, wh**ere** | Confusión con /e/ simple |
| /ʊə/ | t**our**, p**ure**, s**ure** | Raro pero necesario para completar el sistema |

#### Vocal no enseñada como independiente

| Fonema | Ejemplo | Notas |
|--------|---------|-------|
| /e/ corta | b**e**d, r**e**d, s**ai**d | Solo aparece dentro de /eɪ/. Nunca como monoptongo independiente |

### Fenomenos criticos para hispanohablantes NO cubiertos

| Tema | Descripcion | Nivel donde deberia estar |
|------|-------------|--------------------------|
| **/dʒ/ vs /j/** | "judge" vs "yes" — español solo tiene /j/ | A1-A2 |
| **Terminaciones -ed** | /t/ (walked), /d/ (played), /ɪd/ (wanted) | A1 |
| **Letras mudas** | hour, honest, knight, psychology, castle | A1-A2 |
| **/s/ vs /z/** | "bus" vs "buzz", "price" vs "prize" | A2 |
| **Clusters consonanticos finales** | asked /ɑːskt/, texts /teksts/, strengths | A2-B1 |
| **/l/ clara vs oscura** | **l**ight vs mi**lk** — solo en listening, no en pronunciacion | A2 |

### Solapamiento Listening ↔ Pronunciacion

| Tema | En Listening | En Pronunciacion | Accion |
|------|-------------|-------------------|--------|
| Schwa /ə/ | A1-01 | B1-05 | Unificar referencia |
| Linking basico | A1-06 | B1-03 | OK (progresion natural) |
| Elision | A2-03 | NO EXISTE | Crear en pronunciacion |
| Asimilacion | A2-04 | NO EXISTE | Crear en pronunciacion |
| Minimal pairs | A2-10 | NO EXISTE | Crear en pronunciacion |

## Acciones Fase 1

### 1.1 Nuevas unidades de pronunciacion a crear

**A1 — Añadir 4 unidades:**

| Nueva unidad | Contenido |
|-------------|-----------|
| unit-07-ed-endings.md | Terminaciones -ed: /t/, /d/, /ɪd/ con reglas y practica |
| unit-08-silent-letters.md | Letras mudas: hour, knife, psychology, castle, island, Wednesday |
| unit-09-dj-vs-j.md | /dʒ/ vs /j/: judge vs yes, jam vs yam, jeans vs years |
| unit-10-s-vs-z.md | /s/ vs /z/: bus/buzz, ice/eyes, price/prize, his/hiss |

**A2 — Añadir 4 unidades:**

| Nueva unidad | Contenido |
|-------------|-----------|
| unit-07-l-sounds.md | /l/ clara vs oscura: light vs milk, love vs help, lateral release |
| unit-08-missing-diphthongs.md | /ɪə/, /eə/, /ʊə/: hear, care, tour + pares minimos |
| unit-09-consonant-clusters.md | Clusters finales: asks, texts, strengths, months, sixths |
| unit-10-minimal-pairs.md | 30 pares minimos: todas las vocales + consonantes problematicas |

**B1 — Añadir 2 unidades:**

| Nueva unidad | Contenido |
|-------------|-----------|
| unit-07-elision-production.md | Producir elision natural: comfortable, different, chocolate |
| unit-08-assimilation-production.md | Producir asimilacion: ten bikes → /tem baɪks/, don't you → /dəʊntʃuː/ |

**B2 — Añadir 2 unidades:**

| Nueva unidad | Contenido |
|-------------|-----------|
| unit-05-aspiration-voicing.md | Aspiracion /p^h, t^h, k^h/ + voiced/voiceless contrasts avanzados |
| unit-06-review-b2-extended.md | Review ampliado con todos los fonemas |

**C1 — Añadir 1 unidad:**

| Nueva unidad | Contenido |
|-------------|-----------|
| unit-05-complete-phoneme-mastery.md | Test de los 44 fonemas: produccion + reconocimiento |

**Total nuevas unidades: 13** (de 26 → 39 unidades de pronunciacion)

### 1.2 Actualizar modules.js

Registrar las 13 nuevas unidades en el objeto MODULES.pronunciation con sus IDs, titulos y tipos.

### 1.3 Crear los 13 ficheros .md

Contenido completo con:
- Objetivo del fonema
- Tabla IPA con ejemplos
- Pares minimos (min 10 por unidad)
- Ejercicios de produccion
- Errores tipicos hispanohablantes
- Audio cues (descripcion para TTS)
