# Session 01 — Conferencia Tecnica

## Objetivo

Integrar tres habilidades en el contexto de una charla tecnica rapida:
- **Listening**: Comprender una presentacion tecnica con jerga y velocidad alta
- **Pronunciacion**: Acento en vocabulario tecnico, acronimos, nominalizaciones
- **Vocabulary**: Registro tecnico/academico, nominalizaciones, jerga especializada

Al final podras seguir conferencias tecnicas en ingles y participar en discusiones especializadas.

## Calentamiento

Piensa antes de empezar:
- ¿Has visto alguna charla TED o conferencia tecnica en ingles? ¿A que velocidad hablaban?
- ¿Sabes pronunciar "API", "GDPR", "SaaS"? ¿Y "paradigm", "scalability", "implementation"?
- ¿Cual es la diferencia entre entender ingles general y entender ingles tecnico?

## Listening

### Transcripcion del audio

Escucha con TTS sin leer. Es una charla rapida estilo conferencia tecnica. No intentes entender cada palabra — capta las ideas principales.

> "Good afternoon. I'm going to talk today about the paradigm shift we're seeing in microservices architecture, and specifically how event-driven design is fundamentally changing the way we think about system scalability.
>
> Now, traditional monolithic applications — and I'm sure many of you have dealt with these — they work fine until they don't. Scaling a monolith means scaling everything, even the parts that don't need it. It's the equivalent of buying a bigger house just because you need an extra room.
>
> Event-driven architecture, or EDA, takes a completely different approach. Instead of direct communication between services, each component publishes events to a message broker — think Kafka or RabbitMQ — and other services subscribe to the events they care about. This decoupling is what gives us true horizontal scalability.
>
> But here's the thing that nobody talks about at conferences — the operational complexity is significant. Distributed tracing, eventual consistency, idempotency — these aren't just buzzwords, they're real engineering challenges that your team needs to be prepared for.
>
> We implemented this at my company eighteen months ago. The initial migration took about six months — significantly longer than we'd estimated. But the results speak for themselves. Our deployment frequency went from once a week to multiple times per day. Our mean time to recovery dropped from four hours to under fifteen minutes. And our infrastructure costs actually decreased by thirty percent because we could scale individual services rather than the entire application.
>
> The key takeaway? EDA isn't a silver bullet. It's a trade-off. You're trading simplicity for scalability, and that trade-off only makes sense if your system genuinely needs to scale. Don't adopt microservices because it's trendy — adopt them because the business requirements demand it.
>
> I'll take questions now."

### Preguntas de comprension

1. What is the main topic of the talk?
2. What analogy does the speaker use for scaling monoliths?
3. How does event-driven architecture work?
4. What challenges does the speaker mention?
5. What were the three concrete results after implementation?
6. What is the key takeaway?

<details>
<summary>Respuestas</summary>

1. How event-driven design is changing system scalability in microservices
2. Buying a bigger house just because you need an extra room
3. Components publish events to a message broker; other services subscribe to relevant events — decoupled
4. Operational complexity: distributed tracing, eventual consistency, idempotency
5. Deployment frequency: weekly to multiple times daily; MTTR: 4 hours to under 15 min; infra costs down 30%
6. EDA isn't a silver bullet — it's a trade-off (simplicity for scalability); only adopt it if the business requires it

</details>

## Pronunciacion

### Acento en vocabulario tecnico

Las palabras tecnicas largas tienen patrones de acento especificos que DEBES dominar:

| Palabra | Acento | IPA | Error comun |
|---------|--------|-----|-------------|
| archi**TEC**ture | 2a silaba | /ˈɑːr.kɪ.tek.tʃər/ | "ARCHItecture" |
| scala**BI**lity | 3a silaba | /ˌskeɪ.ləˈbɪl.ə.ti/ | Acento plano |
| imple**MEN**tation | 3a silaba | /ˌɪm.plə.menˈteɪ.ʃən/ | "IMPLEmentation" |
| **PA**radigm | 1a silaba | /ˈpær.ə.daɪm/ | "paraDIGM" — la g es MUDA |
| i**DEM**potency | 2a silaba | /ˌaɪ.dɛmˈpoʊ.tən.si/ | Pronunciacion vaga |
| **MO**nolithic | 1a y 3a | /ˌmɒn.əˈlɪθ.ɪk/ | Acento plano |
| com**PLE**xity | 2a silaba | /kəmˈplek.sə.ti/ | "COMplexity" |
| de**PLOY**ment | 2a silaba | /dɪˈplɔɪ.mənt/ | "DEployment" |
| in**FRA**structure | 2a silaba | /ˈɪn.frə.strʌk.tʃər/ | "infraSTRUCture" |

**Practica**: "The **PA**radigm shift in micro**SER**vices archi**TEC**ture improves scala**BI**lity."

### Acronimos — Como pronunciarlos

| Acronimo | Se dice | NO se dice |
|----------|---------|-----------|
| API | "ay-pee-eye" /ˌeɪ.piːˈaɪ/ | "api" como palabra |
| EDA | "ee-dee-ay" /ˌiː.diːˈeɪ/ | Letra por letra |
| SaaS | "sass" /sæs/ | "ess-ay-ay-ess" |
| MTTR | "em-tee-tee-are" | Letra por letra |
| GDPR | "jee-dee-pee-are" | Letra por letra |
| SQL | "ess-queue-ell" o "sequel" | Ambos aceptados |
| AWS | "ay-double-you-ess" | Letra por letra |
| REST | "rest" /rest/ | Como palabra |

**Regla**: Si se puede pronunciar como palabra (SaaS, REST), se hace. Si no, se deletrea.

### Nominalizaciones — El registro academico

En charlas tecnicas, los verbos se convierten en sustantivos (nominalizacion). Esto hace el discurso mas formal y denso:

| Verbo (informal) | Nominalizacion (formal) | Ejemplo |
|------------------|----------------------|---------|
| to implement | implementation | "The **implementation** took six months" |
| to deploy | deployment | "**Deployment** frequency increased" |
| to scale | scalability | "True horizontal **scalability**" |
| to decouple | decoupling | "This **decoupling** gives us flexibility" |
| to migrate | migration | "The initial **migration** was complex" |
| to communicate | communication | "Direct **communication** between services" |

## Vocabulary — Registro Tecnico

### Jerga de la charla

| English | Spanish | Contexto |
|---------|---------|----------|
| paradigm shift | cambio de paradigma | Cambio fundamental de enfoque |
| monolithic application | aplicacion monolitica | Toda la app en un bloque |
| event-driven | orientado a eventos | Arquitectura basada en eventos |
| message broker | broker de mensajes | Intermediario (Kafka, RabbitMQ) |
| horizontal scalability | escalabilidad horizontal | Añadir mas maquinas |
| distributed tracing | rastreo distribuido | Seguir peticiones entre servicios |
| eventual consistency | consistencia eventual | Los datos se sincronizan con retraso |
| silver bullet | solucion magica | Algo que resuelve todo (no existe) |
| trade-off | compromiso / contrapartida | Ganar algo a cambio de perder otro |
| buzzword | palabra de moda | Termino sobreusado sin profundidad |

### Expresiones academicas/tecnicas

| English | Spanish | Uso |
|---------|---------|-----|
| The results speak for themselves | Los resultados hablan por si solos | Datos convincentes |
| Significantly longer than estimated | Considerablemente mas largo de lo estimado | Retraso |
| The key takeaway | La conclusion clave | Resumir punto principal |
| This isn't a silver bullet | Esto no es una solucion magica | Temperar expectativas |
| The operational complexity is significant | La complejidad operativa es considerable | Advertir |
| Don't adopt X because it's trendy | No adoptes X porque esta de moda | Consejo pragmatico |
| The business requirements demand it | Los requisitos de negocio lo exigen | Justificacion |

## Practica integradora

### Ejercicio 1: Dictado tecnico

Escucha con TTS y escribe:

1. "Event-driven **architecture** fundamentally changes how we think about **scalability**."
2. "Distributed **tracing**, eventual **consistency**, **idempotency** — these aren't just **buzzwords**."
3. "Our **deployment** frequency went from once a week to multiple times per day."
4. "Don't adopt **microservices** because it's **trendy** — adopt them because the business requires it."

### Ejercicio 2: Explica un concepto tecnico

Elige un concepto tecnico que conozcas bien y explica en 60 segundos:
- Que es
- Por que importa
- Un ejemplo o analogia
- Una limitacion o trade-off

Usa vocabulario tecnico con la pronunciacion correcta. Grabate.

### Ejercicio 3: Resume la charla en 3 frases

Escribe un resumen ejecutivo de la charla usando nominalizaciones:

Modelo: "The presentation covered the **implementation** of event-driven **architecture** as a solution for **scalability** challenges. While the **migration** involved significant **complexity**, the results showed improved **deployment** frequency and reduced **infrastructure** costs. The key **takeaway** is that EDA represents a **trade-off** between simplicity and **scalability**."

### Ejercicio 4: Pregunta al ponente

Formula 3 preguntas que harias al final de esta charla. Usa registro formal:

1. "You mentioned... Could you elaborate on...?"
2. "How does... compare to...?"
3. "What would you recommend for a team that...?"

<details>
<summary>Ejemplo de respuestas</summary>

1. "You mentioned the migration took six months. Could you elaborate on the biggest bottlenecks?"
2. "How does event-driven architecture compare to a more traditional service mesh approach?"
3. "What would you recommend for a team that's still running a monolith but seeing scalability issues?"

</details>

## Auto-evaluacion

| Habilidad | 1 | 2 | 3 | 4 |
|-----------|---|---|---|---|
| Entiendo charlas tecnicas rapidas | | | | |
| Pronuncio vocabulario tecnico correctamente | | | | |
| Se pronunciar acronimos | | | | |
| Uso nominalizaciones al hablar | | | | |
| Puedo formular preguntas tecnicas | | | | |

**Meta**: Al menos 3 en todas antes de continuar.

**Proxima sesion**: Session 02 — Debate formal con matices
