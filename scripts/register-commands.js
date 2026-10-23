require('dotenv').config({ quiet: true });

const { REST, Routes } = require('discord.js');
const commands = require('../src/commands');
const { loadConfig, missingRegisterConfig, printMissing } = require('../src/config');

function commandBody() {
  return commands.map((command) => command.data.toJSON());
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const body = commandBody();
  if (dryRun) {
    console.log('Comandos de guild (simulación, no se envió nada a Discord):');
    for (const command of body) console.log(`- ${command.name}`);
    return;
  }

  const config = loadConfig();
  const missing = missingRegisterConfig(config);
  if (missing.length) {
    printMissing('Falta configuración para registrar los comandos:', missing);
    process.exit(1);
  }

  const rest = new REST({ version: '10' }).setToken(config.token);
  await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body });
  console.log(`Registré ${body.length} comandos en el servidor ${config.guildId}.`);
}

main().catch((err) => {
  console.error('No pude registrar los comandos:', err.message || err);
  process.exit(1);
});
