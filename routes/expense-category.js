import express from 'express';
import { getExpenseCategoryList, getExpenseCategorybyId, createExpenseCategory, updateExpenseCategory, deleteExpenseCategory } from '../controllers/expense-cat.js'

const router = express.Router();

router.get('/', getExpenseCategoryList);
router.get('/:expenseCategoryId', getExpenseCategorybyId);
router.post('/', createExpenseCategory);
router.put('/:expenseCategoryId', updateExpenseCategory);
router.delete('/:expenseCategoryId', deleteExpenseCategory);

export default router;