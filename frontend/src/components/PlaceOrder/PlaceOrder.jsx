import React, { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './PlaceOrder.css';
import { useLocation } from 'react-router-dom';
import GooglePayButton from '../GooglePay/GooglePayButton'; // Adjust the path as per your file structure





const PlaceOrder = () => {
  const [address, setAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });
  const location = useLocation();
  const totalAmount = location.state.totalAmount;

  useEffect(() => {
    console.log('Total amount received:', totalAmount);
  }, [totalAmount]);


  const [promoApplied, setPromoApplied] = useState(false);
  const navigate = useNavigate();


  const handleGooglePaySuccess = (paymentData) => {
    console.log('Google Pay payment successful:', paymentData);
  };

  const handleGooglePayError = () => {
    console.error('Google Pay payment failed');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value
    }));
  };

  const handlePromoApply = () => {
    setPromoApplied(true);
    setTimeout(() => setPromoApplied(false), 3000); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you can integrate Razorpay or any other payment method
    // For now, just navigate to a success page or process payment.
    // We'll simulate a payment process for now.
    try {
      navigate('/success'); 
    } catch (error) {
      console.error('Payment failed', error);
    }
  };

  return (
    <div className="placeorder">
      <div className="placeorder-left">
        <h2>Enter Shipping Details</h2>
        <form className="placeorder-form" >
          <input type="text" name="name" placeholder="Name" value={address.name} onChange={handleChange} required />
          <input type="text" name="street" placeholder="Street" value={address.street} onChange={handleChange} required />
          <input type="text" name="city" placeholder="City" value={address.city} onChange={handleChange} required />
          <input type="text" name="state" placeholder="State" value={address.state} onChange={handleChange} required />
          <input type="text" name="postalCode" placeholder="Postal Code" value={address.postalCode} onChange={handleChange} required />
          <input type="text" name="country" placeholder="Country" value={address.country} onChange={handleChange} required />
          <button type="button" className='saveadress'>Save Address</button>
        </form>
      </div>
      <div className="placeorder-right">
        <div className="placeorder-promocode-right">
          <p>If You Have a promo code, Enter It Here</p>
          <div className="placeorder-promobox">
            <input type="text" placeholder="Enter Promo Code" />
            <button type="button" onClick={handlePromoApply}>Apply</button>
          </div>
        </div>
        
        {/* Payment Options Section */}
        <div className="payment-options">
          <h3>Select Payment Method</h3>
          <div className="payment-methods" required>
          <div className="placeorder-total">
            <h4>Total Amount Payable:  $ {totalAmount}</h4>
            {/* <h3>${totalAmount}</h3> */}
          </div>
            <label>
              <input type="radio" name="paymentMethod" value="COD" />
              Cash on Delivery (COD)
            </label>
          </div>
          <button type="submit" onClick={handleSubmit}>Place Order</button>

          <p className="seperator">or</p>
          <div className="google-pay-container">
            <GooglePayButton
              totalPrice={totalAmount}
              onGooglePaySuccess={handleGooglePaySuccess}
              onGooglePayError={handleGooglePayError}
              
            />
          </div>
        </div>
      </div>

      {promoApplied && <div className="promo-notification">Promo code applied successfully!</div>}
    </div>
  );
};

export default PlaceOrder;
