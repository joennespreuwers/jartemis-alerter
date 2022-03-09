const Discord = require('discord.js');
const { LoadJSON, SaveJSON } = require('../modules/JSON');
module.exports = {
   name: 'setup',
   description: 'Set up Jartemis to recieve status updates',
   disabled: false,
   usage: 'setup',
   options: [
      {
         name: 'announcement_channel',
         description: "If you don't want a new channel to be created, where should I post the updates?",
         type: 7,
         channel_types: [0, 5],
         required: false,
      },
   ],
   async execute(interaction) {
      let embed = new Discord.MessageEmbed().setFooter(interaction.client.vars.credits_footer);
      try {
         if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            embed.setColor(interaction.client.vars.fail_color).setDescription(interaction.client.command_replies.setup.not_an_admin);
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
         }
         let database = LoadJSON('./utils/guilds_db.json');
         let createdChannel;
         let alreadyConfigured = database.hasOwnProperty(interaction.guild.id);
         if (
            alreadyConfigured &&
            interaction.options.getChannel('announcement_channel') &&
            interaction.options.getChannel('announcement_channel').id === database[interaction.guild.id]
         ) {
            embed.setColor(interaction.client.vars.success_color).setDescription(interaction.client.command_replies.setup.reconfiguring_same_channel);
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
         }
         if (!interaction.options.getChannel('announcement_channel')) {
            createdChannel = await interaction.guild.channels.create(interaction.client.vars.new_channel_name);
            database[interaction.guild.id] = createdChannel.id;
         } else database[interaction.guild.id] = interaction.options.getChannel('announcement_channel').id;
         SaveJSON('./utils/guilds_db.json', database);
         embed
            .setColor(interaction.client.vars.success_color)
            .setDescription(
               alreadyConfigured
                  ? interaction.client.command_replies.setup.reconfigured_success.replace(
                       '%VAR%',
                       interaction.options.getChannel('announcement_channel') ? interaction.options.getChannel('announcement_channel').id : createdChannel.id
                    )
                  : interaction.client.command_replies.setup.success.replace(
                       '%VAR%',
                       interaction.options.getChannel('announcement_channel') ? interaction.options.getChannel('announcement_channel').id : createdChannel.id
                    )
            );
         let configuredEmbed = new Discord.MessageEmbed()
            .setColor(interaction.client.vars.information_color)
            .setFooter(interaction.client.vars.credits_footer)
            .setDescription(interaction.client.command_replies.setup.this_channel_is_configured);
         if (interaction.options.getChannel('announcement_channel')) {
            interaction.options.getChannel('announcement_channel').send({ embeds: [configuredEmbed] });
         } else createdChannel.send({ embeds: [configuredEmbed] });
      } catch (error) {
         console.error(error);
         embed.setColor(interaction.client.vars.fail_color).setDescription(interaction.client.command_replies.setup.fail);
      }
      await interaction.reply({ embeds: [embed], ephemeral: true });
   },
};
