import React, { useState, useEffect } from 'react';

const MonstieModal = ({ isOpen, onClose, onSelectMonstie, monsties }) => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedElement, setSelectedElement] = useState('');

  const getElement = (monstie) => {
    const highestAttackElement = Object.keys(monstie.attack).reduce((maxElem, key) => {
      return monstie.attack[key] > monstie.attack[maxElem] ? key : maxElem;
    }, 'physical');

    // Return the element with the highest value between attack and defense
    return highestAttackElement;
  };

  const filteredMonsties = monsties.filter((monstie) => {
    const matchesName = monstie.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = !selectedType || monstie.type === selectedType;
    const matchesElement = !selectedElement || getElement(monstie) === selectedElement;
    return matchesName && matchesType && matchesElement;
  });

  if (!isOpen) return null;

  return (
    <div className="monstie-modal-overlay" onClick={onClose}>
      <div className="monstie-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Select a Monstie</h3>
        <button onClick={onClose}>&times;</button>
        <input
          type="text"
          placeholder="Search for a monstie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select onChange={(e) => setSelectedType(e.target.value)} value={selectedType}>
          <option value="">Filter by type</option>
          <option value="power">Power</option>
          <option value="speed">Speed</option>
          <option value="tech">Tech</option>
        </select>
        <select onChange={(e) => setSelectedElement(e.target.value)} value={selectedElement}>
          <option value="">Filter by element</option>
          <option value="physical">Physical</option>
          <option value="fire">Fire</option>
          <option value="water">Water</option>
          <option value="thunder">Thunder</option>
          <option value="ice">Ice</option>
          <option value="dragon">Dragon</option>
        </select>
        <div id="filtered-list-wrapper">
          <ul className="monstie-list">
            {filteredMonsties.map((monstie) => (
              <li
                key={monstie._id}
                className="monstie-list-item"
                onClick={() => onSelectMonstie(monstie)}
              >
                <img
                  src={monstie.image || 'default-image.jpg'}
                  alt={monstie.name}
                  className="monstie-image"
                />
                <span className="monstie-name">{monstie.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MonstieModal;