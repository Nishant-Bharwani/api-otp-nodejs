// Setting up the .env file configuration
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoute = require('../routes/auth.route');

// Port defined here
const PORT = process.env.PORT || 80;

// Data form config.js
const { MONGODB_URL, NODE_ENV } = require('../config');

// Data from errors.js
const { API_ENDPOINT_NOT_FOUND_ERR, SERVER_ERR } = require("./errors");


// initializing express app
const app = express();

// middlewares declared here
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    credentials: true,
    optionsSuccessStatus: 200
}));


// installation for dev enviroment

if (NODE_ENV === "development") {
    const morgan = require("morgan");
    app.use(morgan("dev"));
}

// Setting up the index route
app.get("/", (req, res) => {
    res.status(200).json({
        type: "success",
        message: "server is up and running",
        data: null,
    });
});

// Setting up the all routes
app.use('/api/auth', authRoute);


// Page not found middleware
app.use("*", (req, res, next) => {
    const error = {
        status: 404,
        message: API_ENDPOINT_NOT_FOUND_ERR,
    };
    next(error);
});

// Global error handling middleware

app.use((err, req, res, next) => {
    console.log(err);
    const status = err.status || 500;
    const message = err.message || SERVER_ERR;
    const data = err.data || null;
    res.status(status).json({
        type: "error",
        message,
        data,
    });
});

const run = async() => {
    try {
        await mongoose.connect(MONGODB_URL, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });

        console.log(`CONNECTION ESTABLISHED`);

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        })
    } catch (err) {
        res.status(500).json(err);
        process.exit(1);
    }
}

run();