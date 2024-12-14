import express from "express"
import dotenv from "dotenv"
import { pgPool } from "./pg_connection.js"

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.listen(3001, () => {
  console.log('Server is running!')
})


app.get('/', (req, res) => {
  res.send('Welcome to the Movie API')
})

// Add a new genre
app.post("/genres", async (req, res) => {
  const name = req.body.name
  const result = await pgPool.query(
    "INSERT INTO movie_genre (genre_name) VALUES ($1) RETURNING *",
    [name]
  )
  res.status(201).json(result.rows[0])
})

// Add a new movie
app.post("/movie", async (req, res) => {
  const { name, year, genreId } = req.body
  const result = await pgPool.query(
    "INSERT INTO movie (title, year, genre_id) VALUES ($1, $2, $3) RETURNING *",
    [name, year, genreId]
  )
  res.status(201).json(result.rows[0])
})

// Register a new user
app.post("/register", async (req, res) => {
  const { name, username, password, birthYear } = req.body
  const result = await pgPool.query(
    "INSERT INTO movie_user (name, username, password, year_of_birth) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, username, password, birthYear]
  )
  res.status(201).json(result.rows[0])
})

// Get a movie by ID
app.get("/movie/:id", async (req, res) => {
  const id = req.params.id
  const result = await pgPool.query("SELECT * FROM movie WHERE id = $1", [id])
  res.status(200).json(result.rows[0])
})

// Delete a movie by ID
app.delete("/movie/:id", async (req, res) => {
  const id = req.params.id
  try {
    await pgPool.query('DELETE FROM movies WHERE id = $1', [id])
    res.status(200).send({ message: `Deleted movie with ID: ${id}` })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: "Failed to delete movie" })
  }
})

// Get all movies
app.get("/movies", async (req, res) => {
  const result = await pgPool.query("SELECT * FROM movie")
  res.status(200).json(result.rows)
})

// Search movies by a keyword
app.get("/movie", async (req, res) => {
  const keyword = req.query.keyword
  const result = await pgPool.query(
    "SELECT * FROM movie WHERE title ILIKE $1",
    [`%${keyword}%`]
  )
  res.status(200).json(result.rows)
})

// Add a review
app.post("/review", async (req, res) => {
  const { username, movieId, stars, desc } = req.body

  // Find user ID by username
  const userResult = await pgPool.query(
    "SELECT id FROM movie_user WHERE username = $1",
    [username]
  )
  const userId = userResult.rows[0].id

  // Insert review into the database
  const result = await pgPool.query(
    "INSERT INTO movie_review (user_id, movie_id, stars, review_text) VALUES ($1, $2, $3, $4) RETURNING *",
    [userId, movieId, stars, desc]
  )
  res.status(201).json(result.rows[0])
})

// Add a movie to favorites
app.post("/favorite", async (req, res) => {
  const { username, movieId } = req.body

  // Find user ID by username
  const userResult = await pgPool.query(
    "SELECT id FROM movie_user WHERE username = $1",
    [username]
  )
  const userId = userResult.rows[0].id

  // Add favorite movie to the database
  const result = await pgPool.query(
    "INSERT INTO favorite_movie (user_id, movie_id) VALUES ($1, $2) RETURNING *",
    [userId, movieId]
  )
  res.status(201).json(result.rows[0])
})

// Get all favorite movies for a user
app.get("/favorites", async (req, res) => {
  const username = req.query.username

  // Find user ID by username
  const userResult = await pgPool.query(
    "SELECT id FROM movie_user WHERE username = $1",
    [username]
  )
  const userId = userResult.rows[0].id

  // Fetch favorite movies
  const result = await pgPool.query(
    "SELECT movie.* FROM favorite_movie JOIN movie ON favorite_movie.movie_id = movie.id WHERE favorite_movie.user_id = $1",
    [userId]
  )
  res.status(200).json(result.rows)
})