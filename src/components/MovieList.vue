<template>
  <div class="wrapper" v-if="listLoaded">
    <div class="movies" v-if="movies.length">
      <ul class="movies__list">
        <movie-list-item class="movies__item" v-for="(movie, index) in movies" :movie="movie"></movie-list-item>
      </ul>
       <b-button variant="primary" @click="loadMore" class="button">Load More</b-button>
    </div>
    <i v-if="!listLoaded" class="loader"></i>
    <section v-if="!movies.length" class="not-found">
      <div class="not-found__content">
        <h2 class="not-found__title" v-if="mode == 'search'">Nothing Found</h2>
      </div>
    </section>
  </div>
</template>

<script>
import MovieListItem from './MovieListItem.vue'
import data from '../data.js'

export default {
  props: ['mode'],
  name: 'MovieList',
  components: { MovieListItem },
  data () {
    return {
      listTitle: '',
      movies: [],
      pages: '',
      results: '',
      currentPage: 1,
      listLoaded: false
    }
  },
  computed: {
    query () {
      return this.$route.params.query || ''
    },
    request () {
      if (this.mode === 'search') {
        return `https://api.themoviedb.org/3/search/movie?api_key=${data.apiKey}&language=en-US&query=${this.query}&page=${this.currentPage}`
      } else {
        let category = 'popular'
        return `https://api.themoviedb.org/3/movie/${category}?api_key=${data.apiKey}&language=en-US&page=${this.currentPage}`
      }
    }
  },
  methods: {
    fetchCategory () {
      let url = this.request
      // GET
      this.$http.get(url).then(response => {
        // get body data
        if (response.status === 200) {
          if (this.currentPage === 1) {
            this.movies = response.body.results
            this.listLoaded = true
          } else {
            let newData = this.movies.concat(response.body.results)
            this.movies = newData
            this.listLoaded = true
          }
        }
      }, response => {
        // error callback
        if (response.status === 404) {
          console.log(response.body)
          this.listLoaded = false
        }
      })
    },
    loadMore () {
      this.currentPage++
      this.fetchCategory()
    }
  },
  created () {
    if (this.mode === 'search') {
      this.$bus.$emit('setSearchQuery')
    }
    this.fetchCategory()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1, h2 {
  font-weight: normal;
}

a {
  color: #35495E;
}
.movies {
  padding: 10px;
}
.movies__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 10px;
}
.movies__title {
  margin: 0;
  font-size: 16px;
  line-height: 16px;
  color: #081c24;
  font-weight: 300;
}
.movies__results {
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 0.5px;
  color: rgba(8, 28, 36, 0.5);
}
.movies__link {
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 0.5px;
  color: rgba(8, 28, 36, 0.5);
  text-decoration: none;
  transition: color 0.5s ease;
}
.movies__link:after {
  content: " →";
}
.movies__link:hover {
  color: #081c24;
}
.movies__list {
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
}
.movies__item {
  padding: 10px;
  width: 20%;
}
.movies__nav {
  padding: 25px 0;
  text-align: center;
}
.movies__nav.is-hidden {
  display: none;
}
</style>
