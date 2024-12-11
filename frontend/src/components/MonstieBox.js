const MonstieBox = ({ monstie, isSelected }) => {
  return (
    <div className="monstie-box">
      <img src={monstie.image || './img/placeholder.jpg'} alt={monstie.name} />
      {isSelected && <span>{monstie.name}</span>}
    </div>
  );
};

export default MonstieBox;