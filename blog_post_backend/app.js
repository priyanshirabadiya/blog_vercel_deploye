const express = require('express');
const env = require('dotenv');
env.config();
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const mongooes = require('mongoose');
const userRoutes = require('./Routes/user.routes');
const postRoutes = require('./Routes/blogPost.routes');
const otpRoute = require('./Routes/otp.routes');
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

mongooes.connect(process.env.MONGO_URL)
    .then(() => console.log("Database connection established success..."))
    .catch((err) => console.log(err));

app.use('/public/images', express.static(path.join(__dirname, 'public/images')));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cors());
app.use(cors({
    origin: process.env.FROTNEND_URL || 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
}));

app.get("/", (req, res) => {
    res.send("<h1>Welcome to server</h1>");
});

app.use('/post', postRoutes);

app.use("/user", userRoutes);

app.use("/", otpRoute);

app.listen(port, '0.0.0.0', () => {
    console.log(`server starts at http://localhost:${port}`)
});

module.exports = app;