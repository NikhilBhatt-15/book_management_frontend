import React from 'react';
import './Home.css';

const Home = ({shopnow}) => {
  return (
    <div className="home">
      <div className="home-content">
        <h1>Fiction Book by famous Authors</h1>
        <h2>BUY THOUSANDS OF BOOKS ONLINE</h2>
        <button className="shop-now-btn" onClick={()=> shopnow()}>SHOP NOW</button>
      </div>
    </div>
  );
};

export default Home;
