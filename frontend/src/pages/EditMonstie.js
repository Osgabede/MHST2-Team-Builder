import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUsersContext } from '../hooks/useUsersContext';

const EditMonstie = () => {
  const { auth } = useUsersContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [error, setError] = useState(null);
  const monstie = location.state?.monstie;

  if (!monstie) {
    return <div>Monstie not found!</div>;
  }

  let monstieHighestAttack, monstieHighestDefense, monstieLowestDefense;

  // Get highest attack value and name
  monstieHighestAttack = Object.keys(monstie.attack).reduce((defaultElem, key) => {
    return monstie.attack[key] > monstie.attack[defaultElem] ? `${key}: ${monstie.attack[key]}` : defaultElem;
  }, 'physical');

  // Get highest defense value and name
  monstieHighestDefense = Object.keys(monstie.defense).reduce((defaultElem, key) => {
    return monstie.defense[key] > monstie.defense[defaultElem] ? `${key}: ${monstie.defense[key]}` : defaultElem;
  }, 'physical');

  // Get lowest defense value and name
  monstieLowestDefense = Object.keys(monstie.defense).reduce((defaultElem, key) => {
    return monstie.defense[key] < monstie.defense[defaultElem] ? `${key}: ${monstie.defense[key]}` : defaultElem;
  }, 'physical');

  return (
    <div id="edit-monstie-wrapper">
      <h2>Editing Monstie:</h2>
      <p>Click on any gene slot to add a gene</p>
      <div id="edit-monstie-box">
        <h2>{monstie.name}</h2>
        <img src={monstie.image} alt={monstie.name + " image"} />
        <ul id="monstie-stats">
          <li>HP: {monstie.hp}</li>
          <li>Speed: {monstie.speed}</li>
          <li>Attack: {monstieHighestAttack}</li>
          <li>Defense: {monstieHighestDefense}</li>
          <li>Weak Point: {monstieLowestDefense}</li>
          <li>Crit rate: {monstie.critRate}</li>
          <li>Recovery: {monstie.recovery}</li>
        </ul>
        <div id="monstie-genes">
          {/* Go through the genes and display their info if they exist*/}
          {monstie.genes.length > 0 && (
            monstie.genes.map((gene) => (
              <div key={gene._id} className="gene-box">
                <h4>{gene.name}</h4> {/* Gene name */}
                <p>Skill: {gene.skillName}</p> {/* Gene skill name */}
                <p>Type: {gene.type}</p> {/* Gene type */}
                <p>Element: {gene.element}</p> {/* Gene element */}
                <p>Description: {gene.description}</p> {/* Gene description */}
              </div>
            ))
          )}

          {/* Go through the genes and display "add gene" for each gene missing */}
          {monstie.genes.length < 9 && (
            Array.from({ length: 9 - monstie.genes.length }).map((_, index) => (
              <div key={`add-gene-${index}`} className="add-gene-box">
                <p>Add Gene</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EditMonstie;
