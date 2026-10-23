const apana = require('./apana');
const historial = require('./historial');
const valheim = require('./valheim');
const milagro = require('./milagro');
const dados = require('./dados');
const juguemos = require('./juguemos');
const frase = require('./frase');
const ayuda = require('./ayuda');

const commands = [apana, historial, valheim, milagro, dados, juguemos, frase, ayuda];

const names = new Set();
for (const command of commands) {
  const name = command.data.name;
  if (names.has(name)) throw new Error(`Comando duplicado: ${name}`);
  names.add(name);
}

module.exports = commands;
