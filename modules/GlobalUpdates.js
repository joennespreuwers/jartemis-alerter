const Discord = require('discord.js');
const { LoadJSON } = require('../modules/JSON');
module.exports = async function PostGlobalUpdate(templateToPost, interaction, updateType) {
   let embed = new Discord.MessageEmbed().setFooter(interaction.client.vars.credits_footer);
   try {
      await interaction.client.guilds.fetch();
      const database = LoadJSON('./utils/guilds_db.json');
      let guildCounter = 0;
      for (const guildID in database) {
         const updateChannel = await interaction.client.guilds.cache.get(guildID).channels.fetch(database[guildID]);
         if (updateChannel) {
            await updateChannel.send(templateToPost);
            guildCounter++;
         }
      }
      embed
         .setColor(interaction.client.vars.success_color)
         .setDescription(interaction.client.command_replies.global_update_success.replace('%VAR%', guildCounter));
      await interaction.editReply({ embeds: [embed], ephemeral: true });
      if (interaction.client.vars.enable_logging_channel) await PostLog(true, interaction, updateType, guildCounter);
   } catch (error) {
      embed.setColor(interaction.client.vars.fail_color).setDescription(interaction.client.command_replies.global_update_fail);
      console.error(error);
      await interaction.editReply({ embeds: [embed], ephemeral: true });
      await PostLog(false, interaction, updateType, 0, error);
   }
};

async function PostLog(successfullyPosted, interaction, updateType, guildCounter, error = '') {
   let embed = new Discord.MessageEmbed().setColor(interaction.client.vars[successfullyPosted ? 'success_color' : 'fail_color']);
   let varsOrder = successfullyPosted ? [interaction.member.id, updateType, guildCounter] : [interaction.member.id, updateType, error];
   let description = interaction.client.command_replies[successfullyPosted ? 'log_success' : 'log_fail'];
   const amtOfVarsToReplace = (description.match(/%VAR%/g) || []).length + 1;
   for (let counter = 0; counter < amtOfVarsToReplace; counter++) {
      description = await description.replace(/%VAR%/, varsOrder[counter]);
   }
   embed.setDescription(description);
   await global.commandLoggingChannel.send({ embeds: [embed] });
}
