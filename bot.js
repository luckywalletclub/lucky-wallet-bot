require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `👋 Hoş geldin ${msg.from.first_name}!\nLuck Wallet Club'a giriş yaptın.`
  );
});

bot.onText(/\/wallet/, (msg) => {
  const rewards = [0, 5, 10, 15, 20];
  const reward = rewards[Math.floor(Math.random() * rewards.length)];

  bot.sendMessage(
    msg.chat.id,
    `💼 Cüzdanını tıkladın ve ${reward} puan kazandın!`
  );
});
