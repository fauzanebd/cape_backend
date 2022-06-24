import { expenseCatCollectionRef } from "../lib/firestore-collections.js"
import { db } from "../lib/init-firebase.js"
import { doc, getDocs, getDoc, addDoc, where, query, updateDoc, deleteDoc } from 'firebase/firestore';

export const getExpenseCategoryList = async (req, res) => {
    try {
        const result = [];
        const querySnapshot = await getDocs(expenseCatCollectionRef);
        querySnapshot.forEach(doc => {
            result.push({data: doc.data(), id: doc.id});
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const getExpenseCategorybyId = async (req, res) => {
    try {
        const docRef = doc(db, 'expense_category', req.params.expenseCategoryId);
        let result = await getDoc(docRef);
        result = { data: result.data(), id: result.id };
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const createExpenseCategory = async (req, res) => {

    const details = req.body.category_details;
    const name = req.body.category_name;
    const icon = req.body.category_icon;

    try {
        const result = await addDoc(expenseCatCollectionRef, {
            category_details: details,
            category_name: name,
            category_icon: icon
        });
        res.status(200).json({ message: 'Expense Category created successfully', expense_category_id: result.id });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const updateExpenseCategory = async (req, res) => {
    let name = req.body.category_name;
    let details = req.body.category_details;
    let icon = req.body.category_icon;

    const categoryId = req.params.expenseCategoryId;
    try {
        const docRef = doc(db, 'expense_category', categoryId);
        let originalData = await getDoc(docRef);

        if (!originalData) {
            throw new Error('Expense category not found');
        } else {
            originalData = originalData.data();
            name = name ? name : originalData.category_name;
            details = details ? details : originalData.category_details;
            icon = icon ? icon : originalData.category_icon;
        }

        updateDoc(docRef, {
            category_name: name,
            category_details: details,
            category_icon: icon
        });

        res.status(200).json({ message: 'Expense category updated successfully' });
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}


export const deleteExpenseCategory = async (req, res) => {
    try {
        if (!req.params.expenseCategoryId) {
            throw new Error('Cant delete expense category without expense category id');
        }
        const docRef = doc(db, 'expense_category', req.params.expenseCategoryId)
        deleteDoc(docRef);
        res.status(200).json({ message: 'Expense category deleted successfully' });
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

