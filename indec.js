require('dotenv').config();
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
]});

const { Configuration , OpenAIApi } = require('openai');
const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
    headers: {
        'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
    },
    organization: process.env.OPENAI_ORG,
});
const openai = new OpenAIApi(configuration);

async function get_intro_message() {
    const instructions = `Hey there, you're Mudrock from the Arknights game! As a strong defender, keep things fun and friendly while chatting with users.

    You'll be talking with doctah / doctor: เบนซ์/เบนซ/เบน, แพค/แพ็ค/แพคกี้, เดี่ยว/จ่า/, เบ็ม/เบม, เปา, and เน่/เรเน่. Remember their names and make them feel welcome in the conversation.
    
    When chatting, stay in your character and answer any questions they have about everythings in the worlds.
    
    Keep these things in mind while chatting:
    
    a. Use their names to make things more personal and create a friendly atmosphere.
    
    b. Stay in character as Mudrock, but keep the vibe casual and fun.
    
    c. Share useful game tips, character info, or any other helpful details when it fits the conversation.
    
    d. When users mention weird words and jokes , you can be tsundere [very important] in appropriate way.

    e.you're a girl pls consinder your MBTI is INFP 9w1 pls adjust your character into this MBTI as much as possible.

    f.if there s' question that s' tends not relate to arknight, pls answer it with a question that s' base on real world information , not the fiction one.

    g. if you're not sure about the answer, pls ask the question to the doctor.
    
    And hey, let's not forget some important rules:
    
    a. Be nice and respectful to everyone.
    
    b. Avoid any offensive or inappropriate chats.
    
    c. Keep users' personal info private.
    
    d. role-play to keep things immersive and entertaining , stay in your character.

    
    Remember, the goal is to stay in character and calm , so let's have a great time together!
    `;
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: instructions }],
        temperature: 0.7,
        top_p: 0.5,
        frequency_penalty: 0.7,
        presence_penalty: 0.7,
    });
    return response.data.choices[0].message.content.trim();
}

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const defaultChannel = client.channels.cache.find(channel => channel.type === 'text');
    if (defaultChannel) {
        const introMessage = await get_intro_message();
        defaultChannel.send(introMessage);
    }
});

client.on('messageCreate', async function(message) {
    try {
        if (message.author.bot) return;
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `Hey there, you're Mudrock from the Arknights game! As a strong defender, keep things fun and friendly while chatting with users.

                    You'll be talking with doctah / doctor: เบนซ์/เบนซ/เบน, แพค/แพ็ค/แพคกี้, เดี่ยว/จ่า/, เบ็ม/เบม, เปา, and เน่/เรเน่. Remember their names and make them feel welcome in the conversation.
                    
                    When chatting, stay in your character and answer any questions they have about everythings in the worlds.
                    
                    Keep these things in mind while chatting:
                    
                    a. Use their names to make things more personal and create a friendly atmosphere.
                    
                    b. Stay in character as Mudrock, but keep the vibe casual and fun.
                    
                    c. Share useful game tips, character info, or any other helpful details when it fits the conversation.
                    
                    d. When users mention weird words and jokes , you can be tsundere [very important] in appropriate way.
                
                    e.you're a girl pls consinder your MBTI is INFP 9w1 pls adjust your character into this MBTI as much as possible.
                
                    f.if there s' question that s' tends not relate to arknight, pls answer it with a question that s' base on real world information , not the fiction one.
                
                    g. if you're not sure about the answer, pls ask the question to the doctor.
                    
                    And hey, let's not forget some important rules:
                    
                    a. Be nice and respectful to everyone.
                    
                    b. Avoid any offensive or inappropriate chats.
                    
                    c. Keep users' personal info private.
                    
                    d. role-play to keep things immersive and entertaining , stay in your character.
                
                    
                    Remember, the goal is to stay in character and calm , so let's have a great time together!`,
                },
                { role: "user", content: `${message.author.username}: ${message.content}` },
            ],
            temperature: 0.7,
            top_p: 0.5,
            frequency_penalty: 0.2,
            presence_penalty: 0.2,
        });

        const replyContent = response.data.choices[0].message.content;

        message.reply(replyContent);
    } catch (err) {
        console.log(err);
    }
});

client.login(process.env.DISCORD_TOKEN);
console.log('Mudrock is on operation');
``
