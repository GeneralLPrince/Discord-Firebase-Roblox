var firebase = require('firebase')

const dotconfig = require('dotenv').config();

const discord = require("discord.js");
const client = new discord.Client();

const botToken = process.env.TOKEN

const nbx = require('noblox.js');

const http = require("http");
http.createServer((_, res) => res.end("Ooooo! HTTP working, nice work I guess?")).listen(8080)

//--------------Edit here--------------//

const banRole = 'Moderator' 
const unbanRole = 'Moderator'
const prefix = '!'
const botStatus = 'Developed by GeneralLPrince'

//-------------------------------------//

client.on("ready", () => {
  console.log("Bot online");
  client.user.setPresence({ activity: { name: botStatus }, status: 'online' })
});

var config = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  storageBucket: "bucket.appspot.com"
}

firebase.initializeApp(config);
var database = firebase.database();

client.on("message", message => {  
  if (message.author.bot) return;
  
  if (message.content.indexOf(prefix) !== 0) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === 'ban') {

    const victim = args[0]
    const reason = args.slice(1).join(" "); 

    if(!message.member.roles.cache.some(role => role.name === banRole)) {
      return message.channel.send("You do not have permissions to run the command. Role required: `"+banRole+"`")
    }

    if (!victim) {
      return message.channel.send("You forgot the username, please use this format: `!ban [Username][banReason]`")
    }

    if (!reason) {
      return message.channel.send("You forgot the ban reason, please use this format: `!ban [Username][banReason]`")
    }

    async function exec() {
      const userId = await nbx.getIdFromUsername(victim).catch(e => "User not found");
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
    }

if (command === 'unban') {
  const unbanPlayer = args[0]

  if(!message.member.roles.cache.some(role => role.name === unbanRole)) {
    return message.channel.send("You do not have permissions to run the command. Role required: `"+banRole+"`")
  }

  if (!unbanPlayer) {
    return message.channel.send("You forgot the username, please use this format: `!unban [Username]`")
  }

  async function exec() {
    const userId = await nbx.getIdFromUsername(unbanPlayer).catch(e => "User not found");
    if (userId !== "User not found") {
      const playerName = await nbx.getUsernameFromId(userId)
      var ref = firebase.database().ref("Bans/"+userId);
      ref.remove()
      .then(function() {
        message.channel.send("`"+playerName+"` has been unbanned.")
        })
      }
    }
    exec()
  }  
})

client.login(botToken);
