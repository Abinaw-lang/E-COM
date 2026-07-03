import React from 'react';

const AmbientEffects = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-32 left-1/2 h-72 w-[32rem] -translate-x-1/2 bg-[radial-gradient(circle,_rgba(111,194,255,0.3)_0%,_rgba(0,0,0,0)_68%)] blur-3xl" />
      <div className="smoke smoke-one" />
      <div className="smoke smoke-two" />
      <div className="spotlight spotlight-left" />
      <div className="spotlight spotlight-right" />
      <div className="sports-particles" />
    </div>
  );
};

export default AmbientEffects;
