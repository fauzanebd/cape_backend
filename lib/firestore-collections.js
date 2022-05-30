import { collection } from 'firebase/firestore';
import { db } from './init-firebase.js';

export const incomeCollectionRef = collection(db, 'income');
export const expenseCollectionRef = collection(db, 'expense');
export const expenseCatCollectionRef = collection(db, 'expense_category');
export const incomeCatCollectionRef = collection(db, 'income_category');
export const accountCollectionRef = collection(db, 'account');
export const userCollectionRef = collection(db, 'user');
export const planCollectionRef = collection(db, 'plan');
export const debtCollectionRef = collection(db, 'debt');