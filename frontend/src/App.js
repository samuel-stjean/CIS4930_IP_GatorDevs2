import React, { useState } from "react";
import PersonList from "./components/PersonList";
import AddPerson from "./components/AddPerson";
import AddPlayer from "./components/AddPlayer";
import PlayerList from "./components/PlayerList";

const App = () => {
    const [refresh, setRefresh] = useState(false);
    const reload = () => setRefresh(!refresh);

    return (
        <div>
            <h1>Critter Keeper Database</h1>

            {/* Person Section */}
            <AddPerson onPersonAdded={reload} />
            <PersonList key={`person-${refresh}`} />

            <hr />

            {/* Player Section */}
            <AddPlayer onPlayerAdded={reload} />
            <PlayerList key={`player-${refresh}`} />
        </div>
    );
};

export default App;
