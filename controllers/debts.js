import { debtCollectionRef } from "../lib/firestore-collections.js"
import { db } from "../lib/init-firebase.js"
import { doc, getDocs, getDoc, addDoc, where, query, updateDoc, deleteDoc } from 'firebase/firestore';


export const getUserDebts = async (req, res) => {
    try {
        let q;
        const userId = req.params.userId;
        const accountId = req.query.accountId;

        if (userId) {
            if (accountId) {
                q = query(debtCollectionRef, where('user_id', '==', userId), where('account_id', '==', accountId));
            } else {
                q = query(debtCollectionRef, where('user_id', '==', userId));
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

export const getUserDebtbyId = async (req, res) => {
    try {
        const docRef =  doc(db, 'debt', req.params.debtId);
        let result = await getDoc(docRef);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const createUserDebt = async (req, res) => {
    // const {title, amount, details, date, accountId, categoryId} = req.body;

    const title = req.body.debt_title;
    const amount = req.body.debt_amount;
    const details = req.body.debt_details;
    const date = req.body.due_date;
    const categoryId = req.body.ec_id;


    const userId = req.params.userId;
    try {
        if (!userId) {
            throw new Error('Cant create debt without userId');
        }
        const debt = await addDoc(debtCollectionRef, {
            debt_title: title,
            debt_amount: amount,
            debt_details: details,
            due_date: date,
            user_id: userId,
            ec_id: categoryId
        })
        res.status(201).json({ message: 'Debt created successfully', debt_id: debt.id });
    } catch(error) {
        res.status(409).json({ error: error.message });
    }
}

export const editUserDebt = async (req, res) => {
    
    let title = req.body.debt_title;
    let amount = req.body.debt_amount;
    let details = req.body.debt_details;
    let dueDate = req.body.due_date;
    let categoryId = req.body.ec_id;


    let debtId = req.params.debtId;
    let userId = req.params.userId;
    try {
        if (!debtId) {
            throw new Error('Cant edit debt without debtId');
        }
        
        const docRef = doc(db, 'debt', debtId);

        let originalData = await getDoc(docRef);

        if (!originalData) {
            throw new Error('No existing debt to delete');
        } else {
            originalData = originalData.data();
            title = title ? title : originalData.debt_title;
            amount = amount ? amount : originalData.debt_amount;
            details = details ? details : originalData.debt_details;
            dueDate = dueDate ? dueDate : originalData.due_date;
            userId = userId ? userId : originalData.user_id;
            categoryId = categoryId ? categoryId : originalData.ec_id;
        }

        updateDoc(docRef, {
            debt_title: title,
            debt_amount: amount,
            debt_details: details,
            due_date: dueDate,
            user_id: userId,
            ec_id: categoryId
        })
        res.status(200).json({ message: 'Debt updated successfully' });
    } catch(error) {
        res.status(409).json({ error: error.message });
    }
}


export const deleteUserDebt = async (req, res) => {
    try {
        if (!req.params.debtId) {
            throw new Error('Cant delete debt without debtId');
        }
        const docRef = doc(db, 'debt', req.params.debtId)
        deleteDoc(docRef)
        res.status(200).json({ message: 'Debt deleted successfully' });
    } catch(error) {
        res.status(409).json({ error: error.message });
    }

}