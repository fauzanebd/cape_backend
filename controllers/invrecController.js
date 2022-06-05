import { FormRecognizerClient, AzureKeyCredential } from "@azure/ai-form-recognizer";
import fs from 'fs';
import { ContainerClient, StorageSharedKeyCredential } from "@azure/storage-blob";

const apiKey = process.env.AZURE_FORM_RECOGNITION_API_KEY;
const endpoint = process.env.AZURE_FORM_RECOGNITION_ENDPOINT;

// const trainingClient = new FormTrainingClient(endpoint, new AzureKeyCredential(apiKey));
const client = new FormRecognizerClient(endpoint, new AzureKeyCredential(apiKey));


const recognizeReceipt = async (receiptUrl) => {
    // receiptUrl = "https://raw.githubusercontent.com/Azure/azure-sdk-for-python/master/sdk/formrecognizer/azure-ai-formrecognizer/tests/sample_forms/receipt/contoso-receipt.png";
    const poller = await client.beginRecognizeReceiptsFromUrl(receiptUrl, {
        onProgress: (state) => { console.log(`status: ${state.status}`); }
    });

    const receipts = await poller.pollUntilDone();

    if (!receipts || receipts.length <= 0) {
        throw new Error("Expecting at lease one receipt in analysis result");
    }

    const receipt = receipts[0];
    console.log("First receipt:");
    const receiptTypeField = receipt.fields["ReceiptType"];
    if (receiptTypeField.valueType === "string") {
        console.log(`  Receipt Type: '${receiptTypeField.value || "<missing>"}', with confidence of ${receiptTypeField.confidence}`);
    }
    const merchantNameField = receipt.fields["MerchantName"];
    if (merchantNameField.valueType === "string") {
        console.log(`  Merchant Name: '${merchantNameField.value || "<missing>"}', with confidence of ${merchantNameField.confidence}`);
    }
    const transactionDate = receipt.fields["TransactionDate"];
    if (transactionDate.valueType === "date") {
        console.log(`  Transaction Date: '${transactionDate.value || "<missing>"}', with confidence of ${transactionDate.confidence}`);
    }
    const itemsField = receipt.fields["Items"];
    if (itemsField.valueType === "array") {
        for (const itemField of itemsField.value || []) {
            if (itemField.valueType === "object") {
                const itemNameField = itemField.value["Name"];
                if (itemNameField.valueType === "string") {
                    console.log(`    Item Name: '${itemNameField.value || "<missing>"}', with confidence of ${itemNameField.confidence}`);
                }
            }
        }
    }
    const totalField = receipt.fields["Total"];
    if (totalField.valueType === "number") {
        console.log(`  Total: '${totalField.value || "<missing>"}', with confidence of ${totalField.confidence}`);
    }

    let itemsDetected = []
    if (itemsField.valueType === "array") {
        for (const itemField of itemsField.value || []) {
            if (itemField.valueType === "object") {
                const itemNameField = itemField.value["Name"].value;
                // if last item is detected, dont add comma
                if (itemsDetected.length === itemsField.value.length - 1) {
                    itemsDetected.push(itemNameField);
                } else {
                    itemsDetected.push(itemNameField + ", ");
                }
            }
        }
    }

    // concat itemsDetected to string
    let itemsDetectedString = "";
    for (let i = 0; i < itemsDetected.length; i++) {
        itemsDetectedString += itemsDetected[i];
    }

    // return receipt;
    // return json of fields
    return {
        receiptType: receiptTypeField.value,
        merchantName: merchantNameField.value,
        transactionDate: transactionDate.value,
        items: itemsDetectedString,
        total: totalField.value
    }
}

const recognizeInvoice = async (invoiceUrl) => {
    const poller = await client.beginRecognizeInvoicesFromUrl(invoiceUrl, {
        onProgress: (state) => {
            console.log(`status: ${state.status}`);
        }
    });

    const [invoice] = await poller.pollUntilDone();
    if (invoice === undefined) {
        throw new Error("Failed to extract data from at least one invoice.");
    }

    // Helper function to print fields.
    function fieldToString(field) {
        const {
            name,
            valueType,
            value,
            confidence
        } = field;
        return `${name} (${valueType}): '${value}' with confidence ${confidence}'`;
    }

    console.log("Invoice fields:");

    for (const [name, field] of Object.entries(invoice.fields)) {
        if (field.valueType !== "array" && field.valueType !== "object") {
            console.log(`- ${name} ${fieldToString(field)}`);
        }
    }

    let idx = 0;

    console.log("- Items:");

    const items = invoice.fields["Items"]?.value;
    for (const item of items ?? []) {
        const value = item.value;

        const subFields = [
            "Description",
            "Quantity",
            "Unit",
            "UnitPrice",
            "ProductCode",
            "Date",
            "Tax",
            "Amount"
        ]
            .map((fieldName) => value[fieldName])
            .filter((field) => field !== undefined);

        console.log(
            [
                `  - Item #${idx}`,
                // Now we will convert those fields into strings to display
                ...subFields.map((field) => `    - ${fieldToString(field)}`)
            ].join("\n")
        );
    }
}


const invrecController = {
    invoiceRecognizerHandler: async (req, res) => {
        try {
            const result = await recognizeReceipt(req.file.url);
            // delete azure blob storage using url
            const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
            const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
            const sharedKeyCredetial = new StorageSharedKeyCredential(accountName, accountKey);

            const containerClient = new ContainerClient(
                `https://${accountName}.blob.core.windows.net/invoices`,
                sharedKeyCredetial
            );

            const options = {
                deleteSnapshots: "include"
            }
            
            const blockBlobClient = containerClient.getBlockBlobClient(req.file.blob);
            await blockBlobClient.delete(options);

            return res.status(200).send({
                message: 'Successfully recognized invoice',
                data: result
            });
        } catch (error) {
            console.log(error)
            return res.status(500).send({
                message: 'Failed to get invoice details from image',
                error: error
            });
        }
    }
}

export default invrecController;