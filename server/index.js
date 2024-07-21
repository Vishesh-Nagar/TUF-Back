const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

console.log('Loaded Environment Variables:', process.env);
console.log('MONGODB_URI:', process.env.MONGODB_URI);

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env file');
  process.exit(1);
}

const mongoUri = process.env.MONGODB_URI;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Connection error:', error);
  });

  const snippetSchema = new mongoose.Schema({
    username: String,
    codeLanguage: String,
    stdin: String,
    sourceCode: String,
    timestamp: { type: Date, default: Date.now },
  });
  

const Snippet = mongoose.model('Snippet', snippetSchema);

app.post('/submit', async (req, res) => {
  const { username, codeLanguage, stdin, sourceCode } = req.body;
  const snippet = new Snippet({ username, codeLanguage, stdin, sourceCode });
  try {
    await snippet.save();
    res.send('Snippet submitted!');
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/snippets', async (req, res) => {
  try {
    const snippets = await Snippet.find({}, 'username codeLanguage stdin sourceCode timestamp');
    res.json(snippets);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
