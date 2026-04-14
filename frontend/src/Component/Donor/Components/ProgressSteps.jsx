import React from 'react';

const ProgressSteps = ({ currentStep }) => {
  return (
    <div className="progress-steps">
      <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
      <div className="step-line"></div>
      <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
      <div className="step-line"></div>
      <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
      <div className="step-line"></div>
      <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>4</div>
    </div>
  );
};

export default ProgressSteps;