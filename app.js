const express = require('express');

const app = express();

const cors = require('cors');

app.use(express.json());
app.use(cors());

//env
const dotenv = require('dotenv');
dotenv.config();

//database
const sequelize = require('./util/database');

//routes
const productRoutes= require('./routes/product');
const cartRoutes= require('./routes/cart');
const orderRoutes= require('./routes/order');

//models
const User = require('./models/user');
const Product = require('./models/product');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderDetail = require('./models/order-detail');

//associations
User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

User.hasMany(Order);
Order.belongsTo(User);

Order.belongsToMany(Product, {through: OrderDetail});
Product.belongsToMany(Order, {through: OrderDetail});

//dummy user
app.use(async(req, res, next) => {
    try{
        const user= await User.findByPk(1)
        req.user = user;
        next();
    }catch(err){
        console.log(err);
    }
})

//routes
app.use(productRoutes);
app.use(cartRoutes);
app.use(orderRoutes);

// app.use((req, res) => {
//     console.log('urlll', req.url)
//     res.sendFile(path.join(__dirname, `views/${req.url}`))
// })


sequelize.sync(
            // {force: true}
        )
        .then(() => {
            return User.findByPk(1);
        })
        .then(user => {
            if (!user) {
                return User.create({ name: 'test', email: 'test@gmail.com' });
            }
            return user;
        })
        .then(user => {
            return user.createCart();
        })
        .then(() => {
            app.listen(3000);
        })
        .catch(err => console.log(err));
    