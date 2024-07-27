import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

const AddProduct = () => {

    const [image,setImage]=useState(false);
    const [productDetails,setProductDetails]=useState({
        name:"",
        image:"",
        category:"",
        old_price:'' ,
        new_price:'' ,
    });
    const imageHandler=(e)=>{
        setImage(e.target.files[0]);
    }

    const changeHandler=(e)=>{
        setProductDetails({...productDetails,[e.target.name]:e.target.value})
    }

    const Add_Product= async()=>{
        console.log(productDetails)
        let responseData;
        let product =productDetails;
        let formData=new FormData();
        formData.append('product',image);

        await fetch('https://ecommerce-backend-uflo.onrender.com/upload',{
            method:'POST',
            headers:{
                Accept:'application/json'
            },
            body:formData,
        }).then((resp) => resp.json()).then((data)=>{responseData=data})

        if(responseData.success){
            product.image=responseData.image_url;
            console.log(product)
            await fetch('https://ecommerce-backend-uflo.onrender.com/addproduct',{
                method:'POST',
                headers:{
                    Accept:'application/json',
                    'Content-Type':'application/json'
                    },
                    body:JSON.stringify(product),
            }).then((res)=>res.json()).then((data)=>{
                data.success?alert('Product Added Successfully'):alert('Failed to add product');
                
            })
        }



    }



  return (
    <div className='add-product'>
    <div className="add-product-itemfield">
        <p>Product Title</p>
        <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here'>
        </input>
    </div>
    <div className="add-product-price">
        <div className="add-product-itemfields">
            <p>Price</p>
            <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Type here'/>
        </div>
        <div className="add-product-itemfields">
            <p>Offer Price</p>
            <input  value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Type here'/>
        </div>
    </div>
    <div className="add-product-itemfield">
        <p>Product Category</p>
        <select  value={productDetails.category} onChange={changeHandler} name="category" className="add-product-selector">
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="kids">Kids</option>
        </select>
    </div>
    <div className="add-product-itemfield">
        <p>Upload image</p>
        <label htmlFor="file-input">
            <img src={image?URL.createObjectURL(image):upload_area} alt="" className='add-product-thumbnail-img'/>
        </label>
        <input onChange={imageHandler}id="file-input" type="file" name="image" hidden/>
    </div>
    <button onClick={()=>{Add_Product()}} className='add-product-btn'>Add Product</button>
    </div>
  )
}

export default AddProduct
