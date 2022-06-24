import { incomeCollectionRef } from "../lib/firestore-collections.js"
import { db } from "../lib/init-firebase.js"
import { doc, getDocs, getDoc, addDoc, where, query, updateDoc, deleteDoc } from 'firebase/firestore';


export const getUserIncomes = async (req, res) => {
    try {
        let q;
        const userId = req.params.userId;
        const accountId = req.query.accountId;

        if (userId) {
            if (accountId) {
                q = query(incomeCollectionRef, where('user_id', '==', userId), where('account_id', '==', accountId));
            } else {
                q = query(incomeCollectionRef, where('user_id', '==', userId));
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

export const getUserIncomebyId = async (req, res) => {
    try {
        const docRef =  doc(db, 'income', req.params.incomeId);
        let result = await getDoc(docRef);
        result = { data: result.data(), id: result.id };
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const createUserIncome = async (req, res) => {
    // const {title, amount, details, date, accountId, categoryId} = req.body;

    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;


    const title = req.body.income_title;
    const amount = req.body.income_amount;
    const details = req.body.income_details;
    const date = today;
    const accountId = req.body.account_id;
    const categoryId = req.body.ic_id;

    
    const userId = req.params.userId;
    try {
        if (!accountId || !userId) {
            throw new Error('Cant create income without accountId and userId');
        }
        const income = await addDoc(incomeCollectionRef, {
            income_title: title,
            income_amount: amount,
            income_details: details,
            income_date: date,
            account_id: accountId,
            user_id: userId,
            ic_id: categoryId
        })
        res.status(201).json({ message: 'Income created successfully', income_id: income.id });
    } catch(error) {
        res.status(409).json({ error: error.message });
    }
}

export const editUserIncome = async (req, res) => {
    

    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;


    let title = req.body.income_title;
    let amount = req.body.income_amount;
    let details = req.body.income_details;
    let date = today;
    let accountId = req.body.account_id;
    let categoryId = req.body.ic_id;


    let incomeId = req.params.incomeId;
    let userId = req.params.userId;
    try {
        if (!incomeId) {
            throw new Error('Cant edit income without incomeId');
        }
        
        const docRef = doc(db, 'income', incomeId);

        let originalData = await getDoc(docRef);

        if (!originalData) {
            throw new Error('No existing income to delete');
        } else {
            originalData = originalData.data();
            title = title ? title : originalData.income_title;
            amount = amount ? amount : originalData.income_amount;
            details = details ? details : originalData.income_details;
            date = date ? date : originalData.income_date;
            accountId = accountId ? accountId : originalData.account_id;
            userId = userId ? userId : originalData.user_id;
            categoryId = categoryId ? categoryId : originalData.ic_id;
        }

        updateDoc(docRef, {
            income_title: title,
            income_amount: amount,
            income_details: details,
            income_date: date,
            account_id: accountId,
            user_id: userId,
            ic_id: categoryId
        })
        res.status(200).json({ message: 'Income updated successfully' });
    } catch(error) {
        res.status(409).json({ error: error.message });
    }
}


export const deleteUserIncome = async (req, res) => {
    try {
        if (!req.params.incomeId) {
            throw new Error('Cant delete income without incomeId');
        }
        const docRef = doc(db, 'income', req.params.incomeId)
        deleteDoc(docRef)
        res.status(200).json({ message: 'Income deleted successfully' });
    } catch(error) {
        res.status(409).json({ error: error.message });
    }

}