import MovieList from '@/components/MovieList'
import VueRouter from 'vue-router'

let routes = [
  {
    name: 'MovieList',
    path: '/',
    components: {
      'movie-router-view': MovieList
    }
  },
  {
    name: 'search',
    path: '/search/:query',
    components: {
      'search-router-view': MovieList
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes,
  linkActiveClass: 'is-active'
})
export default router
