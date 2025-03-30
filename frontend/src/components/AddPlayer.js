import React, { useState } from "react";
import { addPlayer } from "../api";

const AddPlayer = ({ onPlayerAdded }) => {
    const [username, setUsername] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim()) return;

        await addPlayer({ Username: username });
        setUsername("");
        onPlayerAdded(); // Refresh the player list
    };

    return (
        <div>
            <h2>Add a New Player</h2>
            <form onSubmit={handleSubmit}>
                <label>Username:</label>
                <input
                    type="text"
                    name="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <br />
                <button type="submit">Add Player</button>
            </form>
        </div>
    );
};

export default AddPlayer;
