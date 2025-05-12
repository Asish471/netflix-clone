



import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/authContext"; // Updated import path
import { useApolloClient, useMutation } from '@apollo/client';
import { LOG_OUT } from "../graphql";
import { Variable } from "lucide-react";
import { useEffect } from "react";

const Header = () => {
  const navigate = useNavigate();
  const location=useLocation();
  const { isAuthenticated, logout } = useAuth();
  const client = useApolloClient();
  const [logout_auth,{ data, loading, error }] = useMutation(LOG_OUT)
  console.log(data);
  

  // const handleAuthAction = (e) => {
  //   e.preventDefault();
  //   if (isAuthenticated) {
  //     logout();
  //     client.resetStore();
  //     navigate('/');
  //   } else {
  //     navigate('/login');
  //   }
  // };

  
  
  const handleLogout = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("refreshToken");
      console.log("token",token);
      
      if (!token) {
        navigate('/login')
        isAuthenticated(false)
        console.error("No refresh token found in localStorage.");
        
      }

  
    try {
      const { data } = await logout_auth({
        variables: {
          refreshToken: token
        },
      });
  
      if (data?.revokeToken?.success) {
        localStorage.clear();
        navigate('/');
       
      } else {
        console.error('Logout failed:', data?.revokeToken?.errors || 'Unknown error');
      }
    } catch (err) {
      console.error("Apollo error:", err);
    }
  };
  useEffect(()=>{

  },[isAuthenticated])
  
  
  

  const hideAuthButtonRoutes=['/login','/register'];
  const hideAuthButton=hideAuthButtonRoutes.includes(location.pathname);

  return (
    <header className="topNav position-relative">
      <nav className="navbar navbar-expand-md navbar-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to='/'>
            <img 
              className="nav__logo" 
              src="https://www.freepnglogos.com/uploads/netflix-logo-0.png" 
              alt="Netflix Logo" 
            />
          </Link>
          
          {!hideAuthButton && (
            <div className="navbar">
              <form className="d-flex" role="search">
                <button 
                  className="btn btn-danger btn-block" 
                  onClick={handleLogout}
                >
                  {isAuthenticated ? 'Sign Out' : 'Sign In'}
                </button>
              </form>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;