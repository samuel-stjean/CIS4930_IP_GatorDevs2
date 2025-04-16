import React from 'react';
import { useGame } from '../contexts/GameContext';
import '../styles/ResourceCursor.css';

const ResourceCursor = () => {
  const { selectedResource, cursorPosition } = useGame();

  if (!selectedResource) return null;

  const iconMap = {
    food: `${process.env.PUBLIC_URL}/assets/icons/food.png`,
    water: `${process.env.PUBLIC_URL}/assets/icons/water.png`
  };

  return (
    <img
      src={iconMap[selectedResource]}
      alt={selectedResource}
      className="resource-cursor"
      style={{
        left: `${cursorPosition.x}px`,
        top: `${cursorPosition.y}px`,
      }}
    />
  );
};

export default ResourceCursor;
