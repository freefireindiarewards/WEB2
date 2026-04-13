cat <<EOF > index.js
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');

const BOT_TOKEN = '8788584544:AAG-9N97opno83x3hwYIdYkZ3cJTRT9SRcM';
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Token fetch karne ka logic (Code se nikala gaya)
async function getLiveToken() {
    try {
        const r = await axios.get('https://tokens-asfufvfshnfkhvbb.francecentral-01.azurewebsites.net/ReQuesT?&type=ToKens');
        const text = r.data;
        const match = text.match(/ToKens : \[(.*?)\]/);
        if (match) {
            const tokens = match[1].replace(/['"\s]/g, '').split(',');
            return tokens[Math.floor(Math.random() * tokens.length)];
        }
    } catch (e) { return null; }
}

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "🎯 *FLOW PHANTOM V2 ONLINE*\n\nCommands:\n/info <UID> - Get Full Player/Guild Data\n/glory <UID> - Check Glory Status", { parse_mode: 'Markdown' });
});

bot.onText(/\/info (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const uid = match[1];
    bot.sendMessage(chatId, "🔍 Player Data Fetch ho raha hai...");

    const liveToken = await getLiveToken();
    if (!liveToken) return bot.sendMessage(chatId, "❌ Server Busy: Token nahi mila.");

    // Note: C4 logic encryption use karta hai, yahan hum unke API bridge ko hit karenge
    try {
        const response = await axios.get(\`https://tokens-asfufvfshnfkhvbb.francecentral-01.azurewebsites.net/ReQuesT?id=\${uid}&type=likes\`);
        const data = response.data;
        
        // Data format clean karna (Regex use karke)
        const name = data.match(/PLayer NamE\s*:\s*(.*)/)?.[1] || "Unknown";
        const server = data.match(/PLayer SerVer\s*:\s*(.*)/)?.[1] || "Unknown";
        const likes = data.match(/LiKes After\s*:\s*(\d+)/)?.[1] || "0";

        let reply = "👤 *PLAYER PROFILE*\n\n";
        reply += "📝 Name: " + name + "\n";
        reply += "🆔 UID: " + uid + "\n";
        reply += "🌍 Server: " + server + "\n";
        reply += "❤️ Total Likes: " + likes + "\n";
        
        bot.sendMessage(chatId, reply, { parse_mode: 'Markdown' });
    } catch (err) {
        bot.sendMessage(chatId, "❌ Error: ID galat hai ya server down hai.");
    }
});

console.log("FLOW PHANTOM BOT V2 IS READY!");
EOF
