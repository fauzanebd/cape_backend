import { incomeCatCollectionRef } from "../lib/firestore-collections.js"
import { db } from "../lib/init-firebase.js"
import { doc, getDocs, getDoc, addDoc, where, query, updateDoc, deleteDoc } from 'firebase/firestore';

export const getIncomeCategoryList = async (req, res) => {
    try {
        const result = [];
        const querySnapshot = await getDocs(incomeCatCollectionRef);
        querySnapshot.forEach(doc => {
            result.push({data: doc.data(), id: doc.id});
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const getIncomeCategorybyId = async (req, res) => {
    try {
        const docRef = doc(db, 'income_category', req.params.incomeCategoryId);
        let result = await getDoc(docRef);
        result = { data: result.data(), id: result.id };
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const createIncomeCategory = async (req, res) => {

    const details = req.body.category_details;
    const name = req.body.category_name;
    const icon = req.body.category_icon;

    try {
        const result = await addDoc(incomeCatCollectionRef, {
            category_details: details,
            category_name: name,
            category_icon: icon
        });
        res.status(200).json({ message: 'Income Category created successfully', income_category_id: result.id });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const updateIncomeCategory = async (req, res) => {
    let name = req.body.category_name;
    let details = req.body.category_details;
    let icon = req.body.category_icon;

    let categoryId = req.params.incomeCategoryId;
    try {
        const docRef = doc(db, 'income_category', categoryId);
        let originalData = await getDoc(docRef);

        if (!originalData) {
            throw new Error('Income category not found');
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

        res.status(200).json({ message: 'Income category updated successfully' });
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}


export const deleteIncomeCategory = async (req, res) => {
    try {
        if (!req.params.incomeCategoryId) {
            throw new Error('Cant delete income category without income category id');
        }
        const docRef = doc(db, 'income_category', req.params.incomeCategoryId)
        deleteDoc(docRef);
        res.status(200).json({ message: 'Income category deleted successfully' });
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

