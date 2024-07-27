import React from 'react'
import './Breadcrum.css'
import arrow_icon from '../assets/breadcrum_arrow.png'

const Breadcrum = (props) => {
    const {product}=props;

    if (!product) {
      return null; // or handle the case where product is not available
  }
  return (
    <div className='breadcrum'>
        HOME <img src={arrow_icon} alt=''/>SHOP <img src={arrow_icon}alt=''/>{
            product.category
        }<img src={arrow_icon} alt=''/>{product.name}
    </div>
  )
}

export default Breadcrum