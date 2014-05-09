##Middle
Find a central meeting place. Given your current location and the location of a friend, search for cafes, restaurants and/or bars in the area between you. Clicking on a map pin displays two sets of directions for getting there (one for each of you).

Demo it here: http://meetinthemiddle.herokuapp.com/

####Technologies:
* Javascript, HTML, CSS
* Mapbox, Mapbox Directions API
* Foursquare API
* Gravatar
* Font Awesome Icons

####Development:
In development, install npm dependencies

```
npm install
```
then fire up the node server

```
node server.js
```

####Deploying to production:
To deploy the code, you must push the code to heroku. Make sure the master branch is up to date, then:

```
git push heroku master
```