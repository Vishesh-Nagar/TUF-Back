const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const Snippet = mongoose.model('Snippet', new mongoose.Schema({
  username: String,
  codeLanguage: String,
  stdin: String,
  sourceCode: String,
  timestamp: { type: Date, default: Date.now },
}));

app.post('/submit', async (req, res) => {
  const { username, codeLanguage, stdin, sourceCode } = req.body;
  try {
    const newSnippet = new Snippet({ username, codeLanguage, stdin, sourceCode });
    await newSnippet.save();
    res.status(201).send('Snippet submitted successfully');
  } catch (error) {
    res.status(500).send('Error submitting snippet');
  }
});

app.get('/snippets', async (req, res) => {
  try {
    const snippets = await Snippet.find();
    res.json(snippets);
  } catch (error) {
    res.status(500).send('Error fetching snippets');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
