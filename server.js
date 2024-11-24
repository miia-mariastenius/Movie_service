import express from "express"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.listen(3001, () => {
  console.log('Server is running!');  
})

app.get('/', (req, res) => {
  res.send('Welcome to the Movie API');
});

app.post('/genres', (req, res) => {
  const name = req.body.name

  res.status(201).send({ message: `Genre ${name} endpoint reached.` })
})

app.post('/movie', (req, res) => {
  const name = req.body.name
  const year = req.body.year
  const genreId = req.body.genreId

  res.status(200).send({ message: `Movie ${name} (${year}) with genreId ${genreId} endpoint reached.` })
})

app.post('/register', (req, res) => {
  const name = req.body.name
  const username = req.body.username
  const password = req.body.password
  const birthYear = req.body.birthYear

  res.status(201).send({ message: `User ${name} with username ${username} endpoint reached.` })
})

app.get('/movie/:id', (req, res) => {
  const id = req.params.id

  res.status(200).send({ message: `Fetched movie with ID: ${id}` })
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
      genreId: "1"
    },
    {
      name: "The Shawshank Redemption",
      year: 1994,
      genreId: "2"
    },
    {
      name: "The Godfather",
      year: 1972,
      genreId: "2"
    }
  ];

  res.status(200).json(movies);
})

app.get('/movie', (req, res) => {
  const keyword = req.query.keyword

  res.status(200).send({ message: `Searched movies with keyword: ${keyword}` })
})

app.post('/review', (req, res) => {
  const username = req.body.username
  const movieId = req.body.movieId
  const stars = req.body.stars
  const desc = req.body.desc

  res.status(201).send({ message: `Review added by ${username} for movie ${movieId} with ${stars} stars.` })
})

app.post('/favorite', (req, res) => {
  const username = req.body.username
  const movieId = req.body.movieId

  res.status(201).send({ message: `Movie ${movieId} added to ${username}'s favorites.` })
})

app.get('/favorites', (req, res) => {
  const username = req.query.username

  res.status(200).send({ message: `Fetched favorites for username: ${username}` })
})