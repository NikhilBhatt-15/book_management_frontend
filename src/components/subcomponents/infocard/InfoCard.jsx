// src/VisitorCard.js

import React from 'react';
import './infocard.css'; 

const InfoCard = ({ icon, label, count }) => {
  return (
    <div className="info-card">
      <div className="icon">{icon}</div>
      <div className="text">
        <div className="label">{label}</div>
        <div className="count">{count}</div>
      </div>
    </div>
  );
};

export default InfoCard;
