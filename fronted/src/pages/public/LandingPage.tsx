import React from 'react';
import {
  LandingNav,
  LandingHero,
  LandingAbout,
  LandingHowItWorks,
  LandingTech,
  LandingFooter,
} from '../../components/landing';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <LandingNav />
      <LandingHero />
      <LandingAbout />
      <LandingHowItWorks />
      <LandingTech />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
