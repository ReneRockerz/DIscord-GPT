

require('dotenv').config()
const axios = require('axios');
const headers = {
    'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
    'Content-Type': 'application/json'
  };

const Discord = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]})

const { Configuration , OpenAIApi } = require('openai');
const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
    headers: {
        'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
    },
    organization: process.env.OPENAI_ORG,
});
const openai = new OpenAIApi(configuration);

client.on('messageCreate', async function(message) {
    try {
      if (message.author.bot) return;
      const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: `${message.author.username}: ${message.content}` }],
        })
        
      const replyContent = response.data.choices[0].message.content;
  
  
      message.reply(replyContent);
    } catch (err) {
      console.log(err);
    }
  });
  

client.login(process.env.DISCORD_TOKEN);
console.log('Mudrock is on operation');