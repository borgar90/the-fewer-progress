const express = require('express');
const { MongoClient } = require('mongodb');
const { Client, Intents } = require('discord.js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const discordClient = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

async function connectToMongo() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToMongo();

app.get('/api/progress', async (req, res) => {
  try {
    const database = client.db('wow_progress');
    const collection = database.collection('raid_progress');
    const progress = await collection.find({}).toArray();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching progress data' });
  }
});

app.post('/api/progress', async (req, res) => {
  try {
    const { boss, progress } = req.body;
    const database = client.db('wow_progress');
    const collection = database.collection('raid_progress');
    await collection.updateOne({ boss }, { $set: { progress } }, { upsert: true });
    res.json({ message: 'Progress updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating progress data' });
  }
});

discordClient.on('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.on('messageCreate', async (message) => {
  if (message.content.startsWith('!updateprogress')) {
    const args = message.content.split(' ');
    if (args.length !== 3) {
      return message.reply('Usage: !updateprogress <boss> <progress>');
    }
    const boss = args[1];
    const progress = parseInt(args[2]);
    
    try {
      const database = client.db('wow_progress');
      const collection = database.collection('raid_progress');
      await collection.updateOne({ boss }, { $set: { progress } }, { upsert: true });
      message.reply(`Progress for ${boss} updated to ${progress}%`);
    } catch (error) {
      message.reply('Error updating progress data');
    }
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

discordClient.login(process.env.DISCORD_TOKEN);