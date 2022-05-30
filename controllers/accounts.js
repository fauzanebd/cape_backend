import { accountCollectionRef } from "../lib/firestore-collections.js"
import { db } from "../lib/init-firebase.js"
import { doc, getDocs, getDoc, addDoc, where, query, updateDoc, deleteDoc } from 'firebase/firestore';


export const getUserAccounts = async (req, res) => {
    try {
        let q;
        const userId = req.params.userId;
        const accountId = req.query.accountId;

        if (userId) {
            if (accountId) {
                q = query(accountCollectionRef, where('user_id', '==', userId), where('account_id', '==', accountId));
            } else {
                q = query(accountCollectionRef, where('user_id', '==', userId));
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

export const getUserAccountbyId = async (req, res) => {
    try {
        const docRef =  doc(db, 'account', req.params.accountId);
        let result = await getDoc(docRef);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const createUserAccount = async (req, res) => {
    // const {title, amount, details, date, accountId, categoryId} = req.body;

    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;


    const name = req.body.account_name;
    const balance = req.body.account_balance;

    const userId = req.params.userId;
    try {
        if (!userId) {
            throw new Error('Cant create account without userId');
        }
        const acc = await addDoc(accountCollectionRef, {
            account_name: name,
            account_balance: balance,
            user_id: userId
        })

        res.status(201).json({ message: 'Account created successfully', account_id: acc.id });
    } catch(error) {
        res.status(409).json({ error: error.message });
    }
}

export const editUserAccount = async (req, res) => {
    

    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;


    let name = req.body.account_name;
    let balance = req.body.account_balance;

    let userId = req.params.userId;
    let accountId = req.params.accountId;

    try {
        if (!accountId) {
            throw new Error('Cant edit account without accountId');
        }
        
        const docRef = doc(db, 'account', accountId);

        let originalData = await getDoc(docRef);

        if (!originalData) {
            throw new Error('No existing account to delete');
        } else {
            originalData = originalData.data();
            name = name ? name : originalData.account_name;
            balance = balance ? balance : originalData.account_balance;
            userId = userId ? userId : originalData.user_id;
        }

        updateDoc(docRef, {
            account_name: name,
            account_balance: balance,
            user_id: userId
        })
        res.status(200).json({ message: 'Account updated successfully' });
    } catch(error) {
        res.status(409).json({ error: error.message });
    }
}


export const deleteUserAccount = async (req, res) => {
    try {
        if (!req.params.accountId) {
            throw new Error('Cant delete account without accountId');
        }
        const docRef = doc(db, 'account', req.params.accountId)
        deleteDoc(docRef)
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch(error) {
        res.status(409).json({ error: error.message });
    }

}