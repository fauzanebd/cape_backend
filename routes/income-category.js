import express from 'express';
import { getIncomeCategoryList, getIncomeCategorybyId, createIncomeCategory, updateIncomeCategory, deleteIncomeCategory } from '../controllers/income-cat.js'

const router = express.Router();

router.get('/', getIncomeCategoryList);
router.get('/:incomeCategoryId', getIncomeCategorybyId);
router.post('/', createIncomeCategory);
router.put('/:incomeCategoryId', updateIncomeCategory);
router.delete('/:incomeCategoryId', deleteIncomeCategory);

export default router;