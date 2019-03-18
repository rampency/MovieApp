# A MovieDB Node App
Author: Vijay Gopal
email: deeps918@gmail.com

Using the Movie DB API I made a web app using Node.js and Vue.js Framework. The app after it is launched can be viewed on http://localhost:8080/.

Users can:
  - View the most popular movies and search for movies using the Movie DB API.
  - By clicking on a movie card it opens a detailed view of the movie where the cast, director, synopsis and link to the movie trailer is given.

# Build Setup

``` bash
# Check to see if you have Node and npm installed, run the commands below and you should see an output. 
# If not install Node and npm for your operating system then continue.
node -v
v11.10.1
npm -v
6.7.0
#Go into the MovieApp folder
cd MovieApp
# install dependencies
sudo npm install
# start the server at localhost:8080
npm run start
```
### Overview and Featues

* [VueJS] - Library for building interactive web interfaces
* [Twitter Bootstrap] - UI boilerplate for modern web apps
* [node.js] - evented I/O for the backend

In the `index.html` file the app vue component is imported like this `<div id="app"></div>` which sets up the `App.vue` file which acts as a base page. The `vue-router` is used to handle the routing, so in `App.vue` you'll see ` <router-view></router-view>` handles all the calls made in the `src/router/index.js`.

Users can search for movies and look up the detailed movie information.
