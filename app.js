//imports
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/errorHandler');
const process = require('process')
require('dotenv/config');


//uses
const userRouter = require('./routers/user');
const categoryRouter = require('./routers/category');
const auctionRouter = require('./routers/auction');
const offerRouter = require('./routers/offer');



//Configuración basica express
const app = express();
const api = process.env.API_URL
app.use(cors())
app.options('*',cors());

//middlewares
app.use(express.json());
app.use(morgan('tiny'));    
app.use(authJwt());
app.use(errorHandler);
app.use('/public/uploads',express.static(__dirname + '/public/uploads'))

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.ejs', {
        message: err.message,
        error: err
    });
});

//routers
app.use(`${api}/users`,userRouter)
app.use(`${api}/categories`,categoryRouter)
app.use(`${api}/auctions`,auctionRouter)
app.use(`${api}/offers`,offerRouter)



app.get('/',(req,res)=>{
    res.send('hello api');
});


//db connection 
mongoose.connect(process.env.CONNECTION_STRING)
    .then(()=>{
        console.log('Database connection is ready....')
    })
    .catch((e)=>{
        console.error(e);
    });

//create server

const PORT = process.env.PORT || 3333;
app.listen(PORT, ()=>{
    console.log(api);
    console.log(`server is running in localhost:${PORT}`)
});
