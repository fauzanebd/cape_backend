import express from 'express';

// import { getUser, createUser, editUser, deleteUser } from '../controllers/user.js';
import { getUserIncomes, getUserIncomebyId, createUserIncome, editUserIncome, deleteUserIncome } from '../controllers/incomes.js';
import { getUserExpenses, getUserExpensebyId, createUserExpense, editUserExpense, deleteUserExpense } from '../controllers/expenses.js';
import { getUserDebts, getUserDebtbyId, createUserDebt, editUserDebt, deleteUserDebt } from '../controllers/debts.js';
import { getUserPlans, getUserPlanbyId, createUserPlan, editUserPlan, deleteUserPlan } from '../controllers/plans.js';
import { getUserAccounts, getUserAccountbyId, createUserAccount, editUserAccount, deleteUserAccount } from '../controllers/accounts.js';


const router = express.Router();

// router.get('/', getUserList);

// router.post('/edit/:userId', editUser);
// router.post('/delete/:userId', deleteUser);

// User accounts
// router.post('/', createUser);
// router.get('/:userId', getUserbyId);
// router.patch('/:userId/edit', editUser);
// router.delete('/:userId/delete', deleteUser);


// User accounts
router.get('/:userId/accounts', getUserAccounts);
router.get('/:userId/accounts/:accountId', getUserAccountbyId);
router.post('/:userId/accounts', createUserAccount);
router.put('/:userId/accounts/:accountId', editUserAccount);
router.delete('/:userId/accounts/:accountId', deleteUserAccount);

// User incomes
router.get('/:userId/incomes', getUserIncomes);
router.get('/:userId/incomes/:incomeId', getUserIncomebyId);
router.post('/:userId/incomes', createUserIncome);
router.put('/:userId/incomes/:incomeId', editUserIncome);
router.delete('/:userId/incomes/:incomeId', deleteUserIncome);

// User expenses
router.get('/:userId/expenses', getUserExpenses);
router.get('/:userId/expenses/:expenseId', getUserExpensebyId);
router.post('/:userId/expenses', createUserExpense);
router.put('/:userId/expenses/:expenseId', editUserExpense);
router.delete('/:userId/expenses/:expenseId', deleteUserExpense);

// User debt
router.get('/:userId/debts', getUserDebts);
router.get('/:userId/debts/:debtId', getUserDebtbyId);
router.post('/:userId/debts', createUserDebt);
router.put('/:userId/debts/:debtId', editUserDebt);
router.delete('/:userId/debts/:debtId', deleteUserDebt);

// User plans
router.get('/:userId/plans', getUserPlans);
router.get('/:userId/plans/:planId', getUserPlanbyId);
router.post('/:userId/plans', createUserPlan);
router.put('/:userId/plans/:planId', editUserPlan);
router.delete('/:userId/plans/:planId', deleteUserPlan);

export default router;