import axios from "axios";

// Base URL for your CISE backend
const API_URL = "https://www.cise.ufl.edu/~samuel.stjean/Critter_Keeper/backend/api";

// ==================== PERSONS (LEGACY) ==================== //

// Fetch all persons from the database
export const fetchPersons = async () => {
    try {
        const response = await axios.get(`${API_URL}/show.php`);
        return response.data;
    } catch (error) {
        console.error("Error fetching persons:", error);
        return [];
    }
};

// Add a new person
export const addPerson = async (person) => {
    try {
        const formData = new FormData();
        formData.append("FirstName", person.FirstName);
        formData.append("LastName", person.LastName);
        formData.append("Age", person.Age);

        await axios.post(`${API_URL}/add.php`, formData);
    } catch (error) {
        console.error("Error adding person:", error);
    }
};

// Delete a person
export const deletePerson = async (Personid) => {
    try {
        await axios.get(`${API_URL}/delete.php?Personid=${Personid}`);
    } catch (error) {
        console.error("Error deleting person:", error);
    }
};

// ==================== PLAYERS ==================== //

// Save player coins to backend
export const savePlayerCoins = async (PlayerID, Coins) => {
    const formData = new FormData();
    formData.append("PlayerID", PlayerID);
    formData.append("Coins", Coins);
    try {
        await axios.post(`${API_URL}/update_player_coins.php`, formData);
    } catch (err) {
        console.error("Error saving coins:", err);
    }
};

// Fetch all players
export const fetchPlayers = async () => {
    try {
        const response = await axios.get(`${API_URL}/show_players.php`);
        return response.data;
    } catch (error) {
        console.error("Error fetching players:", error);
        return [];
    }
};

// Add a new player (with username)
export const addPlayer = async (username) => {
    const formData = new FormData();
    formData.append("Username", username);
    try {
        const response = await axios.post(`${API_URL}/add_player.php`, formData);
        return response.data;
    } catch (error) {
        console.error("Error adding player:", error);
    }
};

// Delete a player by PlayerID
export const deletePlayer = async (PlayerID) => {
    try {
        await axios.get(`${API_URL}/delete_player.php?PlayerID=${PlayerID}`);
    } catch (error) {
        console.error("Error deleting player:", error);
    }
};
