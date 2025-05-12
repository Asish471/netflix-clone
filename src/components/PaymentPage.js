import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// import './PaymentPage.css';

import qrImage from '../photos/qr.png';
import { CREATE_RAZORPAY_ORDER, VERIFY_RAZORPAY_PAYMENT } from '../graphql';
import { useMutation } from '@apollo/client';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { plan } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [createOrder] = useMutation(CREATE_RAZORPAY_ORDER);
  const [verifyPayment] = useMutation(VERIFY_RAZORPAY_PAYMENT);

  useEffect(() => {
    if (!plan) {
      navigate('/plans');
    }
  }, [plan, navigate]);

  const handlePaymentSuccess = () => {
    navigate('/dashboard');
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };


  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }
      
      const user = JSON.parse(localStorage.getItem("currentUser"))

      // 2. Create order on backend
      const { data } = await createOrder({
        variables: { planId: plan.id,userId: user.id}
      });
      
      if (!data.createRazorpayOrder.success) {
        throw new Error(data.createRazorpayOrder.message);
      }
      
      const order = data.createRazorpayOrder;
      console.log("order",order);
      
      
      // 3. Initialize Razorpay checkout
      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: "Netflix Clone",
        description: `${plan.name} Subscription`,
        order_id: order.orderId,
        handler: async function(response) {
          console.log("response",response);
          
          // 4. Verify payment with backend
          const verification = await verifyPayment({
            variables: {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            }
          });
          
          if (!verification.data.verifyRazorpayPayment.success) {
            throw new Error(verification.data.verifyRazorpayPayment.message);
          }
          
          // Payment successful - redirect to dashboard
          navigate('/dashboard', { state: { paymentSuccess: true,
                                   message: "Payment successful! A confirmation has been sent to your email."} });
        },
        prefill: {
          name: "Customer Name", // You can get this from user profile
          email: "customer@example.com",
          contact: "9348596314"
        },
        theme: {
          color: "#E50914" // Netflix red
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
      
      rzp.on('payment.failed', function(response) {
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  

  // return (
  //   <div className="payment-banner">
  //     <div className="payment-overlay">
  //       <div className="container payment-content">
  //         <h1 className="payment-title">Complete Your Payment</h1>
  //         <h2 className="payment-subtitle">
  //           For the {plan?.name} plan - {plan?.price}/month
  //         </h2>
          
  //         <div className="payment-card">
  //           <div className="payment-card-body">
  //             <h3 className="plan-name">{plan?.name} Plan</h3>
  //             <h4 className="plan-price">{plan?.price}<span>/month</span></h4>
              
  //             <div className="payment-methods">
  //               <div className="payment-method">
  //                 <h5>UPI Payment</h5>
  //                 {/* Replace with your actual QR code image */}
  //                 <img 
  //                   src={qrImage} 
  //                   alt="UPI QR Code" 
  //                   className="qr-code"
  //                 />
  //                 <div className="upi-details">
  //                   <p className="upi-id">Your UPI ID: 9348596314-2@ybi</p>
  //                   <p className="scan-text">Scan QR code or send payment to the UPI ID</p>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
            
  //           <div className="payment-card-footer">
  //             <button 
  //               className="btn-payment-success"
  //               onClick={handlePaymentSuccess}
  //             >
  //               {/* I've Completed Payment */}
  //               Payment Completed

  //             </button>
  //             <button 
  //               className="btn-payment-back"
  //               onClick={() => navigate(-1)}
  //             >
  //               Back to Plans
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
      
  //     <img
  //       className="payment-background"
  //       src="https://assets.nflxext.com/ffe/siteui/vlv3/6e32b96a-d4be-4e44-a19b-1bd2d2279b51/ee068656-14b9-4821-89b4-53b4937d9f1c/IN-en-20220516-popsignuptwoweeks-perspective_alpha_website_small.jpg"
  //       alt="Netflix background"
  //     />
  //   </div>
  // );

  return (
    <div className="payment-banner">
      <div className="payment-overlay">
        <div className="container payment-content">
          <h1 className="payment-title">Complete Your Payment</h1>
          <h2 className="payment-subtitle">
            For the {plan?.name} plan - ₹{plan?.price}/month
          </h2>
          
          <div className="payment-card">
            <div className="payment-card-body">
              <h3 className="plan-name">{plan?.name} Plan</h3>
              <h4 className="plan-price">₹{plan?.price}<span>/month</span></h4>
              
              <div className="payment-methods">
                <div className="payment-method">
                  <h5>Secure Payment</h5>
                  <p>Pay with Credit/Debit Card, UPI, Net Banking</p>
                  
                  <button 
                    className="btn btn-danger btn-block"
                    onClick={handlePayment}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Pay Now'}
                  </button>
                  
                  {error && (
                    <div className="payment-error">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="payment-card-footer">
              <button 
                className="btn-payment-back"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Back to Plans
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <img
        className="payment-background"
        src="https://assets.nflxext.com/ffe/siteui/vlv3/6e32b96a-d4be-4e44-a19b-1bd2d2279b51/ee068656-14b9-4821-89b4-53b4937d9f1c/IN-en-20220516-popsignuptwoweeks-perspective_alpha_website_small.jpg"
        alt="Netflix background"
      />
    </div>
  );
};

export default PaymentPage;