const mongoose = require('mongoose');
//Local System MongoDB Compass
//const mongoURI = "mongodb://127.0.0.1:27017/inotebook?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

// Cloud Database using MongoDB Atlas
const mongoURI = "mongodb+srv://researchyash23:Y3OVTq3IPxnUYNhJ@inotebook-testing-clust.jreasnw.mongodb.net/?retryWrites=true&w=majority&appName=iNotebook-Testing-Cluster"
const connectToMongo = async () => {
    try {
        mongoose.set('strictQuery', false)
        mongoose.connect(mongoURI); 
        console.log('MongoDB Connected Successfully.')
    } catch(error) {
        console.log(error)
        process.exit()
    }
}

module.exports = connectToMongo;