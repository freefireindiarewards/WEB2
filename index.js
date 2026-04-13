const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

// Bot Token: GitHub par daalne ke baad Vercel Settings mein 'BOT_TOKEN' add karein
const BOT_TOKEN = process.env.BOT_TOKEN; 

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const DB_FILE = 'users_data.json';

// Helper function: Data load karna
function loadData() {
    if (!fs.existsSync(DB_FILE)) return {};
    try {
        return JSON.parse(fs.readFileSync(DB_FILE));
    } catch (e) {
        return {};
    }
}

// Helper function: Data save karna
function saveData(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// /start command
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 
    `🔥 *FLOW GUILD BOT* 🔥\n\n` +
    `Commands:\n` +
    `1️⃣ /add_guild <ID> - Apni Guild ID set karein\n` +
    `2️⃣ /my_guild - Apni set ki hui ID dekhein\n` +
    `3️⃣ /glory - Guild ki status check karein`, 
    { parse_mode: 'Markdown' });
});

// /add_guild <ID> command
bot.onText(/\/add_guild (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const guildId = match[1];
    let data = loadData();

    data[chatId] = {
        guild_id: guildId,
        username: msg.from.username || "Unknown",
        added_on: new Date().toLocaleString()
    };

    saveData(data);
    bot.sendMessage(chatId, `✅ *Success!* Guild ID \`${guildId}\` save ho gayi hai.`, { parse_mode: 'Markdown' });
});

// /my_guild command
bot.onText(/\/my_guild/, (msg) => {
    const chatId = msg.chat.id;
    let data = loadData();

    if (data[chatId]) {
        bot.sendMessage(chatId, `🏆 Aapki Guild ID: \`${data[chatId].guild_id}\``, { parse_mode: 'Markdown' });
    } else {
        bot.sendMessage(chatId, `❌ Aapne koi Guild add nahi ki. /add_guild use karein.`);
    }
});

// /glory command (Current Logic: Shows local info)
bot.onText(/\/glory/, (msg) => {
    const chatId = msg.chat.id;
    let data = loadData();

    if (!data[chatId]) {
        return bot.sendMessage(chatId, "❌ Pehle /add_guild karein.");
    }

    bot.sendMessage(chatId, `🔍 Fetching data for Guild ID: ${data[chatId].guild_id}...\n\n(Note: Connect your Python API for real-time glory)`);
});

console.log("Bot is running...");
