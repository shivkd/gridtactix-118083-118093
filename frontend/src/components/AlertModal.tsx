import React from 'react';
import './AlertModal.css';

type Props = {
  message: string;
  onClose: () => void;
};

const AlertModal: React.FC<Props> = ({ message, onClose }) => (
  <div className="modal-backdrop">
    <div className="modal">
      <p className="modal-message">{message}</p>
      <button className="btn close-btn" onClick={onClose}>
        Close
      </button>
    </div>
  </div>
);

export default AlertModal;
