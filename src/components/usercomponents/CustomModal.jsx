import React from 'react';
import './CustomModal.css';

const CustomModal = ({ show, onClose, message }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h4>Order Confirmation</h4>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="modal-close-button">Close</button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
