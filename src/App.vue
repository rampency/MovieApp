<template>
  <div id="app">
    <header>
      <span class="title" v-on:click="home"><a href="#" style="color:white;">Search Popular Movies</a></span>
      <div class="d-flex justify-content-center h-100" >
        <div class="searchbar">
          <input class="search_input" type="text" name="get" placeholder="Search..." v-on:keyup.enter="search"  v-model="searchQuery">
          <a href="#" class="search_icon"><i class="fas fa-search"></i></a>
        </div>
      </div>
    </header>
      <movie-view v-if="moviePopupIsVisible" @close="closeMovieView" :id="moviePopupId"></movie-view>
     <main>
      <router-view name="movie-router-view"></router-view>
      <router-view name="search-router-view" :mode="'search'" :key="$route.params.query"></router-view>
    </main>
  </div>
</template>

<script>
import MovieView from './components/MovieView.vue'

export default {
  name: 'app',
  components: {MovieView},
  computed: {
    queryForRouter () {
      return encodeURI(this.searchQuery.replace(/ /g, '+'))
    }
  },
  data () {
    return {
      moviePopupIsVisible: false,
      moviePopupId: 0,
      searchQuery: ''
    }
  },
  methods: {
    openMovieView (id, newMoviePopup) {
      this.moviePopupIsVisible = true
      this.moviePopupId = id
      document.querySelector('body').classList.add('hidden')
    },
    closeMovieView () {
      this.moviePopupIsVisible = false
      document.querySelector('body').classList.remove('hidden')
    },
    search () {
      if (!this.searchQuery.length) return
      this.$router.push({name: 'search', params: {query: this.queryForRouter}})
    },
    home () {
      this.$router.push({name: 'MovieList'})
    },
    setSearchQuery (clear) {
      if (clear) {
        this.searchQuery = ''
      } else {
        let query = decodeURIComponent(this.$route.params.query)
        this.searchQuery = query ? query.replace(/\+/g, ' ') : ''
      }
    }
  },
  created () {
    this.$bus.$on('openMovieView', this.openMovieView)
    this.$bus.$on('setSearchQuery', this.setSearchQuery)
  }

}
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

main {
  text-align: center;
  margin-top: 40px;
}

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #35495E;
  color: #ffffff;
}

header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}
. title {
   text-align: center;
   color: white;
}
 .searchbar{
 margin-bottom: auto;
 margin-top: auto;
 height: 60px;
 background-color: #353b48;
 border-radius: 30px;
 padding: 10px;
 }

 .search_input{
 color: white;
 border: 0;
 outline: 0;
 background: none;
 width: 0;
 caret-color:transparent;
 line-height: 40px;
 transition: width 0.4s linear;
 }

 .searchbar:hover > .search_input{
 padding: 0 10px;
 width: 450px;
 caret-color:red;
 transition: width 0.4s linear;
 }

 .searchbar:hover > .search_icon{
 background: white;
 color: #e74c3c;
 }

 .search_icon{
 height: 40px;
 width: 40px;
 float: right;
 display: flex;
 justify-content: center;
 align-items: center;
 border-radius: 50%;
 color:white;
 }
</style>
