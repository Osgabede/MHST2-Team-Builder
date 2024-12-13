import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUsersContext } from '../hooks/useUsersContext';

const EditMonstie = () => {
  const { auth } = useUsersContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [monstie, setMonstie] = useState(location.state?.monstie);
  const [team, setTeam] = useState(location.state?.team);

  if (!monstie) {
    return <div>Monstie not found!</div>;
  }

  // ------------------- Navigate back function -------------------
  const backToTeamPage = () => {
    const formattedName = team.name.replace(/ /g, '_');
    navigate(`/Teams/${auth.user.username}/${formattedName}`, { state: { team } });
  };

  // ------------------- Delete Monstie function -------------------
  const deleteMonstie = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/${auth.user._id}/teams/${team._id}/${monstie._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMonstie(null); // Set monstie to null after deletion
        setTeam(data.team); // Update team state

        // Navigate back to team page after deletion
        const formattedName = data.team.name.replace(/ /g, '_');
        navigate(`/Teams/${auth.user.username}/${formattedName}`, { state: { team: data.team } });
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      console.error('Error deleting monstie:', error);
    }
  };

  let monstieHighestAttack, monstieHighestDefense, monstieLowestDefense;

  // Get highest attack value and name
  monstieHighestAttack = Object.keys(monstie.attack).reduce((defaultElem, key) => {
    return monstie.attack[key] > monstie.attack[defaultElem.key] ? { key, value: monstie.attack[key] } : defaultElem;
  }, { key: Object.keys(monstie.attack)[0], value: monstie.attack[Object.keys(monstie.attack)[0]] });
  monstieHighestAttack = `${monstieHighestAttack.key} ${monstieHighestAttack.value}`;

  // Get highest defense value and name
  monstieHighestDefense = Object.keys(monstie.defense).reduce((defaultElem, key) => {
    return monstie.defense[key] > monstie.defense[defaultElem.key] ? { key, value: monstie.defense[key] } : defaultElem;
  }, { key: Object.keys(monstie.defense)[0], value: monstie.defense[Object.keys(monstie.defense)[0]] });
  monstieHighestDefense = `${monstieHighestDefense.key} ${monstieHighestDefense.value}`;

  // Get lowest defense value and name
  monstieLowestDefense = Object.keys(monstie.defense).reduce((defaultElem, key) => {
    return monstie.defense[key] < monstie.defense[defaultElem.key] ? { key, value: monstie.defense[key] } : defaultElem;
  }, { key: Object.keys(monstie.defense)[0], value: monstie.defense[Object.keys(monstie.defense)[0]] });
  monstieLowestDefense = `${monstieLowestDefense.key} ${monstieLowestDefense.value}`;

  return (
    <div id="edit-monstie-wrapper">
      <h2>Editing Monstie</h2>
      <div id="edit-monstie-box">
        <div id="monstie-name-and-img">
          <h2>{monstie.name}</h2>
          <img src={monstie.image} alt={monstie.name + " image"} />
        </div>
        <ul id="monstie-stats">
          <li><span>HP</span> <span>{monstie.hp}</span></li>
          <li><span>Speed</span> <span>{monstie.speed}</span></li>
          <li><span>Attack</span> <span>{monstieHighestAttack}</span></li>
          <li><span>Defense</span> <span>{monstieHighestDefense}</span></li>
          <li><span>Weakness</span> <span>{monstieLowestDefense}</span></li>
          <li><span>Crit rate</span> <span>{monstie.critRate}</span></li>
          <li><span>Recovery</span> <span>{monstie.recovery}</span></li>
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
                Add Gene
              </div>
            ))
          )}
        </div>
      </div>
      <button id="delete-monstie" onClick={() => deleteMonstie()}>Delete Monstie</button>
      <button id="back-to-team" onClick={() => backToTeamPage()}>Back to Teams page</button>
    </div>
  );
};

export default EditMonstie;
