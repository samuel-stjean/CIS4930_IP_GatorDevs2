import React, { useEffect, useState } from "react";
import { fetchPlayers, deletePlayer } from "../api";

const PlayerList = () => {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        loadPlayers();
    }, []);

    const loadPlayers = async () => {
        try {
            const data = await fetchPlayers();
            setPlayers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching players:", error);
            setPlayers([]);
        }
    };

    const handleDelete = async (PlayerID) => {
        try {
            await deletePlayer(PlayerID);
            loadPlayers();
        } catch (error) {
            console.error("Error deleting player:", error);
        }
    };

    return (
        <div>
            <h2>Current Players in Database</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Player ID</th>
                        <th>Username</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {players.length > 0 ? (
                        players.map((player) => (
                            <tr key={player.PlayerID}>
                                <td>{player.PlayerID}</td>
                                <td>{player.Username}</td>
                                <td>
                                    <button onClick={() => handleDelete(player.PlayerID)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No players found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PlayerList;
