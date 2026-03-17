# Skill: Practica de Listening

Define como funciona el skill `/practice listening` para ejercicios interactivos de comprension auditiva y decodificacion del ingles hablado real.

## Como funciona

Cuando el usuario escribe `/practice listening`, el asistente inicia un ejercicio interactivo de decodificacion auditiva. El objetivo es entrenar al usuario para reconocer y producir las formas reducidas, contracciones y fenomenos de connected speech que usan los hablantes nativos de ingles.

---

## Modos de practica

### Modo 1: Decodificacion IPA

El asistente muestra una frase en IPA (como suena en habla real/conectada) y el usuario debe escribir la frase en ingles.

Ejemplo de interaccion:

```
Asistente: Descifra esta frase:
/wɒ.djə ˈwɒ.nə duː tə.naɪt/

Usuario: What do you want to do tonight?

Asistente: Correcto!
- Escrito: "What do you want to do tonight?"
- Real: /wɒ.djə ˈwɒ.nə duː tə.naɪt/
- Fenomenos:
  - "What do you" -> /wɒ.djə/ (reduccion de "do you" a "d'you")
  - "want to" -> /ˈwɒ.nə/ (reduccion a "wanna")
  - "tonight" -> /tə.naɪt/ (reduccion de "to" a /tə/)
```

### Modo 2: Forma reducida a forma completa

El asistente dice una forma reducida y el usuario debe dar la forma completa.

Ejemplo:

```
Asistente: Que significa esta forma reducida?
"I shoulda coulda woulda"

Usuario: I should have, could have, would have

Asistente: Correcto! Esta expresion se usa para hablar de arrepentimientos
- cosas que debiste/pudiste/habrias hecho.
```

### Modo 3: Frase completa a IPA real

El asistente da una frase escrita y el usuario debe decir como sonaria en habla real/rapida.

Ejemplo:

```
Asistente: Como suena esto en habla rapida?
"I'm going to have to tell them about it"

Usuario: /aɪm ˈɡʌ.nə ˈhæf.tə ˈtel.əm.ə.baʊ.tɪt/

Asistente: Excelente! Fenomenos:
- going to -> gonna
- have to -> hafta
- them -> 'em
- about it -> linking entre "about" e "it"
```

### Modo 4: Dialogo simulado

El asistente simula una conversacion usando formas reducidas y habla natural, y el usuario debe "transcribir" lo que diria un nativo.

Ejemplo:

```
Asistente: Transcribe este mini-dialogo como lo diria un nativo:

A: "Are you going to come to the party?"
B: "I do not know. I have got to finish my homework. I will let you know."

Usuario:
A: "You gonna come to the party?"
B: "I dunno. I gotta finish my homework. I'll letcha know."

Asistente: Muy bien! Fenomenos identificados:
- Are you going to -> You gonna (eliminacion de "are" + reduccion)
- do not know -> dunno
- have got to -> gotta
- I will -> I'll
- let you know -> letcha know (palatalizacion de "t + you")
```

---

## Niveles

### Beginner (Principiante)

- Frases cortas (3-5 palabras)
- 1-2 fenomenos por frase
- Formas reducidas basicas (gonna, wanna, gotta)
- Ritmo lento
- Se proporciona contexto adicional

### Intermediate (Intermedio)

- Frases medias (5-8 palabras)
- 2-3 fenomenos por frase
- Todas las formas reducidas comunes
- Weak forms (formas debiles de palabras funcionales)
- Linking y elision basicos

### Advanced (Avanzado)

- Frases largas (8+ palabras)
- Multiples fenomenos encadenados
- Connected speech completo (linking, elision, asimilacion, palatalizacion)
- Acentos y dialectos (americano, britanico, australiano)
- Expresiones idiomaticas reducidas

---

## Parametros del skill

| Comando | Descripcion |
|---------|-------------|
| `/practice listening` | Modo aleatorio, nivel intermedio (por defecto) |
| `/practice listening beginner` | Nivel principiante |
| `/practice listening advanced` | Nivel avanzado |
| `/practice listening decode` | Solo modo decodificacion IPA (Modo 1) |
| `/practice listening reduce` | Solo modo forma reducida a completa (Modo 2) |
| `/practice listening produce` | Solo modo frase completa a IPA real (Modo 3) |
| `/practice listening dialogue` | Solo modo dialogo simulado (Modo 4) |

Se pueden combinar parametros:
- `/practice listening beginner decode` - Decodificacion IPA nivel principiante
- `/practice listening advanced dialogue` - Dialogo simulado nivel avanzado

---

## Banco de ejercicios

### Beginner (20 ejercicios)

Formato: IPA real | Respuesta | Fenomenos

| # | IPA real | Respuesta | Fenomenos |
|---|----------|-----------|-----------|
| 1 | /aɪ ˈwɒ.nə ɡoʊ/ | I want to go | wanna (reduccion de "want to") |
| 2 | /ˈwɒts.ʌp/ | What's up? | contraccion de "what is" |
| 3 | /aɪ ˈɡɒ.tə ˈɡoʊ/ | I got to go / I've got to go | gotta (reduccion de "got to") |
| 4 | /ˈɡɪ.miː ðæt/ | Give me that | gimme (reduccion de "give me") |
| 5 | /djə ˈnoʊ/ | Do you know? | d'you (reduccion de "do you") |
| 6 | /ˈlem.iː ˈsiː/ | Let me see | lemme (reduccion de "let me") |
| 7 | /aɪm ˈɡʌ.nə ˈiːt/ | I'm going to eat | gonna (reduccion de "going to") |
| 8 | /ˈkæ.naɪ ˈhɛlp/ | Can I help? | enlace "can" + "I" |
| 9 | /ˈwɛr.djə ˈɡoʊ/ | Where did you go? | d'you (reduccion de "did you") |
| 10 | /ˈdʌ.nəʊ/ | I don't know | dunno (reduccion completa) |
| 11 | /aɪ ˈwɒ.nə ˈɡe.dɪt/ | I want to get it | wanna + linking "get it" |
| 12 | /ˈhæf.tə ˈɡoʊ/ | Have to go | hafta (reduccion de "have to") |
| 13 | /ˈkʌ.mɒn/ | Come on | reduccion y fusion de dos palabras |
| 14 | /aɪl ˈbiː ˈðɛr/ | I'll be there | contraccion de "I will" |
| 15 | /ˈɡɪ.mɪ.ə ˈbreɪk/ | Give me a break | gimme + enlace con "a" |
| 16 | /ˈwɒ.djə ˈseɪ/ | What did you say? | reduccion de "what did you" |
| 17 | /ˈkænt ˈduː.ɪt/ | Can't do it | contraccion + linking |
| 18 | /ˈɡɒ.tə ˈɡoʊ ˈnaʊ/ | Got to go now | gotta |
| 19 | /ˈteɪ.kɪ.ˈtiː.zi/ | Take it easy | linking "take it" + reduccion "easy" |
| 20 | /ˈwɒ.nə ˈkʌm ˈwɪð.əs/ | Want to come with us? | wanna + reduccion de "us" |

### Intermediate (20 ejercicios)

| # | IPA real | Respuesta | Fenomenos |
|---|----------|-----------|-----------|
| 1 | /aɪ ˈʃʊd.ə ˈtoʊld.jə/ | I should have told you | shoulda (reduccion de "should have") + ya (reduccion de "you") |
| 2 | /ˈwɒ.tʃə ˈduː.ɪŋ tə.ˈmɒ.roʊ/ | What are you doing tomorrow? | whatcha (reduccion de "what are you") |
| 3 | /ɪts ˈkaɪn.də ˈhɑːrd tə ˈseɪ/ | It's kind of hard to say | kinda (reduccion de "kind of") |
| 4 | /aɪ ˈkʊd.ə ˈdʌn ˈbɛ.tər/ | I could have done better | coulda (reduccion de "could have") |
| 5 | /ˈwʊd.ʒə ˈmaɪnd ˈhɛl.pɪŋ/ | Would you mind helping? | wouldja (palatalizacion de "would you") |
| 6 | /ˈdɪd.ʒə ˈɡɛ.tɪt ˈdʌn/ | Did you get it done? | didja + linking "get it" |
| 7 | /ˈjuː ˈmʌs.tə ˈbiːn ˈtaɪəd/ | You must have been tired | musta (reduccion de "must have") |
| 8 | /aɪ ˈwɒ.nə ˈɡɛ.ɾaʊ.ɾəv ˈhɪr/ | I want to get out of here | wanna + flap t + outta (reduccion de "out of") |
| 9 | /ˈhaʊ.djə ˈnoʊ ˈðæt/ | How did you know that? | howdja (reduccion de "how did you") |
| 10 | /ˈlɛts ˈɡɛ.ɾaʊ.ɾə ˈhɪr/ | Let's get out of here | flap t + outta |
| 11 | /ˈdoʊn.tʃə ˈθɪŋk ˈsoʊ/ | Don't you think so? | dontcha (palatalizacion de "don't you") |
| 12 | /aɪm ˈsɔːr.ɾə ˈhɪr ˈðæt/ | I'm sorry to hear that | flap t en "sorry" + reduccion de "to" |
| 13 | /ˈwɛr.djə ˈpʊ.ɾɪt/ | Where did you put it? | d'you + flap t + linking |
| 14 | /ˈkæn.tʃə ˈsiː ðæt/ | Can't you see that? | cantcha (palatalizacion) |
| 15 | /ˈsʌm.θɪŋ ˈlaɪ.kət/ | Something like that | linking "like" + "that", reduccion de "that" |
| 16 | /aɪ ˈjuːs.tə ˈlɪv ˈðɛr/ | I used to live there | usta (reduccion de "used to") |
| 17 | /ˈwɒ.djə ˈθɪŋ.kə.ˈbaʊ.ɾɪt/ | What do you think about it? | d'you + linking "about it" + flap t |
| 18 | /ˈɡɒ.ɾə ˈlɒ.ɾə ˈwɜːk/ | Got a lot of work | flap t en "got a" y "lot of" + reduccion de "of" |
| 19 | /aɪ ˈmɪ.tə ˈwel ˈɡoʊ/ | I might as well go | "might as well" reducido, enlace |
| 20 | /ˈðɛr.ə ˈlɒ.ɾə ˈpiː.pəl/ | There are a lot of people | reduccion de "there are" + flap t + reduccion de "of" |

### Advanced (10 ejercicios)

| # | IPA real | Respuesta | Fenomenos |
|---|----------|-----------|-----------|
| 1 | /aɪm ˈɡʌ.nə ˈhæf.tə ˈtel.əm.ə.baʊ.tɪt/ | I'm going to have to tell them about it | gonna + hafta + 'em + linking "about it" |
| 2 | /ˈwʊd.ʒə ˈmaɪnd ɪf.aɪ ˈɡɒ.ɾə ˈsɪ.ɾɪŋ ˈdaʊn fər.ə ˈmɪ.nɪt/ | Would you mind if I got a sitting down for a minute? | wouldja + flap t + reduccion de "a" y "for a" |
| 3 | /aɪ ˈʃʊd.ə ˈkʊd.ə ˈwʊd.ə ˈdʌ.nɪt ˈbʌ.ɾaɪ ˈdɪ.dənt/ | I should have, could have, would have done it but I didn't | shoulda coulda woulda + linking + flap t |
| 4 | /ˈwɒ.djə ˈwɒ.nə ˈduː.ə.ˈbaʊ.ɾɪt ɪf.ɪt ˈhæ.pənz.ə.ˈɡɛn/ | What do you want to do about it if it happens again? | d'you + wanna + multiples enlaces + reduccion |
| 5 | /ˈdɪd.ʒə ˈɛ.vər ˈfaɪn.daʊ.ɾɪf ˈðeɪ.wər ˈɡʌ.nə ˈleɪ.ɾɒf ˈɛ.ni.bɒ.di/ | Did you ever find out if they were going to lay off anybody? | didja + linking "find out if" + gonna + "lay off" |
| 6 | /aɪ ˈwʊ.dənt.əv ˈθɔː.ɾɪt ˈwɒz ˈɡʌ.nə ˈbiː ˈðæt ˈbɪɡ.ə.vəˈdiːl/ | I wouldn't have thought it was going to be that big of a deal | wouldn'tve + flap t + gonna + reduccion multiple |
| 7 | /ˈjuː ˈnoʊ ˈwɒ.ɾaɪ ˈmiːn ˈðoʊ ˈraɪt/ | You know what I mean though, right? | "what I" enlazado + reduccion de "though" |
| 8 | /ˈɪ.zɪ.ˈɡʌ.nə ˈbiː.ðɛr.ər ˈnɒt kəz.aɪ ˈniː.dəˈnoʊ/ | Is he going to be there or not, because I need to know | reduccion de "is he" + gonna + "'cause" + "need to" |
| 9 | /ˈwɛr.djə ˈɡɛ.ðə ˈnaɪ.diː.ə ðə.ɾɪt ˈwʊd.ə ˈwɜːkt/ | Where did you get the idea that it would have worked? | d'you + linking multiple + woulda |
| 10 | /ˈaɪ.əv ˈbiːn ˈtraɪ.ɪŋ.ɾə ˈɡɛ.ɾə ˈhoʊl.dəv.ɪm fər.ˈeɪ.dʒɪz ˈbʌ.ɾiː ˈwɒnt ˈpɪ.kʌp/ | I've been trying to get a hold of him for ages but he won't pick up | reduccion de "to" + flap t multiple + "of him" + "for ages" + "but he" |

---

## Retroalimentacion

Despues de cada respuesta del usuario, el asistente debe:

1. **Indicar si es correcto o incorrecto** - de forma clara y directa
2. **Mostrar la comparacion** - forma escrita vs. forma hablada real
3. **Explicar cada fenomeno** - nombre del fenomeno, por que ocurre, otros ejemplos similares
4. **Dar una frase adicional** - con el mismo fenomeno para reforzar el aprendizaje
5. **Ofrecer continuar** - preguntar si quiere otro ejercicio o cambiar de modo/nivel

## Criterios de evaluacion

- **Correcto**: La frase coincide exactamente o es una variante valida
- **Parcialmente correcto**: El usuario identifica la mayoria de las palabras pero falla en 1-2
- **Incorrecto**: El usuario no logra identificar la frase

En caso de respuesta parcial, el asistente debe:
- Marcar las partes correctas
- Senalar las partes que faltan
- Dar pistas foneticas para las partes incorrectas
- Permitir un segundo intento antes de revelar la respuesta

## Notas para el asistente

- Usar IPA estandar con notacion clara
- Priorizar el acento General American (GA) salvo que el usuario pida otro
- Adaptar la dificultad segun el rendimiento del usuario
- Mantener un tono alentador y educativo
- Si el usuario se frustra, bajar el nivel automaticamente
- Explicar los fenomenos foneticos con lenguaje accesible, evitando jerga linguistica excesiva
- Cada sesion deberia tener entre 5-10 ejercicios, salvo que el usuario pida mas
