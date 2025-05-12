import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GET_ACTIVE_PLANS } from '../graphql';
// import './SubscriptionPlans.css'; // Create this CSS file for custom styles

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const {loading,error,data}=useQuery(GET_ACTIVE_PLANS);
  const [plans,setPlans]=useState([]);
  
  // const plans = [
  //   {
  //     id: 1, // Add ID for backend reference
  //     name: 'Basic',
  //     price: 149, // Change to number for calculations
  //     resolution: '480p',
  //     devices: '1 device',
  //     description: 'Good video quality on one phone or tablet'
  //   },
  //   {
  //     id: 2,
  //     name: 'Standard',
  //     price: 299,
  //     resolution: '1080p',
  //     devices: '2 devices',
  //     description: 'Great video quality on two devices at the same time'
  //   },
  //   {
  //     id: 3,
  //     name: 'Premium',
  //     price: 499,
  //     resolution: '4K+HDR',
  //     devices: '4 devices',
  //     description: 'Ultra HD video quality on four devices at the same time'
  //   }
  // ];

  // useEffect(()=>{
  //   if(data && data.activeSubscriptionPlans){
  //     setPlans(data.activeSubscriptionPlans.map(plan=>({
  //       id:plan.id,
  //       name:plan.name,
  //       price:plan.price,
  //       resolution: plan.name.includes('Premium') ? '4K+HDR' : 
  //                 plan.name.includes('Standard') ? '1080p' : '480p',
  //       devices: plan.name.includes('Premium') ? '4 devices' : 
  //               plan.name.includes('Standard') ? '2 devices' : '1 device',
  //       description: plan.description

  //     })))
  //   }
  // },[data])
 
  useEffect(()=>{
    if(data && data.activeSubscriptionPlans){
      setPlans(data.activeSubscriptionPlans.map(plan=>({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        resolution: plan.name.includes('Premium') ? '4K+HDR' : 
                  plan.name.includes('Standard') ? '1080p' : '480p',
        devices: plan.name.includes('Premium') ? '4 devices' : 
                plan.name.includes('Standard') ? '2 devices' : '1 device',
        description: plan.description,
        durationDays:plan.durationDays,
        durationMonths:plan.durationMonths
        
      })));
    }
  },[data])

  const handleSelectPlan = (plan) => {
    navigate('/payment', { state: { plan } });
  };

  if (loading) return <div>Loading plans...</div>;
  if (error) return <div>Error loading plans: {error.message}</div>;

  const displayDuration = plans.durationMonths === 1 
  ? '1 month' 
  : `${plans.durationMonths} months`;

  return (
    <div className="subscription-banner">
      <div className="subscription-overlay">
        <div className="container py-5">
          <div className="subscription-content">
            <h1 className="subscription-title">Choose Your Plan</h1>
            <h2 className="subscription-subtitle">
              Enjoy unlimited movies and TV shows at an affordable price
            </h2>
            
            <div className="plans-container">
              {plans.map((plan, index) => (
                <div key={index} className="plan-card">
                  <div className="plan-card-body">
                    <h3 className="plan-name">{plan.name}</h3>
                    <h4 className="plan-price">{plan.price}<span>/{plan.durationMonths}months</span></h4>
                    <hr className="plan-divider" />
                    <ul className="plan-features">
                      <li>{plan.resolution} resolution</li>
                      <li>Watch on {plan.devices}</li>
                      <li>{plan.description}</li>
                      {/* <li>{plan.durationMonths}</li> */}
                    </ul>
                  </div>
                  <div className="plan-card-footer">
                    <button 
                      className="btn-select-plan"
                      onClick={() => handleSelectPlan(plan)}
                    >
                      Select Plan
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* <div className="text-center mt-4">
              <button 
                className="btn-skip"
                onClick={() => navigate('/dashboard')}
              >
                Skip for now
              </button>
            </div> */}
          </div>
        </div>
      </div>
      
      <img
        className="subscription-background"
        src="https://assets.nflxext.com/ffe/siteui/vlv3/6e32b96a-d4be-4e44-a19b-1bd2d2279b51/ee068656-14b9-4821-89b4-53b4937d9f1c/IN-en-20220516-popsignuptwoweeks-perspective_alpha_website_small.jpg"
        alt="Netflix background"
      />
    </div>
  );
};

export default SubscriptionPlans;