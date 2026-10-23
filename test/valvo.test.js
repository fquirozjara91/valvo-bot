const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const test = require('node:test');

const { loadConfig, missingStartupConfig, missingRegisterConfig } = require('../src/config');
const { openStore } = require('../src/store');
const { loadFacts, asSentence, SOURCE_NAMES } = require('../src/facts');
const { pickOutcome, ACCEPT_LINE, EXCUSES } = require('../src/excuses');
const { footerForOne, footerForTwo, rollDie, LOSER, SIX, TWELVE, DEFAULT_FOOTER } = require('../src/dice');
const { decideAlerts, formatAlert, HYPOCRITE_LINE, isValheim } = require('../src/presence');
const { lookup, DEFAULT_REPLY, GAMES } = require('../src/commands/juguemos');
const { LINES } = require('../src/commands/frase');
const { TRUTH } = require('../src/message');
const { handleMessage } = require('../src/legacy');
const { daysBetween, formatWhen } = require('../src/format');
const commands = require('../src/commands');
const paths = require('../src/paths');

const root = path.join(__dirname, '..');
const NAME = /^[\p{Ll}\p{Lm}\p{Lo}\p{N}\p{sc=Devanagari}\p{sc=Thai}_-]{1,32}$/u;

function tempDb() {
  return path.join(os.tmpdir(), `valvo-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}.json`);
}

function playing(id, name, extra = {}) {
  return {
    id,
    bot: Boolean(extra.bot),
    activities: name ? [{ type: extra.type ?? 0, name }] : [],
  };
}

function alertsFor(members, options = {}) {
  return decideAlerts({
    members,
    minPlayers: options.minPlayers ?? 3,
    valvoUserId: options.valvoUserId ?? '',
    hypocriteEnabled: options.hypocriteEnabled ?? false,
    isCoolingDown: options.isCoolingDown || (() => false),
  });
}

test('la configuración exige token y trata a Valvo como opcional', () => {
  const legacy = loadConfig({ VALVO_TOKEN: 'viejo', VALVO_USER_ID: '   ' });
  assert.equal(legacy.token, 'viejo');
  assert.equal(legacy.hypocriteMode, false);
  assert.deepEqual(missingStartupConfig(legacy), []);

  const preferred = loadConfig({
    DISCORD_TOKEN: 'nuevo',
    VALVO_TOKEN: 'viejo',
    VALVO_USER_ID: '475450555183923200',
    PRESENCE_COOLDOWN_HOURS: '2',
    PRESENCE_MIN_PLAYERS: '3',
  });
  assert.equal(preferred.token, 'nuevo');
  assert.equal(preferred.hypocriteMode, true);
  assert.equal(preferred.valvoUserId, '475450555183923200');
  assert.equal(preferred.cooldownMs, 2 * 60 * 60 * 1000);
  assert.equal(preferred.minPlayers, 3);
  assert.equal(loadConfig({ PRESENCE_COOLDOWN_HOURS: 'no' }).cooldownMs, 2 * 60 * 60 * 1000);

  const empty = loadConfig({});
  assert.match(missingStartupConfig(empty).join(' '), /DISCORD_TOKEN/);
  assert.ok(missingRegisterConfig(empty).includes('CLIENT_ID'));
  assert.ok(missingRegisterConfig(empty).includes('GUILD_ID'));
});

test('el ejemplo trae los ids del servidor y deja el token vacío', () => {
  const example = fs.readFileSync(path.join(root, '.env.example'), 'utf8');
  assert.match(example, /^DISCORD_TOKEN=$/m);
  assert.match(example, /CLIENT_ID=666795034628194305/);
  assert.match(example, /GUILD_ID=426737595716730882/);
  assert.match(example, /VALVO_USER_ID=475450555183923200/);
  assert.match(example, /VALVO_TOKEN/);
});

test('los datos de Valheim están citados y caben en el cupo', () => {
  const facts = loadFacts(paths.facts);
  assert.ok(facts.length >= 8 && facts.length <= 10);
  for (const fact of facts) {
    assert.ok(fact.fact.length > 20);
    assert.ok(SOURCE_NAMES.has(fact.source.name));
    assert.match(fact.source.url, /^https:\/\//);
  }
  assert.equal(asSentence('corre sobre el motor Unity'), 'Corre sobre el motor Unity.');
});

test('/apaña dice ya, apaño solo en el 1%', () => {
  assert.deepEqual(pickOutcome(() => 0), { accepted: true, line: ACCEPT_LINE });
  assert.equal(ACCEPT_LINE, 'ya, apaño');
  let step = 0;
  const outcome = pickOutcome(() => {
    step += 1;
    return step === 1 ? 0.5 : 0;
  });
  assert.equal(outcome.accepted, false);
  assert.equal(outcome.line, EXCUSES[0]);
  assert.ok(EXCUSES.length >= 10);
  assert.ok(EXCUSES.every((line) => line && line !== ACCEPT_LINE));
});

test('el historial y los milagros se guardan en disco', () => {
  const file = tempDb();
  const store = openStore(file);
  store.addRefusal('Warframe');
  store.addRefusal('warframe');
  store.addRefusal('Fable');
  assert.deepEqual(store.ranking(), [
    { name: 'warframe', count: 2 },
    { name: 'Fable', count: 1 },
  ]);

  const first = store.recordMiracle({
    at: '2026-01-01T00:00:00.000Z',
    userId: '1',
    userName: 'Wigan',
    game: 'Fable',
  });
  assert.equal(first.previous, null);
  const second = store.recordMiracle({
    at: '2026-01-03T00:00:00.000Z',
    userId: '2',
    userName: 'Felipe',
    game: null,
  });
  assert.equal(second.previous.at, '2026-01-01T00:00:00.000Z');
  assert.equal(store.miracleCount(), 2);
  assert.equal(daysBetween(second.previous.at, second.current.at), 2);

  const reopened = openStore(file);
  assert.equal(reopened.ranking()[0].count, 2);
  assert.equal(reopened.miracleCount(), 2);

  assert.equal(store.isCoolingDown('juego', 1000), false);
  store.setCooldown('juego', 500, 1000);
  assert.equal(store.isCoolingDown('juego', 1499), true);
  assert.equal(store.isCoolingDown('juego', 1500), false);
  assert.equal(openStore(file).isCoolingDown('juego', 1200), true);

  fs.writeFileSync(file, '{');
  assert.throws(() => openStore(file), /No pude leer/);
  fs.rmSync(file, { force: true });
});

test('el detector pide Valheim y se pone hipócrita solo si hay id', () => {
  const league = [
    playing('1', 'League of Legends'),
    playing('2', 'League of Legends'),
    playing('3', 'league of legends'),
  ];
  assert.equal(alertsFor(league).length, 1);
  assert.equal(alertsFor(league.slice(0, 2)).length, 0);
  assert.equal(alertsFor([
    playing('1', 'Valheim'),
    playing('2', 'Valheim'),
    playing('3', 'Valheim'),
  ]).length, 0);
  assert.equal(alertsFor([
    playing('1', 'League of Legends'),
    playing('2', 'League of Legends'),
    playing('bot', 'League of Legends', { bot: true }),
    playing('stream', 'League of Legends', { type: 1 }),
  ]).length, 0);

  const withValvo = [
    ...league,
    playing('475450555183923200', 'Valheim'),
  ];
  const hypocrite = alertsFor(withValvo, {
    valvoUserId: '475450555183923200',
    hypocriteEnabled: true,
  });
  assert.equal(hypocrite.length, 1);
  assert.equal(hypocrite[0].hypocrite, true);
  assert.match(formatAlert(hypocrite[0], { fact: 'x', source: { name: 'Wikipedia' } }), new RegExp(HYPOCRITE_LINE));
  assert.equal(HYPOCRITE_LINE, 'Valvo SÍ apaña… pero solo a Valheim.');

  const plain = alertsFor(withValvo, {
    valvoUserId: '',
    hypocriteEnabled: false,
  });
  const text = formatAlert(plain[0], {
    fact: 'corre sobre el motor Unity',
    source: { name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Valheim' },
  });
  assert.match(text, /Mejor juguemos Valheim\. ¿Sabían que en Valheim corre sobre el motor Unity\?/);
  assert.doesNotMatch(text, /Valvo SÍ apaña/);

  const cooled = alertsFor(league, { isCoolingDown: () => true });
  assert.equal(cooled.length, 0);
  assert.equal(isValheim('Valheim'), true);
  assert.equal(isValheim('Minecraft'), false);
});

test('los dados y las frases viejas siguen diciendo lo mismo', () => {
  assert.equal(footerForOne(1), LOSER);
  assert.equal(footerForOne(4), DEFAULT_FOOTER);
  assert.equal(footerForOne(6), SIX);
  assert.equal(footerForTwo(1, 2), LOSER);
  assert.equal(footerForTwo(6, 6), TWELVE);
  assert.equal(footerForTwo(3, 3), DEFAULT_FOOTER);
  assert.equal(rollDie(() => 0), 1);
  assert.equal(rollDie(() => 0.999), 6);
  assert.equal(lookup('Fable?').reply, GAMES.fable.reply);
  assert.equal(lookup('  Black   Desert ?').activity, 'Black Desert Online');
  assert.equal(lookup('minecraft'), null);
  assert.match(DEFAULT_REPLY, /gamesio/);
  assert.equal(LINES.apanai, 'demás po perro!');
  assert.equal(LINES.botones, 'odio los botones');
  assert.match(TRUTH, /año 2020/);
});

test('los comandos de barra cubren el chiste y usan nombres válidos', () => {
  const names = commands.map((command) => command.data.name);
  assert.deepEqual(names, ['apaña', 'historial', 'valheim', 'milagro', 'dados', 'juguemos', 'frase', 'ayuda']);
  const apana = commands[0].data.toJSON();
  assert.equal(apana.options[0].name, 'juego');
  assert.equal(apana.options[0].required, true);
  for (const command of commands) {
    const json = command.data.toJSON();
    assert.match(json.name, NAME);
    assert.equal(json.contexts[0], 0);
    assert.ok(json.description.length > 0 && json.description.length <= 100);
  }
});

test('valvoception solo responde si el id está configurado', async () => {
  const sent = [];
  const message = {
    author: { id: '475450555183923200', bot: false },
    system: false,
    content: 'Valvo quién eres',
    channel: {
      isDMBased: () => false,
      send: async (payload) => sent.push(payload.content),
    },
  };
  await handleMessage(message, {
    config: { valvoUserId: '475450555183923200' },
    paths,
  });
  assert.deepEqual(sent, ['espera!... quien eres tu!?!?!?']);

  sent.length = 0;
  await handleMessage(message, { config: { valvoUserId: '' }, paths });
  assert.equal(sent.length, 0);
});

test('el reloj de Santiago entiende una fecha', () => {
  assert.match(formatWhen('2026-10-23T15:00:00.000Z'), /2026/);
});

test('hay Dockerfile, compose y las instrucciones en español', () => {
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  const compose = fs.readFileSync(path.join(root, 'docker-compose.yml'), 'utf8');
  const dockerfile = fs.readFileSync(path.join(root, 'Dockerfile'), 'utf8');
  assert.match(compose, /restart:\s*unless-stopped/);
  assert.match(compose, /env_file:\s*\.env/);
  assert.match(compose, /\/app\/data/);
  assert.match(dockerfile, /node:22/);
  assert.match(readme, /docker compose up -d/);
  assert.match(readme, /docker compose exec valvo npm run register/);
  assert.equal(fs.existsSync(path.join(root, 'Procfile')), false);
  for (const file of [paths.avatar, paths.spider, paths.gifOne, paths.gifTwo, paths.die(1), paths.die(6)]) {
    assert.equal(fs.existsSync(file), true, file);
  }
});

test('el lockfile deja ws por encima del arreglo de Dependabot', () => {
  const lock = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8'));
  const versions = Object.entries(lock.packages)
    .filter(([name]) => name === 'node_modules/ws' || name.endsWith('/node_modules/ws'))
    .map(([, pkg]) => pkg.version);
  assert.ok(versions.length >= 1);
  for (const version of versions) {
    const [major, minor, patch] = version.split('.').map(Number);
    const newer = major > 6 || (major === 6 && (minor > 2 || (minor === 2 && patch >= 4)));
    assert.equal(newer, true, version);
    assert.ok(major >= 8, version);
  }
});

test('sin token el proceso se despide solo, y el registro se puede simular', () => {
  const env = { ...process.env };
  delete env.DISCORD_TOKEN;
  delete env.VALVO_TOKEN;
  env.DOTENV_CONFIG_PATH = path.join(os.tmpdir(), `valvo-missing-${process.pid}.env`);

  const start = spawnSync(process.execPath, ['bot.js'], {
    cwd: root,
    env,
    encoding: 'utf8',
    timeout: 30000,
  });
  assert.equal(start.status, 1);
  assert.match(start.stderr, /DISCORD_TOKEN/);
  assert.doesNotMatch(`${start.stdout}\n${start.stderr}`, /\n\s+at /);

  const dry = spawnSync(process.execPath, ['scripts/register-commands.js', '--dry-run'], {
    cwd: root,
    env,
    encoding: 'utf8',
    timeout: 30000,
  });
  assert.equal(dry.status, 0, dry.stderr);
  for (const name of ['apaña', 'historial', 'valheim', 'milagro']) {
    assert.match(dry.stdout, new RegExp(`- ${name}`));
  }

  const register = spawnSync(process.execPath, ['scripts/register-commands.js'], {
    cwd: root,
    env,
    encoding: 'utf8',
    timeout: 30000,
  });
  assert.equal(register.status, 1);
  assert.match(register.stderr, /DISCORD_TOKEN/);
  assert.doesNotMatch(`${register.stdout}\n${register.stderr}`, /\n\s+at /);
});
