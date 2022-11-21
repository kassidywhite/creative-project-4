const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/test', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const entrySchema = new mongoose.Schema({
  mood: String,
  entry: String,
});

entrySchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
});
  
entrySchema.set('toJSON', {
  virtuals: true
});

const Entry = mongoose.model('Entry', entrySchema);

app.get('/api/entries', async (req, res) => {
  try {
    let entries = await Entry.find();
    res.send({entries: entries});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/entries', async (req, res) => {
    const entry = new Entry({
    mood: req.body.mood,
    entry: req.body.entry
  });
  try {
    await entry.save();
    res.send({entry:entry});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/entries/:id', async (req, res) => {
  try {
    await Entry.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));