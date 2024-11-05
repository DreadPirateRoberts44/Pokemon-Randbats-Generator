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

        /**
         * TODO
         * Make this data array sorted alphabetically
         * The way databases are added across gens, the added mons are out of order
         * It's not terrible since there's search enabled, but I did think mons were missing
         * (I kept checking for alakazam without typing)
         * Additionally, and likely at the same time, this is probably better taken from PokeAPI,
         * or someother similar source (including just having a list in the project)
         * if the future vision is to allow users to select unevolved mons and map them to the evolved form
         */
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
    navigator.clipboard.writeText(teamString); //copy team string to clipboard
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
      <div class="center">
        <button type="button" onClick={generateTeam}>
          Generate Team
        </button>
      </div>
      <div class="center">
          <a href="https://play.pokemonshowdown.com/teambuilder" target="_blank">Go to Pokemon Showdown Teambuilder</a>
      </div>

      <p class="import-text" style={{ whiteSpace: "pre-wrap" }}>{teamImport}</p>
    </div>
  );
}

export default Team;
