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

  //Embed shit
  const Discord = require('discord.js');

  const GetError = new Discord.MessageEmbed()
  .setColor('992d22')
  .addFields(
      {name: 'Error!', value:"You forgot the username, please use this format: `!checkban [Username]`"}
  )

  const BanError = new Discord.MessageEmbed()
  .setColor('992d22')
  .addFields(
      {name: 'Error!', value:"You forgot the username, please use this format: `!ban [Username][banReason]`"}
  )
  const InvalidPermissions = new Discord.MessageEmbed()
	.setColor('#992d22')
	.addFields({ name: 'Error!', value: 'Insufficent Permissions.' });

  const UnbanError = new Discord.MessageEmbed()
  .setColor('992d22')
  .addFields(
      {name: 'Error!', value:"You forgot the username, please use this format: `!unban [Username]`"}
  )



  //Command shit

if (command == 'getban') {
    const suspect = args[0]
    if (!suspect) {
      return message.channel.send(GetError)
    }
    client.commands.get("getban").execute(suspect, message, firebase)
  }
	
  if (command === 'ban') {

    const suspect = args[0]
    const reason = args.slice(1).join(" "); 

    if(!message.member.roles.cache.some(role => role.name === banRole)) {
      return message.channel.send(InvalidPermissions)
    }

    if (!suspect) {
      return message.channel.send(BanError)
    }

    if (!reason) {
      return message.channel.send(BanError)
    }
    client.commands.get("ban").execute(suspect, reason, message, database)
    }

if (command === 'unban') {
  const suspect = args[0]

  if(!message.member.roles.cache.some(role => role.name === unbanRole)) {
    return message.channel.send(InvalidPermissions)
  }
	
  if (!suspect) {
    return message.channel.send(UnbanError)
  }
  client.commands.get("unban").execute(suspect, message, firebase)
  }  
})

client.login(botToken);
