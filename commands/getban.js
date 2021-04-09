module.exports = {
	name: 'getban',
	description: 'Getban command',
	
    execute(suspect, message, firebase) {
        const nbx = require('noblox.js');

        async function exec() {
            const UserId = await nbx.getIdFromUsername(suspect).catch(e => "User not found");

            if (UserId == "User not found") {
                message.channel.send({
                    embed: {
                        "type": "rich",
                        "color": 3092790,					
                        "title": "",
                        "description": "We couldn't find the Roblox account, are you sure you typed out your username correctly? Try again please.",
                    }
                })
            }
            else {
                var Reference = firebase.database().ref("Bans/")
                Reference.once("value").then(function(snapshot) {
                    var IsBanned = snapshot.child(UserId).hasChildren()

                    if (IsBanned == false) {
                        message.channel.send({
                            embed: {
                                "type": "rich",
                                "color": 3092790,					
                                "title": "",
                                "description": suspect+" isn't banned",
                            }
                        }) 
                    }
                    else if (IsBanned == true) {
                        Reference.once("value", function(snapshot) {
                            snapshot.forEach(function(childSnapshot) {
                                const Moderator = childSnapshot.val().Moderator
                                const Reason = childSnapshot.val().Reason
                                message.channel.send({
                                    embed: {
                                        "type": "rich",
                                        "color": 3092790,					
                                        "title": "",
                                        "description": "**Username: **"+suspect+"**\nReason:** "+Reason+"\n**Moderator:** "+Moderator,
                                    }
                                })   
                            })
                        })
                    }
                })
            }
        }
        exec()
    }
}; 
