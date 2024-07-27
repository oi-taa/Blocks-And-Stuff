const port=process.env.PORT || 4000;

const express=require("express");
const app=express();
const mongoose=require('mongoose')
const jwt=require("jsonwebtoken");
const cors=require('cors');
const multer=require('multer');
const path=require('path');
const { type } = require("os");

app.use(express.json())
app.use(cors())

// Database Connection with mongoDB 
mongoose.connect("mongodb+srv://vishalkumar09837:Vishal03578106@cluster0.wi9rvw9.mongodb.net/ECOMMERCE");
//api creation
app.get("/",(req,res)=>{
    res.send("Express app is running")

})

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
})

const upload = multer({ storage: storage })

app.use('/images', express.static(path.join('upload/images')));

app.post("/upload", upload.single('product'), (req, res) => {
    
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});


// product schemes
const Product =mongoose.model("Product",{
    id:{
        type :Number,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    
    },
    new_price:{
        type:Number,
        required:true
    },
    old_price:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    available:{
        type:Boolean,
        default:true
    },
})


app.post('/addproduct',async (req,res)=>{
    let products =await Product.find({});
    let id;
    if(products.length > 0){
        let last_product_array=products.slice(-1);
        let last_product=last_product_array[0];
        id=last_product.id+1;
    }
    else{
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})

//creating api for delete product 
app.post('/removeproduct',async (req,res)=>{

    await Product.findOneAndDelete({id:req.body.id});
    console.log("removed")
    res.json({
        success:true,
        name:req.body.name
    })
})

// api to get all product 

app.get('/allproducts',async (req,res)=>{
    let products =await Product.find({});
    console.log("ALL PRODUCT FETCHED");
    res.send(products);
})

// user schemes auth

const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
        default:{},
    },
    date:{
        type:Date,
        default:Date.now(),
    }
})
  
 

// creating endpoint for register of users 
app.post ('/signup',async(req,res)=>{
    let check= await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"existing user found with same email id !" })
    }
    let cart={}
    for (let i =0 ;i<300;i++){
        cart[i]=0;
    }
    const user=new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart
    })

    await user.save();
    const data={
        user:{
            id:user.id,
    }}
    const token =jwt.sign(data,'secret_ecom');
    res.json({success:true,token:token})
     


})

// endpoint for user login

app.post ('/login', async(req,res)=>{
    let user =await Users.findOne({email:req.body.email});
    if (user){
        const passCompare = req.body.password===user.password;
        if(passCompare){
            const data ={
                user:{
                    id:user.id,
                }
            }
            const token= jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"wrong password"});
        }

    }
    else{
        res.json({success:false,errors:"user not found"});
    }
})


// endpoint for newcollection data

app.get('/newcollections',async(req,res)=>{
    let products=await Product.find({});
    let newcollection=products.slice(1).slice(-8);
    console.log('newcollection fetched');
    res.send(newcollection);
})

//endpoint for popular in women
app.get('/popularinwomen',async(req,res)=>{
    let products=await Product.find({category:"women"});
    let popular_in_women=products.slice(0,4);
    console.log('popular_in_women fetched');
    res.send(popular_in_women);
})


//create moddle ware to fetch user

const fetchUser =async(req,res,next)=>{
    const token=req.header('Auth-token');
    if(!token){
        res.status(401).send({errors:"please authenticate using valid token"});
    }
    else{
        try{
            const data=jwt.verify(token,'secret_ecom');
            req.user=data.user;
            next();
            

        }
        catch (error){
            res.status(401).send({errors:"please authenticate using valid token"});
        }
    }
}


//endpoint for add to cart

app.post('/addtocart',fetchUser,async(req,res)=>{
    // console.log(req.body,req.user);
    console.log("added",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId]+=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added")
})

//endpoint to remove product from cart 
app.post('/removefromcart',fetchUser,async(req,res)=>{
    console.log("removed",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if (userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId]-=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Removed")
})


//endpoint for get card

app.post('/getcart',fetchUser,async(req,res)=>{
    console.log("getcart")
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
}
)


// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})