// src/components/GooglePayButton.jsx
import React from 'react';
import './GooglePayButton.css';

const GooglePayButton = ({ totalPrice, onGooglePaySuccess, onGooglePayError }) => {
  const googlePayOptions = {
    environment: 'TEST', // Use 'PRODUCTION' for real payments
    apiVersion: 2,
    apiVersionMinor: 0,
    merchantInfo: {
      merchantName: 'dealbazar',
      merchantId: 'BCR2DN4TWXIJ3FRU', // Your Merchant ID from Google Pay
    },
    allowedPaymentMethods: [
      {
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['AMEX', 'DISCOVER', 'INTERAC', 'JCB', 'MASTERCARD', 'VISA'],
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            gateway: 'example',
            gatewayMerchantId: 'exampleGatewayMerchantId', // Replace with your gateway merchant ID
          },
        },
      },
    ],
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPrice: `${totalPrice}`,
      currencyCode: 'INR',
    },
  };

  const onLoadPaymentData = (paymentData) => {
    console.log('Payment successful', paymentData);
    onGooglePaySuccess(paymentData);
    // Redirect to success page with total amount
    window.location.href = `/success?total=${totalPrice}`;
  };

  const onGooglePayButtonClicked = () => {
    const paymentsClient = new window.google.payments.api.PaymentsClient({
      environment: googlePayOptions.environment,
    });

    const paymentDataRequest = Object.assign({}, googlePayOptions);

    paymentsClient
      .loadPaymentData(paymentDataRequest)
      .then(onLoadPaymentData)
      .catch((err) => {
        console.error('Error loading payment data', err);
        onGooglePayError();
      });
  };

  return (
    <button onClick={onGooglePayButtonClicked} className="google-pay-button">
      Pay with Google Pay
    </button>
  );
};

export default GooglePayButton;
