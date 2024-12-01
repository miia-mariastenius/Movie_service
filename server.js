import express from "express"
import pg from "pg"
import dotenv from "dotenv"

dotenv.config()

const {Client} = pg

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.listen(3001, () => {
  console.log('Server is running!');  
})

const client = new Client()

connectDB()

async function connectDB() {

  try {
    await client.connect()
    console.log('Database connected...');
    
  } catch (error) {
    console.log(error.message);    
  }
  
}

app.get('/', (req, res) => {
  res.send('Welcome to the Movie API');
});

app.post('/genres', (req, res) => {
  const name = req.body.name

  res.status(201).json({ id: 1, name })
})

app.post('/movie', (req, res) => {
  const name = req.body.name
  const year = req.body.year
  const genreId = req.body.genreId

  res.status(201).json({ id: 1, name, year, genreId })
})

app.post('/register', (req, res) => {
  const name = req.body.name
  const username = req.body.username
  const password = req.body.password
  const birthYear = req.body.birthYear

  res.status(201).json({ id: 1, name, username, birthYear })
})

app.get('/movie/:id', (req, res) => {
  const id = req.params.id

  res.status(200).json({ id, name: "Example Movie", year: 2000, genreId: 1 })
})

app.delete('/movie/:id', (req, res) => {
  const id = req.params.id

  res.status(200).send({ message: `Deleted movie with ID: ${id}` });
})

app.get('/movies', (req, res) => {
  const movies = [
    {
      name: "Batman",
      year: 1989,
      genreId: 1
    },
    {
      name: "The Shawshank Redemption",
      year: 1994,
      genreId: 2
    },
    {
      name: "The Godfather",
      year: 1972,
      genreId: 2
    }
  ];

  res.status(200).json(movies);
})

app.get('/movie', (req, res) => {
  const keyword = req.query.keyword

  res.status(200).json([
    { id: 1, name: `Movie matching "${keyword}"`, year: 1990, genreId: 1 },
  ])
})

app.post('/review', (req, res) => {
  const username = req.body.username
  const movieId = req.body.movieId
  const stars = req.body.stars
  const desc = req.body.desc

  res.status(201).json({ id: 1, username, movieId, stars, desc })
})

app.post('/favorite', (req, res) => {
  const username = req.body.username
  const movieId = req.body.movieId

  res.status(201).json({ id: 1, username, movieId })
})

app.get('/favorites', (req, res) => {
  const username = req.query.username

  res.status(200).json([
    { id: 1, movieId: 1, username },
    { id: 2, movieId: 2, username },
  ])
})