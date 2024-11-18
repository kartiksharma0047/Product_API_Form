import API from '../Models/form.js';

async function generateAPI(req, res) {
    try {
        const {
            productName,
            productPrice,
            productCategory,
            productDescription,
            currency,
            tags,
            productImage: url
        } = req.body;

        await API.create({
            ProductName: productName,
            ProductPrice: productPrice,
            ProductCurrency: currency,
            ProductCategory: productCategory,
            ProductDescription: productDescription,
            ProductTags: tags,
            ProductImage: url
        });

        return res.json("API Data uploaded");
    } catch (error) {
        console.error("Error saving data:", error);
        return res.status(500).json("Error uploading data");
    }
}

export default generateAPI;
