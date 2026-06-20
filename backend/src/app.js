require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

const errorHandler = require('./middlewares/errorMiddleware');

const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
const businessIdeaRoutes = require('./routes/businessIdeaRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const businessPlanRoutes = require('./routes/businessPlanRoute');


const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());


app.get('/', (req, res) => {
    res.json({ 
        success: true,
        message: 'Work2Business API Running' 
    });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/business-ideas', businessIdeaRoutes);
app.use('/api/v1/recommendations', recommendationRoutes);
app.use('/api/v1/business-plans',businessPlanRoutes);

app.use(errorHandler);

module.exports = app;