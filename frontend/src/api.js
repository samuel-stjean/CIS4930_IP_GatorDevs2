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

// Save inventory for a player 
export const saveInventory = async (PlayerID, Inventory) => {
    try {
        const payload = { PlayerID, Inventory };
        console.log("[saveInventory] Sending to backend:", payload);

        const response = await axios.post(`${API_URL}/save_inventory.php`, payload);

        console.log("[saveInventory] Response from backend:", response.data);
    } catch (error) {
        console.error("[saveInventory] Error saving inventory:", error);
    }
};


// Load inventory for a player
export const loadInventory = async (playerId) => {
    try {
        const response = await fetch(`${API_URL}/load_inventory.php?PlayerID=${playerId}`);
        const raw = await response.text();

        // Remove the shebang line safely
        const clean = raw.replace(/^#!.*(\r?\n)/, '');

        return JSON.parse(clean);
    } catch (error) {
        console.error("Failed to load inventory:", error);
        return [];
    }
};



export const fetchPlayerById = async (playerId) => {
    const response = await fetch(`${API_URL}/get_player_by_id.php?PlayerID=${playerId}`);
    const raw = await response.text();
    const clean = raw.replace(/^#!.*\n?/, '').trim();
    return JSON.parse(clean);
};

// Login
export const loginPlayer = async (username, password) => {
    try {
        const response = await fetch(`${API_URL}/login.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Username: username, Password: password }),
        });
        const raw = await response.text();
        const clean = raw.replace(/^#!.*(\r?\n)?/, '').trim();
        return JSON.parse(clean);
    } catch (error) {
        console.error("Login failed:", error);
        return { error: "Login failed" };
    }
};

export const registerPlayer = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/register_player.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // match PHP expectations
        },
        body: JSON.stringify({
          Username: username,
          Password: password,
        }),
      });
  
      const raw = await response.text();
      const clean = raw.replace(/^#!.*(\r?\n)?/, '').trim();
      return JSON.parse(clean);
    } catch (error) {
      console.error("Registration failed:", error);
      return { error: "Registration failed" };
    }
  };
  
  export const savePlots = async (playerId, plots) => {
    await fetch(`${API_URL}/save_plots.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ PlayerID: playerId, Plots: plots }),
    });
  };
  
  export const loadPlots = async (playerId) => {
    const res = await fetch(`${API_URL}/load_plots.php?PlayerID=${playerId}`);
    const raw = await res.text();
    const clean = raw.replace(/^#!.*(\r?\n)?/, '').trim();
    return JSON.parse(clean); // array of plots
  };
  









