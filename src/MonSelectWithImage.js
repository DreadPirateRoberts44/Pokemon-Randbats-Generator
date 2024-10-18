import Select from "react-select";

import React, { useState } from "react";

function MonSelectWithImage({ options, updateSelectedOptionForChild, childIndex }) {
  const [index] = useState(childIndex);
  const [selectedPokemon, setSelectedPokemon] = useState("");

  function handleSelect(pokemon) {
    updateSelectedOptionForChild(pokemon, index);
    setSelectedPokemon(pokemon["value"].toLowerCase());
  }

  return (
    <div className="image-dropdown-container">
      <img 
        src={`https://img.pokemondb.net/artwork/${selectedPokemon}.jpg`}
        alt={`${selectedPokemon}`}
        className="mon-image" 
      />

      <Select
        options={options}
        placeholder="Select a Pokemon"
        /*defaultValue={{value: 'Scizor', label: 'Scizor'}}*/ onChange={
          handleSelect
        }
      />
    </div>
  );
}
export default MonSelectWithImage;
