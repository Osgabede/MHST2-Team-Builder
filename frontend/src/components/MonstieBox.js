const MonstieBox = ({ monstie }) => {
  return (
    <div className="monstie-box">
      <img src={monstie.image || './img/placeholder.jpg'} alt={monstie.name} />
      <span>{monstie.name}</span>
    </div>
  );
};

export default MonstieBox;