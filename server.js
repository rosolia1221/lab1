require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;



// Definiera dbHost och dbName
const dbHost = 'localhost:27017';
const dbName = 'recipesDatabase';
const connectionString = `mongodb://${dbHost}/${dbName}`;

mongoose.connect(connectionString);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Anslutningsfel:'));
db.once('open', function() {
  console.log('Ansluten till databasen!');
});

app.use(bodyParser.json());
// CORS Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
//  static files from public directory
app.use(express.static('public'));

//index.html on the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Definierar ett schema och en modell för "recipes"
const recipeSchema = new mongoose.Schema({
  title: String,
  ingredients: [String],
  instructions: [String],
  cookingTime: Number,
});

const Recipe = mongoose.model('Recipe', recipeSchema);




// CRUD-endpunkter
app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/recipes/:title', async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ title: req.params.title });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/recipes', async (req, res) => {
  const recipe = new Recipe({
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    cookingTime: req.body.cookingTime,
  });

  try {
    const existingRecipe = await Recipe.findOne({ title: recipe.title });
    if (existingRecipe) {
      return res.status(409).json({ message: 'Recipe already exists' });
    }
    const newRecipe = await recipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    Object.assign(recipe, req.body);
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
app.delete('/api/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Startar servern
app.listen(port, () => {
  console.log(`Servern körs på http://localhost:${port}`);
});
