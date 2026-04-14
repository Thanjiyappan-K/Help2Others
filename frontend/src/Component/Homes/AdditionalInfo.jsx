// components/steps/AdditionalInfo.js
import React from 'react';

const AdditionalInfo = ({ formData, handleChange, handleFileUpload }) => {
  return (
    <div className="form-step">
      <h3>Priority and Additional Information</h3>
      
      <div className="form-group">
        <label htmlFor="priorityLevel">Priority Level</label>
        <select
          id="priorityLevel"
          name="priorityLevel"
          value={formData.priorityLevel}
          onChange={handleChange}
        >
          <option value="low">Low - Can wait</option>
          <option value="medium">Medium - Needed soon</option>
          <option value="high">High - Urgent need</option>
          <option value="critical">Critical - Emergency</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="additionalNotes">Additional Notes</label>
        <textarea
          id="additionalNotes"
          name="additionalNotes"
          value={formData.additionalNotes}
          onChange={handleChange}
          rows="3"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="proofDocuments">Upload Supporting Documents</label>
        <div className="file-upload">
          <input
            type="file"
            id="proofDocuments"
            name="proofDocuments"
            onChange={handleFileUpload}
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <p className="file-help">Please upload registration certificates, licenses, or other relevant documents. (Max 5MB each)</p>
        </div>
      </div>
      
      <div className="form-group">
        <div className="consent-check">
          <input
            type="checkbox"
            id="consentCheck"
            required
          />
          <label htmlFor="consentCheck">I certify that all the information provided is true and accurate. I understand that providing false information may result in the rejection of our request.</label>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfo;