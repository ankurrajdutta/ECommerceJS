const Product = require('../models/product');

exports.getCartItems = async(req, res) => {
    try{
        const cart= await req.user.getCart();
        const products= await cart.getProducts();
        res.status(200).json(products);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: 'Failed' });
    }
};

exports.addToCart = async(req, res) => {
    try{
        const productId = req.body.id;
        let fetchedCart;
        let newQuantity = 1; 
        const cart= await req.user.getCart();
        fetchedCart = cart;
        //check if product is present
        const findProducts= await cart.getProducts({ where: { id: productId } });
        let product;
        if (findProducts.length > 0) {
            product = findProducts[0];
        }
        //update quantiy
        if (product) {
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity + 1;
        } 
        const products= await Product.findByPk(productId);
        await fetchedCart.addProduct(products, {through: { quantity: newQuantity }});
        return res.status(200).json({ message: 'Success', products});
    }catch(err){
        console.log(err);
        res.status(500).json({ message: 'Failed' })
    };
        
}

exports.removeFromCart = async(req, res) => {
    try{
        const productId = req.params.productId;
        const cart=await req.user.getCart()
        const products= await cart.getProducts({where: {id: productId}});
        const productToDelete = products[0];
        await productToDelete.cartItem.destroy();
        res.status(200).send({data: 'item deleted'})
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}