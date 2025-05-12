import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomeBanner = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleGetStarted = (e) => {
    e.preventDefault();
    if (email) {
      navigate("/login", { state: { email } });
    } else {
      navigate("/");
    }
  };

  return (
    <div className="home-banner">
      <div className="our-story">
        <h1 className="our-story-card-title" data-uia="hero-title">
          Unlimited movies, TV shows and more.
        </h1>
        <h2 className="our-story-card-subtitle" data-uia="our-story-card-subtitle">
          Starts at ₹149. Cancel at any time.
        </h2>
        <p className="email-form-title">
          Ready to watch? Enter your email to create or restart your membership.
        </p>
        <form onSubmit={handleGetStarted}>
          <div className="input-group">
            <input
              type="email"
              className="form-control"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
              className="btn btn-danger btn-block  text-white mx-2" 
              type="submit"
            >
              Get Started
            </button>
          </div>
        </form>
      </div>
      <div className="shadow"></div>
      <img
        className="concord-img vlv-creative"
        src="https://assets.nflxext.com/ffe/siteui/vlv3/6e32b96a-d4be-4e44-a19b-1bd2d2279b51/ee068656-14b9-4821-89b4-53b4937d9f1c/IN-en-20220516-popsignuptwoweeks-perspective_alpha_website_small.jpg"
        alt=""
      />
    </div>
  );
};

export default HomeBanner;