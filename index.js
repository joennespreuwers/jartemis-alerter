const Discord = require('discord.js');
const colors = require('colors');
const fs = require('fs');

const client = new Discord.Client({ intents: ['GUILDS'] });

client.slashCommands = new Discord.Collection();
client.config = require('./utils/config.json');
client.vars = require('./utils/vars.json');
client.templates = require('./utils/templates.json');
client.command_replies = require('./utils/command_replies.json');

client.login(client.config.token).then(async () => {
   await client.guilds.fetch();

   console.log(`------------------------- ${colors.blue('LOADING')} DISCORD.JS EVENTS ------------------------`);
   const eventFiles = fs.readdirSync('./events/').filter(file => file.endsWith('.js'));
   for (const eventFile of eventFiles) {
      const event = require(`./events/${eventFile}`);
      if (event.once) {
         client.once(event.name, async (...args) => await event.execute(...args));
      } else {
         client.on(event.name, async (...args) => await event.execute(...args));
      }
      console.log(`Discord.JS event '${event.name}' status: ✅`.padEnd(67, ' ') + `(${colors.green('loaded')})`);
   }

   console.log(`----------------------------- ${colors.blue('LOADING')} COMMANDS -----------------------------`);
   const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
   for (const commandFile of commandFiles) {
      try {
         const command = require(`./commands/${commandFile}`);
         client.slashCommands.set(command.name, command);
         await client.application.commands
            .create(
               {
                  name: command.name,
                  description: command.description,
                  options: command.options ? command.options : null,
                  default_permission: true,
               },
               command.sprewCrewOnly ? client.vars.control_server_id : null
            )
            .then(() => {
               console.log(`Slash command '${command.name}' status: ✅`.padEnd(67, ' ') + `(${colors.green('loaded')})`);
            });
      } catch (error) {
         console.log(`Command '${commandFile}' status: ❌`.padEnd(68, ' ') + `(${colors.green('error')})`);
         console.error(error);
      }
   }

   console.log(`----------------------------- ${colors.blue('REMOVING')} COMMANDS ----------------------------`);
   let commandsInControlServer = await client.guilds.cache.get(client.vars.control_server_id).commands.fetch();
   for (let commandInControlServer of commandsInControlServer) {
      let commandFound = commandInControlServer[1];
      try {
         if (!client.slashCommands.get(commandFound.name)) {
            await commandFound.delete();
            console.log(`Slash command '${commandFound.name}' removing status: ♻️`.padEnd(68, ' ') + `(${colors.green('removed')})`);
         } else console.log(`Slash command '${commandFound.name}' removing status: 🟤`.padEnd(63, ' ') + `(${colors.green('not removed')})`);
      } catch (error) {
         console.log(`Slash command '${commandFound.name}' removing status: 🟤`.padEnd(60, ' ') + `(${colors.green('error')})`);
         console.error(error);
      }
   }
   let globalCommands = await client.application.commands.fetch();
   for (let globalCommand of globalCommands) {
      let commandFound = globalCommand[1];
      try {
         if (!client.slashCommands.get(commandFound.name)) {
            await commandFound.delete();
            console.log(`Global slash command '${commandFound.name}' removing status: ♻️`.padEnd(68, ' ') + `(${colors.green('removed')})`);
         } else console.log(`Global slash command '${commandFound.name}' removing status: 🟤`.padEnd(63, ' ') + `(${colors.green('not removed')})`);
      } catch (error) {
         console.log(`Global slash command '${commandFound.name}' removing status: 🟤`.padEnd(60, ' ') + `(${colors.green('error')})`);
         console.error(error);
      }
   }

   console.log(`---------------------- ${colors.blue('UPDATING')} COMMAND'S PERMISSIONS ----------------------`);
   commandsInControlServer = await client.guilds.cache.get(client.vars.control_server_id).commands.fetch();
   for (let commandInControlServer of commandsInControlServer) {
      let applicationCommand = commandInControlServer[1];
      try {
         if (applicationCommand.sprewCrewOnly) {
            await applicationCommand.permissions.add({
               permissions: [
                  {
                     id: client.vars.control_role_id,
                     type: 'ROLE',
                     permission: true,
                  },
               ],
            });
            console.log(`Slash command '${applicationCommand.name}' permission status: ✅`.padEnd(66, ' ') + `(${colors.green('updated')})`);
         } else {
            console.log(`Slash command '${applicationCommand.name}' permission status: 🟤`.padEnd(63, ' ') + `(${colors.green('not updated')})`);
         }
      } catch (error) {
         console.log(`Slash command '${applicationCommand.name}' permission status: ❌`.padEnd(59, ' ') + `(${colors.green('error updating')})`);
         console.error(error);
         return;
      }
   }

   console.log(`----------------------------- JARTEMIS ${colors.green('RUNNING')} -----------------------------`);

   global.commandLoggingChannel = await client.guilds.cache.get(client.vars.control_server_id).channels.fetch(client.vars.command_logs_channel_id);
   if (client.vars.enable_logging_channel)
      global.waitEmbed = new Discord.MessageEmbed()
         .setColor(client.vars.information_color)
         .setDescription(client.command_replies.wait_while_executing.replace('%VAR%', client.vars.loading_gif_emoji));
});
