import React, { useState } from "react";
import '../styles/RegisterPage.css';

const RegisterPage = ({ onRegisterSuccess }) => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      const formData = new FormData();
      formData.append("Username", username);
      formData.append("FirstName", firstName);
      formData.append("LastName", lastName);
      formData.append("Age", age);

      const response = await fetch(
        "https://www.cise.ufl.edu/~david.vera/CIS4930_IP_GatorDevs2/backend/api/add_player.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (result.success) {
        setMessage("Registration successful! Redirecting...");
        setTimeout(() => {
          onRegisterSuccess();
        }, 1500);
      } else {
        setMessage(result.error || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error occurred.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto mt-10 shadow rounded-lg bg-white">
      <h2 className="text-xl font-semibold mb-4">Register</h2>

      <input
        type="text"
        className="border p-2 w-full mb-3"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        className="border p-2 w-full mb-3"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type="text"
        className="border p-2 w-full mb-3"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <input
        type="number"
        className="border p-2 w-full mb-4"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      <button onClick={handleRegister} className="bg-green-500 text-white px-4 py-2 rounded w-full">
        Register
      </button>
      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </div>
  );
};

export default RegisterPage;
