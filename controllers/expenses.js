import { expenseCollectionRef } from "../lib/firestore-collections.js"
import { db } from "../lib/init-firebase.js"
import { doc, getDocs, getDoc, addDoc, where, query, updateDoc, deleteDoc } from 'firebase/firestore';


export const getUserExpenses = async (req, res) => {
    try {
        let q;
        const userId = req.params.userId;
        const accountId = req.query.accountId;

        if (userId) {
            if (accountId) {
                q = query(expenseCollectionRef, where('user_id', '==', userId), where('account_id', '==', accountId));
            } else {
                q = query(expenseCollectionRef, where('user_id', '==', userId));
            }
        } else {
            throw new Error('userId is required');
        }
        const result = [];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {
            result.push({data: doc.data(), id: doc.id});
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const getUserExpensebyId = async (req, res) => {
    try {
        const docRef =  doc(db, 'expense', req.params.expenseId);
        let result = await getDoc(docRef);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const createUserExpense = async (req, res) => {
    // const {title, amount, details, date, accountId, categoryId} = req.body;

    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;


    const title = req.body.expense_title;
    const amount = req.body.expense_amount;
    const details = req.body.expense_details;
    const date = today;
    const accountId = req.body.account_id;
    const categoryId = req.body.ec_id;


    const userId = req.params.userId;
    try {
        if (!accountId || !userId) {
            throw new Error('Cant create expense without accountId and userId');
        }
        const expense = await addDoc(expenseCollectionRef, {
            expense_title: title,
            expense_amount: amount,
            expense_details: details,
            expense_date: date,
            account_id: accountId,
            user_id: userId,
            ec_id: categoryId
        })
        res.status(201).json({ message: 'Expense created successfully', expense_id: expense.id });
    } catch(error) {
        res.status(409).json({ error: error.message });
    }
}

export const editUserExpense = async (req, res) => {
    

    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;


    let title = req.body.expense_title;
    let amount = req.body.expense_amount;
    let details = req.body.expense_details;
    let date = today;
    let accountId = req.body.account_id;
    let categoryId = req.body.ec_id;


    let expenseId = req.params.expenseId;
    let userId = req.params.userId;
    try {
        if (!expenseId) {
            throw new Error('Cant edit expense without expenseId');
        }
        
        const docRef = doc(db, 'expense', expenseId);

        let originalData = await getDoc(docRef);

        if (!originalData) {
            throw new Error('No existing expense to delete');
        } else {
            originalData = originalData.data();
            title = title ? title : originalData.expense_title;
            amount = amount ? amount : originalData.expense_amount;
            details = details ? details : originalData.expense_details;
            date = date ? date : originalData.expense_date;
            accountId = accountId ? accountId : originalData.account_id;
            userId = userId ? userId : originalData.user_id;
            categoryId = categoryId ? categoryId : originalData.ec_id;
        }

        updateDoc(docRef, {
            expense_title: title,
            expense_amount: amount,
            expense_details: details,
            expense_date: date,
            account_id: accountId,
            user_id: userId,
            ec_id: categoryId
        })
        res.status(200).json({ message: 'Expense updated successfully' });
    } catch(error) {
        res.status(409).json({ error: error.message });
    }
}


export const deleteUserExpense = async (req, res) => {
    try {
        if (!req.params.expenseId) {
            throw new Error('Cant delete expense without expenseId');
        }
        const docRef = doc(db, 'expense', req.params.expenseId)
        deleteDoc(docRef)
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch(error) {
        res.status(409).json({ error: error.message });
    }

}