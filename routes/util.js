import express from 'express';
// import cogservController from '../controllers/cogservController.js';
import multer from 'multer';
import MulterAzureStorage from 'multer-azure-storage';
import path from 'path';
import invrecController from '../controllers/invrecController.js';

const router = express.Router();

const checkFile = (req, file, cb) => {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!, you try to upload ' + file.mimetype + ' extname: ' + file.extname);
    }    
}

// const diskStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './uploads');
//     },
//     filename: function(req, file, cb) {
//         cb(null, file.originalname);
//     }
// });

const azureStorage = new MulterAzureStorage({
    azureStorageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
    containerName: 'invoices',
    containerSecurity: 'blob'
});


const upload = multer({
    storage: azureStorage,
    limits: {
        fileSize: 3000000
    },
    fileFilter: checkFile
});

router.post('/scanInvoice', upload.single('image'), invrecController.invoiceRecognizerHandler);


export default router;