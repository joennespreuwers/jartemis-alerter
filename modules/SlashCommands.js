let GetApplication = function (client, serverID) {
   if (/*serverID &&*/ client) {
      const app = client.api.applications(client.user.id);
      if (serverID) {
         app.guilds(serverID);
      }
      return app;
   } else {
      /*if (!serverID) {
         throw "Argument 'serverID' in function 'GetApplication' is not defined (ID of server in which to delete command)";
      } else */ if (!client && !serverID) {
         throw "Argument 'client' in function 'GetApplication' is not defined (logged in Discord client)";
      }
   }
};

async function DeleteCommand(commandID, client, serverID) {
   if (commandID && client && serverID) {
      await GetApplication(client, serverID).commands(commandID).delete();
   } else if (commandID && client) {
      await GetApplication(client).commands(commandID).delete();
   } else {
      if (!commandID) {
         throw "Argument 'commandID' in function 'DeleteCommand' is not defined (ID of command to delete)";
      } else if (!client) {
         throw "Argument 'client' in function 'DeleteCommand' is not defined (logged in Discord client)";
      }
   }
}

function FindArgumentValue(argument, interaction) {
   if (argument && interaction) {
      let argumentFound = interaction.options.get(argument);
      if (argumentFound) {
         return argumentFound.value;
      } else {
         return undefined;
      }
   } else {
      if (!argument) {
         throw "Argument 'argument' in function 'FindArgumentValue' is not defined (argument to look for)";
      } else if (!interaction) {
         throw "Argument 'interaction' in function 'FindArgumentValue' is not defined (interaction)";
      }
   }
}

module.exports = {
   GetApplication: GetApplication,
   DeleteCommand: DeleteCommand,
   FindArgumentValue: FindArgumentValue,
};
