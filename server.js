const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const errorHandler = require("./middlewares/errorHandler");
const connectDb = require('./config/dbConnection');

connectDb();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
app.use(express.json())

const port = process.env.PORT || 6000;

app.use("/api/users", require('./routes/userRoutes'));
app.use("/api/books",require('./routes/bookRoutes'));
app.use("/api/orders",require('./routes/orderRoutes'))

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})

module.exports = app; //for test
