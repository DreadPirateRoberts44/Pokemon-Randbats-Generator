import Select from "react-select";

import React, { useState } from "react";

function MonSelect({ options, updateSelectedOptionForChild, childIndex }) {
  const [index] = useState(childIndex);

  function handleSelect(pokemon) {
    updateSelectedOptionForChild(pokemon, index);
  }

  return (
    <div>
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
export default MonSelect;
