module.exports = {
	name: 'unban',
	description: 'Unban command',
	execute(suspect, message, firebase) {
		const nbx = require('noblox.js');
    async function exec() {
    const userId = await nbx.getIdFromUsername(suspect).catch(e => "User not found");
    if (userId !== "User not found") {
      const playerName = await nbx.getUsernameFromId(userId)
      var ref = firebase.database().ref("Bans/");
      ref.once("value")
      .then(function(snapshot) {
        var isBanned = snapshot.child(userId).hasChildren()

        if (isBanned !== false){
          var ref2 = firebase.database().ref("Bans/"+userId);
          ref2.remove()
          return message.channel.send("`"+playerName+"` has been unbanned.")
        } else {
          return message.channel.send("Cannot unban `"+playerName+"` because the player hasn't got banned.")
        }
      })
    }
    }
    exec()
	},
};                                 
