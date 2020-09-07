module.exports = {
	name: 'ban',
	description: 'Ban command',
	execute(suspect, reason, message, database) {   

    const nbx = require('noblox.js');
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
          return message.channel.send("`"+playerName+"` has been banned by: `"+message.member.user.tag+"` for `"+reason+"`")
      } else {
        return message.channel.send("User does not exist, please use this format: `!ban [Username][banReason]`")
      }
      }
      exec()
	},
}; 
