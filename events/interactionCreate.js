const Discord = require('discord.js');
const PostGlobalUpdate = require('../modules/GlobalUpdates');
module.exports = {
   name: 'interactionCreate',
   once: false,
   async execute(interaction) {
      try {
         if (!interaction.isCommand()) return;
         const command = interaction.client.slashCommands.get(interaction.commandName);
         if (command.disabled) {
            const commandDisabled = new Discord.MessageEmbed()
               .setColor(interaction.client.vars.fail_color)
               .setFooter(interaction.client.vars.credits_footer)
               .setDescription(interaction.client.command_replies.command_disabled);
            await interaction.reply({ embeds: [commandDisabled], ephemeral: true });
            return;
         }
         if (command.directlyPostGlobalUpdate) {
            await interaction.reply({ embeds: [global.waitEmbed], ephemeral: interaction.client.vars.enable_logging_channel });
            await PostGlobalUpdate(interaction.client.templates[command.name], interaction, command.name);
         } else await command.execute(interaction);
      } catch (error) {
         const errorEmbed = new Discord.MessageEmbed()
            .setColor(interaction.client.vars.fail_color)
            .setFooter(interaction.client.vars.credits_footer)
            .setDescription(interaction.client.command_replies.command_executing_error);
         console.error(error);
         await interaction.reply({ embeds: [errorEmbed], ephemeral: true }).catch(async () => {
            await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
         });
      }
   },
};
