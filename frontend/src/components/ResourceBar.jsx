import React from 'react';
import { useGame } from '../contexts/GameContext';
import '../styles/ResourceBar.css';

const ResourceBar = () => {
  const { setSelectedResource } = useGame();

  const handleClick = (resourceType) => {
    setSelectedResource(resourceType);
  };

  const resources = [
    { name: 'Food', icon: `${process.env.PUBLIC_URL}/assets/icons/food.png`, type: 'food' },
    { name: 'Water', icon: `${process.env.PUBLIC_URL}/assets/icons/water.png`, type: 'water' },
  ];

  return (
    <div className="resource-section panel">
      <h2 className="section-title">Resources</h2>
      <div className="resource-grid">
        {resources.map((resource, index) => (
          <div
            key={index}
            className="resource-item"
            onClick={() => handleClick(resource.type)}
          >
            <img src={resource.icon} alt={resource.name} className="resource-icon" />
            <span className="resource-label">{resource.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceBar;
