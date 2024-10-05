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
        const pokemon = await LoadingUtility.getAllRandBatSets();
        var data = [];
        for (var mon in await pokemon) {
          data.push({
            value: mon,
            label: mon,
            generation:
              pokemon[mon]["gen"] === undefined ? 9 : pokemon[mon]["gen"],
          });
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
    selectedMons[key] = selectedPokemon;
  }

  function generateTeam() {
    var teamString = "";

    for (var child in selectedMons) {
      teamString += LoadingUtility.generateMon(
        selectedMons[child].value,
        pokemonData[selectedMons[child].value],
        selectedMons[child].generation
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
      {/* TODO add the link for the teambuilder to streamline the process https://play.pokemonshowdown.com/teambuilder */}
      <button type="button" onClick={generateTeam}>
        Generate Team
      </button>

      <p style={{ whiteSpace: "pre-wrap" }}>{teamImport}</p>
    </div>
  );
}

export default Team;
