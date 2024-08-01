const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');

const port = 3000;
const uri = process.env.MONGO_URI;

const taskApi = require('./routers/task.js')


app.use('/tasks',taskApi);

mongoose.connect(`${uri}Projects`)
    .then(() => {
        app.listen(3000, () => {
            console.log(`Listening on port ${port}`);
        });
    })
    .catch(err => {
        console.error(`Database connection error: ${err}`);
    })
