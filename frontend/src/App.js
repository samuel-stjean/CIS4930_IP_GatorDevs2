import React, { useState } from "react";
import PersonList from "./components/PersonList";
import AddPerson from "./components/AddPerson";

const App = () => {
    const [refresh, setRefresh] = useState(false);

    const reloadPersons = () => setRefresh(!refresh);

    return (
        <div>
            <h1>Critter Keeper Database</h1>
            <AddPerson onPersonAdded={reloadPersons} />
            <PersonList key={refresh} />
        </div>
    );
};

export default App;
