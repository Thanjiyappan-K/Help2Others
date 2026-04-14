import React from 'react';

const FormActions = ({ currentStep, totalSteps, prevStep, nextStep }) => {
  return (
    <div className="form-actions">
      {currentStep > 1 && (
        <button
          type="button"
          className="btn btn-secondary"
          onClick={prevStep}
        >
          Previous
        </button>
      )}
      
      {currentStep < totalSteps ? (
        <button
          type="button"
          className="btn btn-primary"
          onClick={nextStep}
        >
          Next
        </button>
      ) : (
        <button
          type="submit"
          className="btn btn-success"
        >
          Submit Request
        </button>
      )}
    </div>
  );
};

export default FormActions;