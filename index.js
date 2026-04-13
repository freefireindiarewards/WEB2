const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

// Aapka Token yahan set hai
const BOT_TOKEN = '8788584544:AAG-9N97opno83x3hwYIdYkZ3cJTRT9SRcM'; 

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const DB_FILE = 'users_data.json';

// Data load function
function loadData() {
    if (!fs.existsSync(DB_FILE)) return {};
    try {
        const content = fs.readFileSync(DB_FILE);
        return JSON.parse(content);
    } catch (e) {
        return {};
    }
}

// Data save function
function saveData(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 
    `🔥 *FLOW GUILD BOT LIVE* 🔥\n\n` +
    `Hello ${msg.from.first_name || 'Owner'},\n\n` +
    `Commands:\n` +
    `1️⃣ /add_guild <ID> - Guild ID save karein\n` +
    `2️⃣ /my_guild - Apni ID check karein\n` +
    `3️⃣ /glory - Check Guild Status`, 
    { parse_mode: 'Markdown' });
});

bot.onText(/\/add_guild (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const guildId = match[1];
    let data = loadData();

    data[chatId] = {
        guild_id: guildId,
        username: msg.from.username || "User",
        added_on: new Date().toLocaleString()
    };

    saveData(data);
    bot.sendMessage(chatId, `✅ *Success!* Guild ID \`${guildId}\` save ho gayi hai.`, { parse_mode: 'Markdown' });
});

bot.onText(/\/my_guild/, (msg) => {
    const chatId = msg.chat.id;
    let data = loadData();

    if (data[chatId]) {
        bot.sendMessage(chatId, `🏆 Aapki ID: \`${data[chatId].guild_id}\``, { parse_mode: 'Markdown' });
    } else {
        bot.sendMessage(chatId, `❌ Koi Guild set nahi hai. /add_guild use karein.`);
    }
});

bot.onText(/\/glory/, (msg) => {
    const chatId = msg.chat.id;
    let data = loadData();

    if (!data[chatId]) {
        return bot.sendMessage(chatId, "❌ Pehle /add_guild karein.");
    }

    bot.sendMessage(chatId, `🔍 *Guild Info* 🔍\n\nID: \`${data[chatId].guild_id}\`\nStatus: Online\nGlory: Fetching...`, { parse_mode: 'Markdown' });
});

console.log("FLOW Bot is running...");
