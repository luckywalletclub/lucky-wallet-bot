require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');

// ======= EXPRESS + MONGODB SETUP =======
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

const userSchema = new mongoose.Schema({
  username: String,
  points: Number,
  click_count: Number
});

const User = mongoose.model('User', userSchema);

// 📌 Kullanıcı puan tıklaması
app.post('/click', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "username boş olamaz" });

  try {
    let user = await User.findOne({ username });

    if (!user) {
      user = new User({
        username,
        points: 0,
        click_count: 0
      });
    }

    const reward = Math.floor(Math.random() * 21) + 10;
    user.points += reward;
    user.click_count += 1;

    await user.save();

    res.json({
      message: "✅ Puan eklendi",
      reward,
      total: user.points
    });
  } catch (err) {
    console.error("❌ /click error:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// 📌 Lider tablosu
app.get('/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.find().sort({ points: -1 }).limit(10);
    res.json(topUsers);
  } catch (err) {
    console.error("❌ /leaderboard error:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// Sunucuyu başlat
app.listen(3001, () => {
  console.log('🟢 Express API listening on http://localhost:3001');
});

// ======= TELEGRAM BOT SETUP =======
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

console.log("🤖 Telegram bot çalışıyor...");
