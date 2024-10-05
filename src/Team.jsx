import "./App.css";

import React, { useState, useEffect } from "react";

import MonSelect from "./MonSelect.js";

import * as LoadingUtility from "./LoadingUtility.js";

function Team() {
  const [options, setOptions] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [selectedMons] = useState([]);

  const [pokemonData, setPokemonData] = useState();

  const [teamImport, setTeamImport] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://pkmn.github.io/randbats/data/gen7randombattle.json"
        );

        const pokemon = response.json();

        var data = [];

        for (var i in await pokemon) {
          data.push({ value: i, label: i, generation: 8 });
        }

        setPokemonData(await pokemon);
        console.log(await pokemon);
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
      teamString += LoadingUtility.generateMon(
        selectedMons[child],
        pokemonData[selectedMons[child]]
      );
    }

    setTeamImport(teamString);
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

export default Team;
