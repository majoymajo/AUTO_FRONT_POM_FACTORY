import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface UseNavbarProps {
  onNavigateToSection?: (id: string) => void;
}

export const useNavbar = ({ onNavigateToSection }: UseNavbarProps = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAppView = location.pathname === '/kudos';

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/' + (id === 'top' ? '' : '#' + id));
    } else if (onNavigateToSection) {
      onNavigateToSection(id);
    } else {
      // Internal anchor logic if onLanding but no explicit callback
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (id === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  const handleToggleView = () => {
    if (isAppView) {
      navigate('/');
    } else {
      navigate('/kudos');
    }
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return {
    isAppView,
    isScrolled,
    mobileMenuOpen,
    handleNavClick,
    handleToggleView,
    toggleMobileMenu,
    setMobileMenuOpen,
  };
};
