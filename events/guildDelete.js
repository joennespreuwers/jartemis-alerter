const { LoadJSON, SaveJSON } = require('../modules/JSON');
module.exports = {
   name: 'guildDelete',
   once: false,
   execute(guild) {
      let database = LoadJSON('./utils/guilds_db.json');
      if (database.hasOwnProperty(guild.id)) {
         delete database[guild.id];
         SaveJSON('./utils/guilds_db.json', database);
      }
   },
};
