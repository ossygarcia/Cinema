const express = require('express')
const mongoose = require('mongoose')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors');


const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

const Port = process.env.PORT || 5000

//Imports
const Auth = require('./routes/auth')
const UserRoute = require('./routes/user')
const MovieRoute = require('./routes/movie')
const ListRoute = require('./routes/list')


dotenv.config()

app.use(express.json())

mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log("Database Connected Successfully !")).catch((err) => console.log(err))

//Import initialization
app.use("/api/auth", Auth)
app.use("/api/user", UserRoute)
app.use("/api/movies", MovieRoute)
app.use("/api/list", ListRoute)



app.listen(Port, () => console.log(`Server Started on port ${Port}`))