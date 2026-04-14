import React from 'react';

const FormProgress = ({ currentStep, totalSteps }) => {
  return (
    <div className="form-progress">
      <div className="progress-bar">
        <div 
          className="progress-filled" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      <div className="step-indicators">
        {[...Array(totalSteps)].map((_, index) => (
          <div 
            key={index}
            className={`step-indicator ${currentStep > index ? 'completed' : ''} ${currentStep === index + 1 ? 'current' : ''}`}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormProgress;