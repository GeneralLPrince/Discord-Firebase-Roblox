module.exports = {
	name: 'ban',
	description: 'Ban command',
	execute(suspect, reason, message, database) {   

    const nbx = require('noblox.js');
    const Discord = require('discord.js');
    async function exec() {
      const userId = await nbx.getIdFromUsername(suspect).catch(e => "User not found");
      if (userId !== "User not found") {
        const playerName = await nbx.getUsernameFromId(userId)
        var ref = database.ref("Bans");
        var usersRef = ref.child(userId);
        usersRef.set({
          Moderator: message.member.user.tag,
          Reason: reason
          });

          const BanSuccess = new Discord.MessageEnbed()
          .setColor('#07C902')
          .setDescription('Success!')
          .addFields(
            {name: 'Banned Player:', value: playerName},
            {name: 'Reason:', value: reason}
          )

          const BanError = new Discord.MessageEnbed()
          .addFields(
            {name: 'Error!', value: 'User does not exist! !ban <user> <reason>'}
            )
          return message.channel.send(BanSuccess)
      } else {
        return message.channel.send(BanError)
      }
      }
      exec()
	},
}; 
