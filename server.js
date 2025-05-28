// server.js
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve your website
app.use(express.static(path.join(__dirname, 'public')));

// Discord Bot
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

let presenceCount = 0;

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  const guild = await client.guilds.fetch('1357063194895454490');
  setInterval(async () => {
    try {
      const updated = await guild.fetch();
      const counts = await guild.fetchPreview();
      presenceCount = counts.approximatePresenceCount;
    } catch (e) {
      console.error('Failed to update member count:', e);
    }
  }, 60000);
});

client.login(process.env.BOT_TOKEN);

// API to provide member count to frontend
app.get('/api/member-count', (req, res) => {
  res.json({ count: presenceCount });
});

app.listen(PORT, () => {
  console.log(`Website + Bot running on http://localhost:${PORT}`);
});
