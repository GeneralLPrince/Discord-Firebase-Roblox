var firebase = require('firebase')

const dotconfig = require('dotenv').config();

const fs = require('fs');
const discord = require("discord.js");
const client = new discord.Client();

const botToken = process.env.TOKEN

client.commands = new discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const http = require("http");
http.createServer((_, res) => res.end("Alive")).listen(8080)

const nbx = require('noblox.js');

//--------------Edit here--------------//

const banRole = 'Moderator' 
const unbanRole = 'Moderator'
const prefix = '!'
const botStatus = 'Developed by GeneralLPrince' 

//-------------------------------------//

client.on("ready", () => {
  console.log("Bot online");
  client.user.setPresence({ activity: { name: botStatus }, status: 'online' });
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

    const suspect = args[0]
    const reason = args.slice(1).join(" "); 

    if(!message.member.roles.cache.some(role => role.name === banRole)) {
      return message.channel.send("You do not have permissions to run the command. Role required: `"+banRole+"`")
    }

    if (!suspect) {
      return message.channel.send("You forgot the username, please use this format: `!ban [Username][banReason]`")
    }

    if (!reason) {
      return message.channel.send("You forgot the ban reason, please use this format: `!ban [Username][banReason]`")
    }
    client.commands.get("ban").execute(suspect, reason, message, database)
    }

if (command === 'unban') {
  const suspect = args[0]

  if(!message.member.roles.cache.some(role => role.name === unbanRole)) {
    return message.channel.send("You do not have permissions to run the command. Role required: `"+banRole+"`")
  }

  	
  if (command == 'getban') {
    const suspect = args[0]
    if (!suspect) {
      return message.channel.send("You forgot the username, please use this format: `!checkban [Username]`")
    }
    client.commands.get("getban").execute(suspect, message, firebase)
  }
	
  if (!suspect) {
    return message.channel.send("You forgot the username, please use this format: `!unban [Username]`")
  }
  client.commands.get("unban").execute(suspect, message, firebase)
  }  
})

client.login(botToken);
