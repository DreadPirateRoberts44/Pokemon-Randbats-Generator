import "./App.css";

import React, { useState, useEffect } from "react";

import MonSelect from "./MonSelect.js";

function App() {
  const [options, setOptions] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [selectedMons, setSelectedMons] = useState([]);

  const [pokemonData, setPokemonData] = useState();

  const [teamImport, setTeamImport] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://pkmn.github.io/randbats/data/gen9randombattle.json"
        );

        const pokemon = response.json();

        var data = [];

        for (var i in await pokemon) {
          data.push({ value: i, label: i });
        }

        setPokemonData(await pokemon);

        setOptions(data);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);

        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  function updateSelectedOptionForChild(selectedPokemon, key) {
    selectedMons[key] = selectedPokemon.value;
  }

  function generateTeam() {
    var teamString = "";

    for (var child in selectedMons) {
      teamString += generateMon(
        selectedMons[child],
        pokemonData[selectedMons[child]]
      );
    }

    setTeamImport(teamString);
  }

  function generateMon(name, setForMon) {
    console.log(setForMon);

    var pokemonString = name + " @ ";

    const roleIndex = getRandomInt(Object.keys(setForMon["roles"]).length);

    const role = Object.keys(setForMon["roles"])[roleIndex];

    const level = setForMon["level"];

    const abilityIndex = getRandomInt(
      setForMon["roles"][role]["abilities"].length
    );

    const ability = setForMon["roles"][role]["abilities"][abilityIndex];

    const itemIndex = getRandomInt(setForMon["roles"][role]["items"].length);

    const item = setForMon["roles"][role]["items"][itemIndex];

    const teraIndex = getRandomInt(
      setForMon["roles"][role]["teraTypes"].length
    );

    const tera = setForMon["roles"][role]["teraTypes"][teraIndex];

    var evs = "";

    var ivs = "";

    for (var ev in setForMon["roles"][role]["evs"]) {
      evs += setForMon["roles"][role]["evs"][ev] + " " + ev + " /";
    }

    for (var iv in setForMon["roles"][role]["ivs"]) {
      ivs += setForMon["roles"][role]["ivs"][iv] + " " + iv + " /";
    }

    var moves = setForMon["roles"][role]["moves"];

    while (moves.length > 4) {
      moves.splice(getRandomInt(moves.length), 1);
    }

    pokemonString += item + "  \n";

    pokemonString += "Ability: " + ability + "  \n";

    pokemonString += "Level: " + level + "  \n";

    pokemonString += "Tera Type: " + tera + "  \n";

    var i = 0;

    while (i < moves.length) {
      pokemonString += "- " + moves[i] + "  \n";

      i++;
    }

    pokemonString += "\n";

    return pokemonString;
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  return (
    <div>
      {isLoading && <p>Loading...</p>}

      {!isLoading && (
        <div>
          <MonSelect
            options={options}
            updateSelectedOptionForChild={updateSelectedOptionForChild}
            childIndex={"child1"}
          />

          <MonSelect
            options={options}
            updateSelectedOptionForChild={updateSelectedOptionForChild}
            childIndex={"child2"}
          />

          <MonSelect
            options={options}
            updateSelectedOptionForChild={updateSelectedOptionForChild}
            childIndex={"child3"}
          />

          <MonSelect
            options={options}
            updateSelectedOptionForChild={updateSelectedOptionForChild}
            childIndex={"child4"}
          />

          <MonSelect
            options={options}
            updateSelectedOptionForChild={updateSelectedOptionForChild}
            childIndex={"child5"}
          />

          <MonSelect
            options={options}
            updateSelectedOptionForChild={updateSelectedOptionForChild}
            childIndex={"child6"}
          />
        </div>
      )}

      <button type="button" onClick={generateTeam}>
        Generate Team
      </button>

      <p style={{ whiteSpace: "pre-wrap" }}>{teamImport}</p>
    </div>
  );
}

export default App;
