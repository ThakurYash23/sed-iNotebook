const express = require('express');
const connectToMongo = require('./db');        // similar to import statement in react
const cors = require('cors');

connectToMongo(); // connect to mongodb local database using mongoose connect method created in db.js

const app = express();  // creating a backend app here using express, a backend server
const PORT = 5000;

app.use(cors());
app.use(express.json());   // using middleware to access req.body

// Available routes
app.use('/api/user', require('./routes/userAuth'));
app.use('/api/notes', require('./routes/note'));

app.get('/', (req, res)=>{         // create root route here
    res.send("Hello this is root route");
});

app.listen(PORT,() => {  // making app connection to port where our backend app will run
    console.log(`iNotebook backend app is listening at port ${PORT}`);
})