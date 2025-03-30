import axios from "axios";

// Base URL for your CISE backend
const API_URL = "https://www.cise.ufl.edu/~samuel.stjean/Critter_Keeper/backend/api"; // REPLACE_LINK

// ---------- PERSON ENDPOINTS ----------
export const fetchPersons = async () => {
    try {
        const response = await axios.get(`${API_URL}/show.php`);
        return response.data;
    } catch (error) {
        console.error("Error fetching persons:", error);
        return [];
    }
};

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

export const deletePerson = async (Personid) => {
    try {
        await axios.get(`${API_URL}/delete.php?Personid=${Personid}`);
    } catch (error) {
        console.error("Error deleting person:", error);
    }
};

// ---------- PLAYER ENDPOINTS ----------
export const fetchPlayers = async () => {
    try {
        const response = await axios.get(`${API_URL}/show_players.php`);
        return response.data;
    } catch (error) {
        console.error("Error fetching players:", error);
        return [];
    }
};

export const addPlayer = async (player) => {
    try {
        const formData = new FormData();
        formData.append("Username", player.Username);

        await axios.post(`${API_URL}/add_player.php`, formData);
    } catch (error) {
        console.error("Error adding player:", error);
    }
};

export const deletePlayer = async (PlayerID) => {
    try {
        await axios.get(`${API_URL}/delete_player.php?PlayerID=${PlayerID}`);
    } catch (error) {
        console.error("Error deleting player:", error);
    }
};
