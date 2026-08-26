import productModel from '../models/product.js';

async function addProduct(req, res) {
    
    const { name, description, price, stock, category } = req.body;
    

    const product = await productModel.create({
        name,
        description,
        price,
        stock,
        category,
    });

    res.status(201).json({ message: 'Product added successfully', product });
}

async function getProducts(req, res) {
    const products = await productModel.find();

    res.status(200).json({ products });
}

async function getProductById(req, res) {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ product });
}

async function updateProduct(req, res) {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    const product = await productModel.findByIdAndUpdate(
        id,
        { name, description, price, stock, category },
        { new: true }
    );

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product });
}

async function deleteProduct(req, res) {
    const { id } = req.params;

    const product = await productModel.findByIdAndDelete(id);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
}

export { addProduct, getProducts, getProductById, updateProduct, deleteProduct };