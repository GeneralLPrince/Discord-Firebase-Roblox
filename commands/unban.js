module.exports = {
	name: 'unban',
	description: 'Unban command',
	execute(suspect, message, firebase) {
		const nbx = require('noblox.js');
    const Discord = require('discord.js');
    async function exec() {
    const userId = await nbx.getIdFromUsername(suspect).catch(e => "User not found");
    if (userId !== "User not found") {
      const playerName = await nbx.getUsernameFromId(userId)
      var ref = firebase.database().ref("Bans/");
      ref.once("value")
      .then(function(snapshot) {
        var isBanned = snapshot.child(userId).hasChildren()

        const SuccessEmbed = new Discord.MessageEmbed()
        .setColor('#07C902')
        .addFields(
          {name: 'Player Unbanned!', value: playerName}
        )

        const ErrorEmbed = new Discord.MessageEmbed()
        .setColor('#992d22')
        .addFields(
          {name: 'Error!', value: "Could not unban "+playerName+" Because they are not banned!"}
        )


  

        if (isBanned !== false){
          var ref2 = firebase.database().ref("Bans/"+userId);
          ref2.remove()
          return message.channel.send(SuccessEmbed)
        } else {
          return message.channel.send(ErrorEmbed)
        }
      })
    }
    }
    exec()
	},
};                                 
