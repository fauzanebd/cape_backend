import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// import incomeRoutes from './routes/incomes.js';
import userRoutes from './routes/user.js';
import expenseCategoryRoutes from './routes/expense-category.js';
import incomeCategoryRoutes from './routes/income-category.js';

const app = express();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// app.use('/api/incomes', incomeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/expense_category', expenseCategoryRoutes);
app.use('/api/income_category', incomeCategoryRoutes);

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {console.log(`Listening on port ${PORT}`)});

