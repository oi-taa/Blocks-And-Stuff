import React, { useState, useEffect } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';

const ListProduct = () => {
    const [allproducts, setAllProduct] = useState([]);

    const fetchInfo = async () => {
        try {
            const response = await fetch('https://ecommerce-backend-uflo.onrender.com/allproducts');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setAllProduct(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    const remove_product= async(id)=>{
        await fetch('https://ecommerce-backend-uflo.onrender.com/removeproduct',{
            method: 'POST',
            headers: {
                Accept:'application/json',
                'Content-Type': 'application/json'
        },
        body:JSON.stringify({id:id})
    })
    await fetchInfo();
    }

    return (
        <div className='list-product'>
            <h1>All Products List</h1>
            <div className="list-product-format-main">
                <p>Product</p>
                <p>Title</p>
                <p>Category</p>
                <p>Old price</p>
                <p>New price</p>
                <p>Remove</p>
            </div>
            <div className="list-product-allproducts">
                <hr/>
                {allproducts.map((product, index) => (
                    <div key={product.id} className="list-product-format-main"  id="list-product-format">
                        <img src={product.image} alt="" className="list-product-product-icon" />
                        <p>{product.name}</p>
                        <p>{product.category}</p>
                        <p>${product.old_price}</p>
                        <p>${product.new_price}</p>
                        <img onClick={()=>{remove_product(product.id)}} className='list-product-remove-icon' src={cross_icon} alt=""/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListProduct;
