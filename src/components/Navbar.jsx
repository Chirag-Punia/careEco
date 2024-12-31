import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button
} from "@nextui-org/react";

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Navbar 
      maxWidth="xl" 
      position="sticky" 
      className="bg-gradient-to-r from-purple-600 to-blue-600"
    >
      <NavbarBrand>
        <Link to="/" className="font-bold text-white text-xl">
          WebsiteBoss
        </Link>
      </NavbarBrand>

      {token && (
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem isActive={location.pathname === '/'}>
            <Link to="/" className="text-white">
              Home
            </Link>
          </NavbarItem>
          <NavbarItem isActive={location.pathname === '/templates'}>
            <Link to="/templates" className="text-white">
              Templates
            </Link>
          </NavbarItem>
          <NavbarItem isActive={location.pathname === '/generator'}>
            <Link to="/generator" className="text-white">
              Generator
            </Link>
          </NavbarItem>
        </NavbarContent>
      )}

      <NavbarContent justify="end">
        {token ? (
          <>
            <NavbarItem>
              <Link to="/create">
                <Button 
                  variant="flat" 
                  className="bg-white text-purple-600 font-semibold mr-2"
                >
                  Create Website
                </Button>
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Button 
                variant="flat" 
                className="bg-white text-purple-600 font-semibold"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem>
              <Link to="/login">
                <Button 
                  variant="flat" 
                  className="bg-white text-purple-600 font-semibold mr-2"
                >
                  Login
                </Button>
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link to="/signup">
                <Button 
                  variant="flat" 
                  className="bg-white text-purple-600 font-semibold"
                >
                  Sign Up
                </Button>
              </Link>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}