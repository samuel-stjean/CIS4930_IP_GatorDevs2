import React, { useState } from "react";
import { addPerson } from "../api";

const AddPerson = ({ onPersonAdded }) => {
    const [person, setPerson] = useState({ FirstName: "", LastName: "", Age: "" });

    const handleChange = (e) => {
        setPerson({ ...person, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addPerson(person);
        setPerson({ FirstName: "", LastName: "", Age: "" });
        onPersonAdded(); // Refresh the person list
    };

    return (
        <div>
            <h2>Add a New Person</h2>
            <form onSubmit={handleSubmit}>
                <label>First Name:</label>
                <input type="text" name="FirstName" value={person.FirstName} onChange={handleChange} required />
                <br />
                <label>Last Name:</label>
                <input type="text" name="LastName" value={person.LastName} onChange={handleChange} required />
                <br />
                <label>Age:</label>
                <input type="number" name="Age" value={person.Age} onChange={handleChange} required />
                <br />
                <button type="submit">Add Person</button>
            </form>
        </div>
    );
};

export default AddPerson;
