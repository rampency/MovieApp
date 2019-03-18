
<template>
  <li class="movies-item">
    <a class="movies-item__link" :class="{'no-image': noImage}" :href="'/movie/' + movie.id" @click.prevent="openMovieView(movie.id, true)">
      <figure class="movies-item__poster">
        <img v-if="!noImage" class="movies-item__img"  v-img="poster()" alt="">
        <img v-if="noImage" class="movies-item__img is-loaded" alt="">
      </figure>
      <div class="movies-item__content">
        <p class="movies-item__title">{{ movie.title }}</p>
      </div>
    </a>
  </li>
</template>

<script>
import img from '../directives/v-image.js'

export default {
  props: ['movie'],
  directives: {
    img: img
  },
  data () {
    return {
      noImage: false
    }
  },
  methods: {
    poster () {
      if (this.movie.poster_path) {
        return 'https://image.tmdb.org/t/p/w370_and_h556_bestv2' + this.movie.poster_path
      } else {
        this.noImage = true
      }
    },
    openMovieView (id, event) {
      this.$bus.$emit('openMovieView', id, event)
    }
  }
}
</script>

<style>
.movies-item__link {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 300;
}
.movies-item__content {
  padding-top: 15px;
}
.movies-item__poster {
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  transform: translateZ(0);
  background: #ffffff;
}
.movies-item__img {
  width: 100%;
  opacity: 0;
  transform: scale(0.97) translateZ(0);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.movies-item__img.is-loaded {
  opacity: 1;
  transform: scale(1);
}
.movies-item__link:not(.no-image):hover .movies-item__poster {
  transform: scale(1.03);
  box-shadow: 0 0 10px rgba(8, 28, 36, 0.1);
}
.movies-item__title {
  margin: 0;
  font-size: 14px;
  font-weight: 300;
  color: black;
  letter-spacing: 0.5px;
  transition: color 0.5s ease;
}
</style>