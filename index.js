import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import {} from 'dotenv/config';
// import dotenv from 'dotenv';

// dotenv.config();

// import incomeRoutes from './routes/incomes.js';
import userRoutes from './routes/user.js';
import expenseCategoryRoutes from './routes/expense-category.js';
import incomeCategoryRoutes from './routes/income-category.js';
import utilRoutes from './routes/util.js';

const app = express();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// app.use((req, res, next) =>  {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
// });

app.get('/test', (req, res) => {
    res.send('Hello World!');
});
app.use('/api/users', userRoutes);
app.use('/api/expense_category', expenseCategoryRoutes);
app.use('/api/income_category', incomeCategoryRoutes);
app.use('/api/cogserv', utilRoutes);

// app.post('/cogserv', cogservController.imageToTextHandler);

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {console.log(`Listening on port ${PORT}`)});

