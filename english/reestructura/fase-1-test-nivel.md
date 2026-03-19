# Fase 1 — Test de Nivel y Onboarding

## Objetivo

Que el alumno sepa SU nivel real en 5 minutos y empiece a estudiar en el punto correcto, no desde 0.

## El test de nivel (en la app)

### Formato: 3 mini-tests rapidos (5 min total)

#### Test 1: Vocabulario activo (2 min)
- 20 palabras en español, el alumno escribe la traduccion en ingles
- Mezcla de niveles: A1 (house, eat), A2 (comfortable, appointment), B1 (achieve, reliable), B2 (thoroughly, overwhelming)
- **Resultado**: Estimacion de vocabulario activo

#### Test 2: Gramatica por reconocimiento (2 min)
- 10 frases con hueco, elegir la opcion correcta
- Progresion: present simple → past simple → present perfect → conditionals → passive → reported speech
- **Resultado**: Nivel gramatical real (no lo que "crees" que sabes, lo que realmente produces)

#### Test 3: Listening rapido (1 min)
- 5 audios cortos (TTS de la app), responder que dijo
- Progresion: frase lenta y clara → frase con reduced forms → frase rapida
- **Resultado**: Nivel de comprension auditiva

### Resultados del test

El test clasifica al alumno en uno de estos perfiles:

| Perfil | Vocabulario | Gramatica | Listening | Descripcion |
|--------|-------------|-----------|-----------|-------------|
| **Reactivador** | A2+ | A2+ | A1-A2 | Sabe bastante leyendo, no entiende audio. El mas comun. |
| **Basico+** | A1-A2 | A1-A2 | A1 | Poco ingles real. Necesita bases pero no desde "the cat" |
| **Intermedio** | B1 | B1 | A2-B1 | Lee bien, entiende algo de audio, necesita activar y subir |
| **Avanzado pasivo** | B1-B2 | B1+ | A2 | Lee casi todo pero no entiende ni produce. El gap mas grande |

## Onboarding: primeros 3 minutos tras el test

Tras el test, mensaje personalizado:

> **Reactivador**: "Tu ingles escrito es A2-B1. Tienes mucho ingles dormido — no necesitas aprenderlo de nuevo, necesitas ACTIVARLO. Vamos a despertar tu vocabulario y entrenar tu oido. En 2 semanas notaras la diferencia."

> **Basico+**: "Tienes bases de ingles. Vamos a construir sobre ellas, no desde cero. Empezamos por las 200 palabras mas utiles y las frases que necesitas en el dia a dia."

> **Intermedio**: "Tu nivel es mejor de lo que crees. Lo que te falta es practica activa. Vamos a pasar del 'lo entiendo leyendo' al 'lo puedo usar'."

> **Avanzado pasivo**: "Lees ingles casi como un nativo pero tu oido no esta entrenado. Es un problema muy comun y tiene solucion rapida. En 4 semanas vas a notar un salto brutal."

## Que cambia segun el perfil

| Aspecto | Basico+ | Reactivador | Intermedio | Avanzado pasivo |
|---------|---------|-------------|------------|-----------------|
| Vocabulario diario | Top 100-500 | Top 500-1000 | Top 1000-2000 | Top 2000-3000 |
| Gramatica | Desde tenses basicos | Desde present perfect | Conditionals, passive | Reported speech, avanzado |
| Listening | Frases sueltas lentas | BBC/Lucy + reduced forms | Podcasts + series | Series + peliculas directo |
| Frases | Daily essentials | Travel + business | Idioms + phrasal verbs | Coloquial + slang |
| Serie recomendada | Peppa Pig → Friends | Friends → The Office | The Office → Ted Lasso | Ted Lasso → Breaking Bad |

## Arquitectura elegida: Sistema Modular

**Decision tomada**: Sistema modular. Los day-XXX actuales se reemplazan.

### Como funciona

- No hay "dias" lineales ni tracks fijos
- Hay **modulos tematicos** independientes, cada uno con niveles (A1 → C1)
- Cada modulo tiene su propia progresion interna
- El test de nivel posiciona al alumno en cada modulo POR SEPARADO
- La app genera la sesion diaria mezclando modulos segun el nivel de cada uno

### Por que modular

Un alumno puede tener B1 en gramatica escrita pero A1 en listening. No tiene sentido ponerle en un "nivel B1" global ni en un "nivel A1" global. Con el sistema modular:

- Su modulo de gramatica empieza en B1 (no repite past simple)
- Su modulo de listening empieza en A1 (necesita bases de oido)
- Su modulo de vocabulario empieza en A2 (reconoce leyendo, necesita activar)

**Resultado**: cada alumno tiene un camino unico. Uno puede llegar a C1 en 60 sesiones porque su writing ya era B1. Otro necesita 90 porque empieza mas bajo en listening.

### Modulos del sistema

| Modulo | Peso en sesion | Niveles | Descripcion |
|--------|---------------|---------|-------------|
| **Listening** | 40% (eje principal) | A1 → C1 | Reduced forms, connected speech, dictation, shadowing, comprension real |
| **Vocabulario** | 20% | A1 → C1 | Activacion de vocabulario pasivo → activo, palabras nuevas por frecuencia |
| **Gramatica** | 15% | A1 → C1 | Activacion (no enseñanza), produccion, estructuras en contexto |
| **Frases/Speaking** | 15% | A1 → C1 | Situaciones reales, expresiones, produccion oral |
| **Pronunciacion** | 10% | A1 → C1 | Sonidos, ritmo, entonacion, IPA practico |

**Listening es el 40%**: siempre presente, siempre el bloque mas largo. Los demas rotan.

### Ejemplo: sesion generada para 2 alumnos diferentes

**Alumno A** — Listening A1, Vocabulario A2, Gramatica B1:
| Bloque | Tiempo | Contenido |
|--------|--------|-----------|
| Warm-up | 3 min | Repaso 5 palabras vocabulario A2 de ayer |
| Listening | 8 min | Reduced forms basicas: gonna, wanna, gotta (A1) |
| Vocabulario | 5 min | 8 palabras A2-B1: achieve, reliable, purpose... |
| Practica | 4 min | Dictation: 2 frases lentas con reduced forms |

**Alumno B** — Listening A2, Vocabulario B1, Gramatica B1:
| Bloque | Tiempo | Contenido |
|--------|--------|-----------|
| Warm-up | 3 min | Repaso 3 frases de connected speech de ayer |
| Listening | 8 min | Connected speech: linking + elision (A2-B1) |
| Frases | 5 min | Opinar y argumentar: "I think... because..." |
| Practica | 4 min | Shadowing: fragmento de podcast 30 seg |

### Progresion independiente por modulo

Cada modulo sube de nivel cuando el alumno demuestra dominio:
- **Auto-evaluacion**: Ejercicios de la sesion (si acierta >80%, sube)
- **Tests periodicos**: Cada 10-12 sesiones, mini-test del modulo
- **No hay "repetir curso"**: Si falla, se refuerza ese modulo sin afectar los demas
