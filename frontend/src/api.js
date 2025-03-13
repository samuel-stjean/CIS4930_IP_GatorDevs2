import axios from "axios";

// Base URL for your CISE backend
const API_URL = "https://www.cise.ufl.edu/~samuel.stjean/Critter_Keeper/backend/api";

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
