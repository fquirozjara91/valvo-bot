# Valvo sí (a veces)

Bot de Discord para el grupo. Habla como Valvo: casi nunca apaña, salvo que el juego sea Valheim. El código viejo era de 2020, con discord.js 11 y comandos de texto (`valvo ...`). Esta versión usa discord.js 14, comandos de barra y Node 22.

El bot **es** el personaje. `VALVO_USER_ID` solo sirve para el modo hipócrita (si el Valvo de verdad está jugando Valheim mientras el resto está en otra cosa). Si ese id no está, ese modo se apaga y todo lo demás sigue igual. En `.env.example` el id ya viene puesto.

## Qué necesitas

- Node.js 22 LTS, o Docker.
- Una aplicación de bot en el [portal de desarrolladores](https://discord.com/developers/applications). El `CLIENT_ID` del ejemplo es `666795034628194305` y el servidor es `426737595716730882`. Si creas otra aplicación, cambia esos valores.

No hace falta Heroku ni ningún servicio de pago. El `Procfile` viejo se eliminó.

## Portal de Discord

1. Entra a la aplicación → **Bot** → **Reset Token** y copia el token. Va en `DISCORD_TOKEN`. No lo subas a git.
2. En **Privileged Gateway Intents** activa los tres:
   - **Presence Intent** (presencias: para ver qué juego tiene cada uno)
   - **Server Members Intent** (miembros del servidor)
   - **Message Content Intent** (para el chiste viejo cuando Valvo escribe `valvo`, y para `!comandos` por mensaje directo)
3. Invitación, con los scopes `bot` y `applications.commands`:

   https://discord.com/api/oauth2/authorize?client_id=666795034628194305&scope=bot%20applications.commands&permissions=117760

   Esos permisos alcanzan para ver canales, enviar mensajes, embeds, archivos y leer el historial. Si el bot ya estaba en el servidor desde 2020, hay que invitarlo de nuevo: sin `applications.commands` no aparecen los slash commands.

4. Activa el modo desarrollador de Discord (Ajustes de usuario → Avanzado) y copia el id del canal donde debe hablar el detector. Ese valor es `ANNOUNCE_CHANNEL_ID`.

## Configuración

```bash
cp .env.example .env
```

Edita `.env` y pega el token. El resto del ejemplo ya trae el cliente, el servidor y el usuario de Valvo.

| Variable | Para qué |
| --- | --- |
| `DISCORD_TOKEN` | Token del bot. Si todavía tienes el antiguo, `VALVO_TOKEN` también sirve. |
| `CLIENT_ID` | Aplicación. Hace falta para registrar comandos. |
| `GUILD_ID` | Servidor donde se registran los comandos y se miran las presencias. |
| `VALVO_USER_ID` | Opcional. Con valor, el modo hipócrita queda activo. Vacío, se apaga. |
| `ANNOUNCE_CHANNEL_ID` | Canal del detector. Si falta, el bot arranca igual y no publica avisos. |
| `PRESENCE_COOLDOWN_HOURS` | Espera entre avisos del mismo juego. Por defecto 2. |
| `PRESENCE_MIN_PLAYERS` | Cuántas personas en el mismo juego. Por defecto 3. |

Sin token, `npm start` y `npm run register` terminan con un mensaje y código 1. No tiran un stack trace.

## En tu computador

```bash
npm install
npm run register
npm start
```

`npm run register` publica los comandos en el servidor (`GUILD_ID`). Aparecen al tiro, no hay que esperar la hora de los comandos globales. Para ver la lista sin llamar a Discord: `npm run register -- --dry-run`.

`npm run check` corre el linter, los tests y `npm audit`. No necesita token.

## Docker

Pensado para dejarlo corriendo en el PC de Felipe. La carpeta `data/` del repo se monta en el contenedor: ahí vive `valvo.json` (historial, milagros y la espera del detector) y también `valheim-facts.json`, que sí va en git. No borres el de los datos. `valvo.json` no se commitea.

La primera vez, o cuando cambie el código:

```bash
cp .env.example .env
# pegar DISCORD_TOKEN
docker compose up -d --build
docker compose exec valvo npm run register
```

Para levantarlo después:

```bash
docker compose up -d
```

`restart: unless-stopped` lo vuelve a levantar si el proceso se cae. `docker compose stop` lo deja quieto.

Registrar los comandos desde el contenedor (el token entra por `env_file: .env`, no queda en la imagen):

```bash
docker compose exec valvo npm run register
```

Si el contenedor está reiniciándose por un token malo, mira `docker compose logs -f valvo`, corrige `.env` y vuelve a hacer `docker compose up -d`.

Para actualizar:

```bash
git pull
docker compose up -d --build
docker compose exec valvo npm run register
```

## Raspberry Pi con pm2

Sin Docker también sirve. En el Pi, con Node 22:

```bash
npm install
cp .env.example .env
npm run register
npm install -g pm2
pm2 start bot.js --name valvo
pm2 save
```

`pm2` tiene que partir en la carpeta del proyecto, porque el bot lee `.env` desde ahí. Los datos quedan en `data/valvo.json`.

## Comandos

- `/apaña juego` — una excusa absurda. Hay un 1% de que diga `ya, apaño` y arme el festejo. Las negativas se anotan.
- `/historial` — cuántas veces se rajó, ordenado por juego.
- `/valheim` — un dato al azar, con enlace a la fuente.
- `/milagro` — anota la fecha en que de verdad entró, y muestra la anterior.
- `/juguemos`, `/dados`, `/frase`, `/ayuda` — el repertorio de 2020 (fable, warframe, los daditos, «demás po perro», los carabineros, etc.).

Por mensaje directo siguen `!comandos` y `!sugerencias`.

Si el usuario configurado en `VALVO_USER_ID` escribe algo que parte con `valvo`, el bot responde `espera!... quien eres tu!?!?!?` con la foto de siempre.

## Detector de juegos

Cuando 3 o más personas del servidor están jugando lo mismo, y no es Valheim, escribe en `ANNOUNCE_CHANNEL_ID` algo como: «Mejor juguemos Valheim. ¿Sabían que en Valheim…?» más un dato. No repite el mismo juego hasta que pase el cooldown (2 horas si no cambias `PRESENCE_COOLDOWN_HOURS`). La espera queda guardada en `data/valvo.json`, así un reinicio de Docker no spamea el canal.

Modo hipócrita: si además Valvo está jugando Valheim, el mensaje es `Valvo SÍ apaña… pero solo a Valheim`. Sin `VALVO_USER_ID` ese texto no se usa.

Hace falta el Presence Intent. Si no está activo en el portal, el bot igual responde comandos, pero no ve los juegos.

## Datos de Valheim

`data/valheim-facts.json` tiene entre 8 y 10 datos. Cada uno trae `source.name` (`Wikipedia`, `Steam` o `Prensa`) y `source.url`. No agregues una frase si no la puedes abrir en esa página.
