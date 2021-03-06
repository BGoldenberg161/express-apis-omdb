require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const app = express();
const axios = require('axios')

let API_KEY = process.env.API_KEY

// Sets EJS as the view engine
app.set('view engine', 'ejs');
// Specifies the location of the static assets folder
app.use(express.static('static'));
// Sets up body-parser for parsing form data
app.use(express.urlencoded({ extended: false }));
// Enables EJS Layouts middleware
app.use(ejsLayouts);

// Adds some logging to each request
app.use(require('morgan')('dev'));

app.use(express.static('static'))

// Routes
app.get('/', function(req, res) {
  res.render('index');
});

app.get('/results', (req, res) => {
  let movie = req.query.movie
  let qs = {
      params: {
          s: movie,
          apikey: API_KEY
      }
  }

  axios.get('http://www.omdbapi.com', qs)
  .then((response) => {
      let matches = response.data.Search
      res.render('results', {movies: matches})
      // console.log(matches)
  })
  .catch(err => {
      console.log(err)
  })
})

app.get('/movies/:movie_id', (req, res) => {
  let imdbID = req.params.movie_id
  let qs = {
      params: {
          i: imdbID,
          apikey: API_KEY
      }
  }

  axios.get('http://www.omdbapi.com', qs)
  .then((response) => {
    let movieData = response.data
    res.render('detail', {data: movieData})
    // console.log(movieData)
  })
  .catch(err => {
      console.log(err)
  })
})

// The app.listen function returns a server handle
let server = app.listen(process.env.PORT || 3000);

// We can export this server to other servers like this
module.exports = server;
