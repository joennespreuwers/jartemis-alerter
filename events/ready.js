module.exports = {
   name: 'ready',
   once: true,
   async execute(client) {
      let count = 0;
      setInterval(() => {
         client.user.setPresence({
            status: 'online',
            activities: [client.vars.status[count]],
         });
         count += count === client.vars.status.length - 1 ? -count : 1;
      }, 15 * 1000);
   },
};
