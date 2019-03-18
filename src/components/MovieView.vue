<template>
  <div class="movie-view" @click="$emit('close')">
    <div class="movie-view__box" @click.stop>
      <button class="movie-view__close" @click="$emit('close')"></button>
      <section class="movie">
        <div class="movie__container" v-if="movieLoaded">
          <header class="movie__header" :style="{ 'background-image': 'url(' + moviePosterSrc + ')' }">
          </header>
          <div class="movie__main">
            <div class="movie__title">
              <h1 class="movie__title-text">
                {{ movie.title }}
                <span v-if="movie.tagline">{{ movie.tagline }}</span>
              </h1>
            </div>
            <div class="movie__wrap movie__wrap--main">
              <div class="movie__info">
                <div v-if="movie.overview" class="movie__description">
                  {{ movie.overview }}
                </div>
                <div v-if="Director" class="movie__details-block">
                    <h2 class="movie__details-title">
                      Directed by
                    </h2>
                     {{Director}}
                  </div>
                <div class="movie__details">
                  <div v-if="movie.genres.length" class="movie__details-block">
                    <h2 class="movie__details-title">
                      Genres
                    </h2>
                    <div class="movie__details-text">
                      {{ nestedDataToString(movie.genres) }}
                    </div>
                  </div>
                  <div v-if="movie.release_date" class="movie__details-block">
                    <h2 class="movie__details-title">
                      Release Date
                    </h2>
                    <div class="movie__details-text" v-formatDate="movie.release_date"></div>
                  </div>
                   <div v-if="cast" class="movie__details-block">
                    <h2 class="movie__details-title">
                      Cast
                    </h2>
                    <li v-for="(actor, index) in cast.slice(0,4)">
                      {{ actor.name}}
                    </li>
                  </div>
                   <div v-if="trailer" class="movie__details-block">
                    <h2 class="movie__details-title">
                      Trailer
                    </h2>
                    <a href="" v-on:click.stop.prevent="openWindow()">Link to trailer</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <i class="loader"></i>
  </div>
</template>

<script>
import data from '../data.js'
import formatDate from '../directives/v-formatDate.js'
import img from '../directives/v-image.js'

export default {
  props: ['id'],
  directives: {
    img: img,
    formatDate: formatDate
  },
  data () {
    return {
      movie: {},
      movieLoaded: false,
      moviePosterSrc: '',
      movieBackdropSrc: '',
      cast: '',
      Director: '',
      trailer: ''
    }
  },
  methods: {
    fetchMovie (id) {
      let url = `https://api.themoviedb.org/3/movie/${id}?api_key=${data.apiKey}&language=en-US&append_to_response=videos`
      // GET
      this.$http.get(url).then(response => {
        // get body data
        if (response.status === 200) {
          let movie = response.body
          this.movie = movie
          this.poster()
          this.backdrop()
          this.movieLoaded = true
          this.trailer = 'https://www.youtube.com/watch?v=' + movie.videos.results[0].key
          this.getCast(id)
        }
      }, response => {
        // error callback
        if (response.status === 404) {
          console.log(response.body)
          this.movieLoaded = false
        }
      })
    },
    getCast (id) {
      let castUrl = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${data.apiKey}&language=en-US`
      // GET
      this.$http.get(castUrl).then(response => {
        // get body data
        if (response.status === 200) {
          this.cast = response.body.cast
          let person = 0
          for (var crew of response.body.crew) {
            if (crew.job === 'Director') {
              person++
              if (person <= 1) {
                this.Director = crew.name
              } else {
                let newData = this.Director + ', ' + crew.name
                this.Director = newData
              }
            }
          }
        }
      }, response => {
        // error callback
        if (response.status === 404) {
          console.log(response.body)
          this.movieLoaded = false
        }
      })
    },
    poster () {
      if (this.movie.poster_path) {
        this.moviePosterSrc = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + this.movie.poster_path
      }
    },
    backdrop () {
      if (this.movie.backdrop_path) {
        this.movieBackdropSrc = 'https://image.tmdb.org/t/p/w500' + this.movie.backdrop_path
      }
    },
    nestedDataToString (data) {
      let nestedArray = []
      let resultString = ''
      data.forEach((item) => nestedArray.push(item.name))
      resultString = nestedArray.join(', ')
      return resultString
    },
    openWindow () {
      console.log(this.trailer)
      window.open(this.trailer)
    }
  },
  created () {
    this.fetchMovie(this.id)
    window.addEventListener('keyup', function (e) {
      if (e.keyCode === 27) {
        this.$emit('close')
      }
    }.bind(this))
  }
}
</script>

<style>
.movie-view {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  width: 100%;
  height: 100vh;
  background: linear-gradient( rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8) );
  -webkit-overflow-scrolling: touch;
  overflow: auto;
}
.movie-view__box {
  width: 100%;
  max-width: 768px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10%;
  position: relative;
  z-index: 5;
  background: white;
  padding-bottom: 50px;
}
.movie-view__close {
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  border: 0;
  background: transparent;
  width: 40px;
  height: 40px;
  z-index: 9;
  transition: background 0.5s ease;
  cursor: pointer;
}
.movie-view__close:before, .movie-view__close:after {
  content: "";
  display: block;
  position: absolute;
  top: 19px;
  left: 10px;
  width: 20px;
  height: 2px;
  background: black;
}
.movie-view__close:before {
  transform: rotate(45deg);
}
.movie-view__close:after {
  transform: rotate(-45deg);
}
.movie-view__close:hover {
  background: #01d277;
}
.movie__wrap {
  display: flex;
}
.movie__wrap--page {
  max-width: 768px;
  position: relative;
  margin: 0 auto;
}
.movie__wrap--header {
  align-items: center;
  height: 100%;
}
.movie__wrap--main {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}
.movie__header {
  height: 550px;
  position: relative;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-color: white;
}

.movie__title {
  position: relative;
  padding: 20px;
  color: #01d277;
  text-align: center;
  width: 100%;
}
.movie__title-text {
  font-weight: 500;
  line-height: 1.4;
  font-size: 24px;
}
.movie__title-text span {
  display: block;
  font-size: 14px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 10px;
}
.movie__main {
  background: white;
}
.movie__actions {
  text-align: center;
  width: 100%;
  order: 2;
  padding: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}
.movie__actions-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.5);
  transition: color 0.5s ease;
  font-size: 11px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.movie__actions-link:hover {
  color: rgba(0, 0, 0, 0.75);
}
.movie__actions-link.active {
  color: #081c24;
}
.movie__actions-icon {
  width: 16px;
  height: 16px;
  margin: 0 10px 0 0;
  fill: rgba(0, 0, 0, 0.5);
  transition: fill 0.5s ease, transform 0.5s ease;
}
.movie__actions-icon.waiting {
  transform: scale(0.8, 0.8);
}
.movie__actions-link:hover .movie__actions-icon {
  fill: rgba(0, 0, 0, 0.75);
}
.movie__actions-link.active .movie__actions-icon {
  fill: #01d277;
}
.movie__actions-text {
  display: block;
  padding-top: 2px;
}
.movie__info {
  width: 100%;
  padding: 20px;
  order: 1;
}
.movie__actions + .movie__info {
  margin-left: 0;
}
.movie__description {
  font-weight: 300;
  font-size: 13px;
  line-height: 1.8;
  margin-bottom: 20px;
}
.movie__details-block:not(:last-child) {
  margin-bottom: 20px;
}
.movie__details-title {
  margin: 0;
  font-weight: 400;
  text-transform: uppercase;
  font-size: 14px;
  color: #01d277;
}
.movie__details-text {
  font-weight: 300;
  font-size: 14px;
  margin-top: 5px;
}
</style>
