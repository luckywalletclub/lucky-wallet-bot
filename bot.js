require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, `👋 Hoş geldin ${msg.from.first_name}!\nLuck Wallet Club'a giriş yaptın.\n\n🎮 Oyuna başlamak için aşağıdaki butona tıkla:`, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "💼 Tıkla ve Puan Kazan!",
            web_app: {
              url: "https://luck-wallet-ui.vercel.app"
            }
          }
        ]
      ]
    }
  });
});


bot.onText(/\/wallet/, (msg) => {
  const rewards = [0, 5, 10, 15, 20];
  const reward = rewards[Math.floor(Math.random() * rewards.length)];

  bot.sendMessage(
    msg.chat.id,
    `💼 Cüzdanını tıkladın ve ${reward} puan kazandın!`
  );
});
