# Fase 6: Integracion Cross-Module

## Problema

Cada modulo funciona en aislamiento. Una sesion tipica:

```
Warmup → Listening (schwa) → Vocabulario (top 300 bloque 2) → Practica
```

El listening habla de la schwa, el vocabulario habla de comida. No hay conexion tematica. El cerebro no crea asociaciones entre lo que escucha y lo que aprende.

## Propuesta: Sesiones tematicas integradas

### Concepto

Cada 4-5 sesiones, 1 sesion integradora que combina listening + pronunciacion + vocabulario/gramatica/frases en torno a un **tema comun**.

### Ejemplo de sesion integradora: "En el aeropuerto"

```
1. Warmup (3 min): Repaso espaciado
2. Listening (8 min): Escucha anuncio de aeropuerto + dialogo check-in
3. Pronunciacion (4 min): /ɪ/ vs /iː/ en "departure" vs "the gate", stress en "international"
4. Frases (5 min): "Could I get a window seat?", "Where is gate B12?"
5. Practica (3 min): Role-play: estas en el aeropuerto, escucha y responde
```

### Temas integradores por nivel

**A1 (4 sesiones integradoras):**
1. Presentarte y entender presentaciones
2. En el restaurante (pedir comida)
3. De compras (precios, tallas)
4. Preguntar direcciones

**A2 (5 sesiones integradoras):**
1. En el aeropuerto
2. Llamada telefonica
3. Entrevista de trabajo basica
4. En el medico
5. Quedar con amigos (WhatsApp voice → en persona)

**B1 (5 sesiones integradoras):**
1. Reunión de trabajo (ingles profesional)
2. Ver una serie juntos (fragmento + analisis)
3. Debate: dar opiniones y rebatir
4. Contar una historia/anecdota
5. Podcast real: escuchar + resumir

**B2 (4 sesiones integradoras):**
1. Presentacion profesional
2. Negociar un acuerdo
3. Stand-up comedy: entender humor
4. Noticias en directo: comprender + opinar

**C1 (3 sesiones integradoras):**
1. Conferencia tecnica
2. Debate formal con matices
3. Entrevista nativa real (YouTube/podcast)

### Implementacion tecnica

**No requiere cambios en la estructura de modulos.** Las sesiones integradoras son un tipo especial de sesion que el generador selecciona periodicamente.

```javascript
// En session.js
function generateSession(mode) {
  const sessionNum = getProfile().sessionCount;

  // Cada 5 sesiones → sesion integradora
  if (sessionNum > 0 && sessionNum % 5 === 0) {
    return generateIntegratorSession(mode);
  }

  // Sesion normal
  return generateNormalSession(mode);
}
```

## Acciones Fase 6

### 6.1 Crear fichero integrator-sessions.js
- Definir INTEGRATOR_SESSIONS por nivel y tema
- Cada sesion integradora referencia unidades de 3+ modulos
- Contenido especifico para cada sesion (no generado)

### 6.2 Crear ~21 ficheros .md de sesiones integradoras
- 4 A1 + 5 A2 + 5 B1 + 4 B2 + 3 C1 = 21 ficheros
- Ubicacion: english/modules/integrator/

### 6.3 Actualizar session.js
- Logica para insertar sesion integradora cada ~5 sesiones
- Render especial: mostrar tema + que modulos se trabajan

### 6.4 Actualizar views.js
- Indicador visual de "proxima sesion integradora en X sesiones"
- Preview del tema
