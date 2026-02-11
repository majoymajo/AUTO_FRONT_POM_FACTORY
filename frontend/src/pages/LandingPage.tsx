import React, { useRef } from 'react';
import { LandingHero } from '../components/landing/LandingHero';
import { LandingHowItWorks } from '../components/landing/LandingHowItWorks';
import { LandingTech } from '../components/landing/LandingTech';
import { LandingFooter } from '../components/landing/LandingFooter';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const landingRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleLaunchApp = () => {
    navigate('/kudos');
  };

  return (
    <div ref={landingRef}>
      <LandingHero onLaunchApp={handleLaunchApp} />
      <div id="como-funciona">
        <LandingHowItWorks />
      </div>
      <div id="tecnologia">
        <LandingTech />
      </div>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
