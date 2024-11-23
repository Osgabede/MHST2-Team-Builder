import { useState } from "react";

const UserDetails = ({ user }) => {
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleTogglePassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const passLength = user.password.length;
  let blurredPassword = '';
  for (let i = 0; i < passLength; i++) {
    blurredPassword += '*';
  }

  return (
    <div className="user-details">
      <h2>User: {user.username}</h2>
      <p><strong>ID: </strong>{user._id}</p>
      <p><strong>Email: </strong>{user.email}</p>
      <p>
        <strong>Password: </strong>
        {showPassword ? user.password : blurredPassword}
        <i
          className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} 
          style={{ cursor: "pointer", marginLeft: "8px" }}
          onClick={handleTogglePassword} // Add the event listener here
        ></i>
      </p>
    </div>
  );
};

export default UserDetails;