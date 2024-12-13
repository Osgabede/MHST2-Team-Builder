import React from 'react';

const MonstieBox = ({ monstie, isSelected, onMonstieClick }) => {
  const handleClick = (e) => {
    if (onMonstieClick) {
      e.stopPropagation(); // Evitar que el clic propague a otros elementos
      onMonstieClick(monstie); // Llamar a la función pasada por el padre
    }
  };

  return (
    <div className={`monstie-box ${onMonstieClick ? 'clickable' : ''}`} onClick={handleClick}>
      <img src={monstie.image || './img/placeholder.jpg'} alt={monstie.name} />
      {isSelected && <span>{monstie.name}</span>}
    </div>
  );
};

export default MonstieBox;
