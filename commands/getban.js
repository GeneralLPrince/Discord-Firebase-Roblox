module.exports = {
	name: 'getban',
	description: 'Getban command',
	
    execute(suspect, message, firebase) {
        const nbx = require('noblox.js');

        async function exec() {
            const UserId = await nbx.getIdFromUsername(suspect).catch(e => "User not found");
            const Discord = require('discord.js');

            const NotBanned = new Discord.MessageEmbed()
            .setColor('992d22')
            .addFields(
                {name: 'Error!', value:'User does not exist!'}
            )

            const Banned = new Discord.MessageEmbed()
            .setColor('07C902')
            .addFields(
                {name: 'Username', value: suspect},
                {name: 'Reason', value: Reason},
                {name: 'Moderator', value: Moderator}
            )

            if (UserId == "User not found") {
                message.channel.send(NotBanned)
            }
            else {
                var Reference = firebase.database().ref("Bans/")
                Reference.once("value").then(function(snapshot) {
                    var IsBanned = snapshot.child(UserId).hasChildren()

                    if (IsBanned == false) {
                        return message.channel.send(NotBanned) 
                    }
                    else if (IsBanned == true) {
                        var PlayerReference = firebase.database().ref("Bans/"+UserId+"/")
                        PlayerReference.once("value", function(snapshot) {
                            console.log(snapshot.val().Moderator)
                            const Moderator = snapshot.val().Moderator
                            const Reason = snapshot.val().Reason   
                            return message.channel.send(Banned) 
                    
                        })
                
                    }
            
                })
        
            }
    
        }
    
        exec()
    } 
}; 
