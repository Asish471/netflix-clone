
import React, { useEffect, useState } from 'react';
import './App.scss';
import Header from './components/Header';
import HomeBanner from './components/HomeBanner';
import Login from './components/Login';
import Banner from './components/Banner';
import List from './components/List';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import { AuthProvider } from './contexts/authContext'; // Updated import path
import ProtectedRoute from './components/ProtectedRoute'; // New component for protected routes
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import SubscriptionPlans from './components/SubscriptionPlans';
import PaymentPage from './components/PaymentPage';
import MovieDetails from './components/MovieDetails';

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleMovieSelect = (movie) => {
    console.log("hello", movie); // logs the movie you clicked
    setSelectedMovie(movie);    // sets the state asynchronously
  };

  useEffect(() => {
    if (selectedMovie) {
      console.log("Selected movie updated:", selectedMovie);
      // Now you can use the updated state here
    }
  }, [selectedMovie]);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={
            <>
              <Header />
              <HomeBanner />
            </>
          } />
          
          <Route path='/login' element={
            <>
            <Header/>
            <Login />

          </>} />
          <Route path='/forgot-password' element={<>
            <Header/>
            <ForgotPassword/>
          </>}/>
          
          <Route path='/register' element={<><Header/><Register/></>} />
          
          {/* Protected routes */}
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Header />
              {/* <Banner movie={selectedMovie} /> */}
              <List onMovieSelect={handleMovieSelect} />
            </ProtectedRoute>
          } />

          <Route exact path='/movie/:id' element={
            <ProtectedRoute>
              <Header/>
              <Banner />
            </ProtectedRoute>
          }/>
        <Route path='/forgot-password' element={<ForgotPassword/>} />
        <Route path='/reset-password/:token' element={<ResetPassword/>} />
        <Route path='/plans' element={<>
        <Header/>
        <SubscriptionPlans/>
        </>}/>
        <Route path='/payment' element={<PaymentPage/>}/>

        

          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
