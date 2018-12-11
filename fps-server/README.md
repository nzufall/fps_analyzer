# FPS Log Server

Serves Acts and Worlds FPS data depending on selection

By: Nikolaus Zufall

### To Use
Run the following commands:
```
npm install
npm start
```
App is then available at http://localhost:3000

### To Test
Run the following command:
```
npm test
```

### API endpoints that support the front end:
* /fps - gets FPS for all acts/worlds
* /acts - gets a list of acts
* /acts/:actID - gets all worlds for act
* /acts/:actID/fps - get FPS for entire act
* /acts/:actID/worlds/:worldID/fps - get FPS for world based on act and world

### Libraries Used
* react - makes front end development easier and more inline with server code
* react-dom - creates the ability to have routes within a react app
* react-scripts - builds the app into a build folder so distrobution by server
* express - web server library that wraps node's http server library
* axios - front-end library that allows for XHR Requests to be promises
* sqlite3 - for interacting with the db
* mocha - testing framework
* chai - assertion library
* supertest - api testing handler

### References 
* https://www.npmjs.com/package/sqlite3
* https://enable-cors.org/server_expressjs.html
