const PostGlobalUpdate = require('../modules/GlobalUpdates');
module.exports = {
   name: 'announce',
   description: 'Create a new announcement',
   disabled: false,
   usage: 'announce',
   sprewCrewOnly: true,
   options: [
      {
         name: 'message',
         description: 'What message do you want to cast?',
         type: 3,
         required: true,
      },
   ],
   async execute(interaction) {
      await interaction.reply({ embeds: [global.waitEmbed], ephemeral: interaction.client.vars.enable_logging_channel });
      let template = interaction.client.templates[this.name];
      template.embeds[0].description = interaction.options.getString('message');
      if (interaction.client.vars.enable_logging_channel) await PostGlobalUpdate(template, interaction, this.name);
   },
};
