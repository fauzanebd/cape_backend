import { planCollectionRef } from "../lib/firestore-collections.js"
import { db } from "../lib/init-firebase.js"
import { doc, getDocs, getDoc, addDoc, where, query, updateDoc, deleteDoc } from 'firebase/firestore';


export const getUserPlans = async (req, res) => {
    try {
        let q;
        const userId = req.params.userId;
        const accountId = req.query.accountId;

        if (userId) {
            if (accountId) {
                q = query(planCollectionRef, where('user_id', '==', userId), where('account_id', '==', accountId));
            } else {
                q = query(planCollectionRef, where('user_id', '==', userId));
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

export const getUserPlanbyId = async (req, res) => {
    try {
        const docRef =  doc(db, 'plan', req.params.planId);
        let result = await getDoc(docRef);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const createUserPlan = async (req, res) => {
    // const {title, amount, details, date, accountId, categoryId} = req.body;

    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;


    const title = req.body.plan_title;
    const amount = req.body.target_amount;
    const details = req.body.plan_details;
    const date = req.body.target_date;
    const planDate = today;
    const categoryId = req.body.ic_id;


    const userId = req.params.userId;
    try {
        if (!userId) {
            throw new Error('Cant create plan without userId');
        }
        const plan = await addDoc(planCollectionRef, {
            plan_title: title,
            target_amount: amount,
            plan_details: details,
            plan_date: planDate,
            target_date: date,
            user_id: userId,
            ic_id: categoryId
        })
        res.status(201).json({ message: 'Plan created successfully', plan_id: plan.id });
    } catch(error) {
        res.status(409).json({ error: error.message });
    }
}

export const editUserPlan = async (req, res) => {
    

    let title = req.body.plan_title;
    let amount = req.body.target_amount;
    let details = req.body.plan_details;
    let targetDate = req.body.target_date;
    let categoryId = req.body.ic_id;


    let planId = req.params.planId;
    let userId = req.params.userId;
    try {
        if (!planId) {
            throw new Error('Cant edit plan without planId');
        }
        
        const docRef = doc(db, 'plan', planId);

        let originalData = await getDoc(docRef);

        if (!originalData) {
            throw new Error('No existing plan to delete');
        } else {
            originalData = originalData.data();
            title = title ? title : originalData.plan_title;
            amount = amount ? amount : originalData.target_amount;
            details = details ? details : originalData.plan_details;
            targetDate = targetDate ? targetDate : originalData.target_date;
            userId = userId ? userId : originalData.user_id;
            categoryId = categoryId ? categoryId : originalData.ic_id;
        }

        const result = await updateDoc(docRef, {
            plan_title: title,
            target_amount: amount,
            plan_details: details,
            target_date: targetDate,
            user_id: userId,
            ic_id: categoryId
        });
        
        res.status(200).json({ message: 'Plan updated successfully' });
    } catch(error) {
        res.status(409).json({ error: error.message });
    }
}


export const deleteUserPlan = async (req, res) => {
    try {
        if (!req.params.planId) {
            throw new Error('Cant delete plan without planId');
        }
        const docRef = doc(db, 'plan', req.params.planId)
        deleteDoc(docRef)
        res.status(200).json({ message: 'Plan deleted successfully' });
    } catch(error) {
        res.status(409).json({ error: error.message });
    }

}