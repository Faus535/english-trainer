# Como Configurar Todo en tu iPhone

Guia paso a paso para tener el sistema de aprendizaje de ingles funcionando en tu iPhone usando Obsidian.

## Por que Obsidian

- Gratis en iPhone, iPad, Mac, Windows, Linux
- Lee ficheros .md nativamente (exactamente los que hemos creado)
- Funciona offline (no necesitas internet para estudiar)
- Links internos entre ficheros (puedes navegar entre vocabulario, verbos, etc.)
- Plugin de flashcards con repeticion espaciada (Spaced Repetition)
- Plugin de revision diaria (Daily Notes)
- Se sincroniza gratis via iCloud entre iPhone y Mac/iPad

## Paso 1: Instalar Obsidian en iPhone

1. Abre la App Store
2. Busca "Obsidian - Connected Notes"
3. Descarga (es gratis)
4. Abre la app

## Paso 2: Subir los ficheros

### Opcion A: Via iCloud (recomendado)

1. En tu Mac/PC, abre Finder/Explorador
2. Ve a iCloud Drive
3. Crea una carpeta llamada `Obsidian`
4. Dentro crea una carpeta llamada `English`
5. Copia TODA la carpeta `english/` de este proyecto dentro
6. Copia tambien `ENGLISH.md` (el indice)
7. En Obsidian iPhone → "Open folder as vault" → selecciona la carpeta `English` en iCloud

### Opcion B: Via GitHub

1. Sube el proyecto a un repositorio de GitHub
2. En iPhone, instala "Working Copy" (app de Git)
3. Clona el repositorio
4. En Obsidian → "Open folder as vault" → selecciona la carpeta del repo

### Opcion C: Via Google Drive + Autosync (Android alternativa)

Si usas Android en vez de iPhone, puedes usar FolderSync o Autosync para sincronizar una carpeta de Google Drive con Obsidian.

## Paso 3: Configurar Obsidian

### Ajustes basicos

1. Abre Obsidian → Settings (ruedita)
2. **Editor**:
   - Font size: 16-18 (comodo para leer en movil)
   - Readable line length: ON
3. **Appearance**:
   - Theme: Elige uno que te guste (recomiendo "Minimal" o "California Coast")
   - Base color scheme: Dark o Light segun prefieras

### Activar Community Plugins

1. Settings → Community plugins → Turn on community plugins
2. Browse → Busca e instala estos plugins:

#### Plugin 1: "Spaced Repetition" (IMPRESCINDIBLE)

- Este plugin convierte tus notas en flashcards
- Usa el sistema de Anki (repeticion espaciada) para memorizar vocabulario
- Como crear flashcards en tus ficheros:

```
Pregunta::Respuesta
```

o formato multilinea:

```
#card
Pregunta
?
Respuesta
```

#### Plugin 2: "Dataview" (recomendado)

- Te permite hacer consultas sobre tus notas
- Por ejemplo: mostrar todas las palabras que has marcado como "dificil"

#### Plugin 3: "Calendar" (recomendado)

- Muestra un calendario con tus notas diarias
- Ves tu racha de dias estudiando

#### Plugin 4: "Checklist" (opcional)

- Para hacer seguimiento de tu progreso

## Paso 4: Estructura de navegacion en Obsidian

Una vez abierto el vault, veras la estructura de carpetas en el panel izquierdo:

```
vocabulary/
verbs/
grammar/
phrases/
pronunciation/
listening/
skills/
daily/
ENGLISH.md (tu pagina de inicio)
```

### Configurar pagina de inicio

1. Settings → Core plugins → activa "Note composer"
2. Abre ENGLISH.md
3. Command palette → "Pin current note" → asi siempre la tienes a mano
4. O usa el plugin "Homepage" para que ENGLISH.md se abra al iniciar

## Paso 5: Crear flashcards

Para aprovechar el plugin de Spaced Repetition, puedes añadir flashcards a cualquier fichero. Ejemplo en `vocabulary/top-100.md`:

Al final del fichero, añade:

```
## Flashcards

the::el, la, los, las
be::ser/estar
to::a, hacia, para
of::de
and::y
have::tener
```

O para verbos irregulares:

```
## Flashcards

be - was/were - ?::been
have - had - ?::had
go - went - ?::gone
```

Tip: No necesitas crear TODAS las flashcards de golpe. Cada dia, añade 10-20 palabras nuevas. El sistema de repeticion espaciada se encarga de mostrartelas en el momento optimo.

## Paso 6: Sincronizacion

### iCloud (gratis, automatico)

Si creaste el vault en iCloud Drive, se sincroniza automaticamente entre todos tus dispositivos Apple. Cuando editas en iPhone, aparece en Mac y viceversa.

### Obsidian Sync (de pago, $4/mes)

Si quieres sincronizar entre iPhone y un PC Windows/Linux, necesitas Obsidian Sync o usar Git.

### Git (gratis, manual)

Con Working Copy en iPhone puedes hacer pull/push cuando quieras.

## Resolucion de problemas

- **No veo los ficheros**: Asegurate de que la carpeta esta en iCloud Drive y Obsidian tiene permisos de acceso
- **Las tablas se ven mal**: En Settings → Editor → activa "Strict line breaks"
- **El IPA no se ve bien**: Asegurate de usar una fuente que soporte IPA (la fuente por defecto de Obsidian lo soporta)
- **Quiero modo oscuro**: Settings → Appearance → Base color scheme → Dark
