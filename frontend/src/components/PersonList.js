import React, { useEffect, useState } from "react";
import { fetchPersons, deletePerson } from "../api";

const PersonList = () => {
    const [persons, setPersons] = useState([]);

    // Fetch persons on load
    useEffect(() => {
        loadPersons();
    }, []);

    const loadPersons = async () => {
        try {
            const data = await fetchPersons();
            console.log("API Response:", data); // Debugging line

            // Ensure data is an array before setting state
            if (Array.isArray(data)) {
                setPersons(data);
            } else {
                console.error("Unexpected data format:", data);
                setPersons([]); // Fallback to empty array
            }
        } catch (error) {
            console.error("Error fetching persons:", error);
            setPersons([]); // Handle errors gracefully
        }
    };

    const handleDelete = async (Personid) => {
        try {
            await deletePerson(Personid);
            loadPersons(); // Refresh list
        } catch (error) {
            console.error("Error deleting person:", error);
        }
    };

    return (
        <div>
            <h2>Current Persons in Database</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Age</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(persons) && persons.length > 0 ? (
                        persons.map((person) => (
                            <tr key={person.Personid}>
                                <td>{person.Personid}</td>
                                <td>{person.FirstName}</td>
                                <td>{person.LastName}</td>
                                <td>{person.Age}</td>
                                <td>
                                    <button onClick={() => handleDelete(person.Personid)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No persons found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PersonList;
