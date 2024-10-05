/**
 * Returns a Pokemon Showdown friendly import string for a given pokemon
 * based on random possible attributes based on randombats sets
 * @param name - name of the mon to generate import text for
 * @param setForMon - randbat data for specified mon
 * @param generation - the generation for the mon. This is important, as gens 7 and 9 sets have roles
 *                     which we have to respect, but gen 8 does not for some reason. Gen 9 is also the only
 *                     generation to have tera types on the set
 * @returns a string in the format to import into pokemon showdown
 *          this string will have the mon, a relevant item, ability,
 *          84 evs in every stat, no ivs, no nature, 4 moves chosen at random from their
 *          relevant move set, a relevant tera, and most important for balancing
 *          the level it uses in randbats.
 *
 * TODO - set tera for mons prior to gen 9
 * TODO - increase the intelligence of move/item/ability selection
 *        ex: Ampharos can run specs or life orb, and one it's relevant moves is agility
 *            currently no check takes place to ensure it's not specs agility ampharos
 * TODO - potentially update both here and the data generation for initial load
 *        to check the actual data structure and not generation (in case this changes either in existing
 *        generations or in future generations)
 * TODO - get IVs. They only matter for confusion and foul play, so pretty niche
 */
export function generateMon(name, setForMon, generation) {
  console.log(setForMon);

  const roleIndex = getRandomInt(Object.keys(setForMon["roles"]).length);

  const role = Object.keys(setForMon["roles"])[roleIndex];

  const level = setForMon["level"];

  const abilityIndex = getRandomInt(
    setForMon["roles"][role]["abilities"].length
  );

  const ability = setForMon["roles"][role]["abilities"][abilityIndex];

  const itemIndex = getRandomInt(setForMon["roles"][role]["items"].length);

  const item = setForMon["roles"][role]["items"][itemIndex];

  var tera;
  if (generation === 9) {
    const teraIndex = getRandomInt(
      setForMon["roles"][role]["teraTypes"].length
    );

    tera = setForMon["roles"][role]["teraTypes"][teraIndex];
  } else {
    tera = "Steel";
  }

  var moves = setForMon["roles"][role]["moves"];

  while (moves.length > 4) {
    moves.splice(getRandomInt(moves.length), 1);
  }
  return generateStringForMon(name, item, ability, level, tera, moves);
}

/**
 * Creates a pokemon showdown friendly import string given the following parameters
 * Note that all parameters are currently required
 * @param name - the pokemons name
 * @param item - the pokemons held item
 * @param ability - the pokemons ability
 * @param level - the pokemons randbats balanced level
 * @param tera - the tera for the pokemon
 * @param moves - the moves chosen for the pokemon
 * @returns A string to import the given mon and attributes into pokemon showdown
 */
function generateStringForMon(name, item, ability, level, tera, moves) {
  var pokemonString = name + " @ ";
  pokemonString += item + "  \n";

  pokemonString += "Ability: " + ability + "  \n";

  pokemonString += "Level: " + level + "  \n";

  pokemonString += "Tera Type: " + tera + "  \n";

  pokemonString += "EVs: 84 HP / 84 Atk / 84 Def / 84 SpA / 84 SpD / 84 Spe\n"; // evs are always 84 across the board

  var i = 0;

  while (i < moves.length) {
    pokemonString += "- " + moves[i] + "  \n";

    i++;
  }
  pokemonString += "\n";
  return pokemonString;
}

/**
 * Generate a random number x, where  0 <= x < max
 * @param max - the non inclusive upper limit for the random number
 * @returns a random number from 0 to (max-1)
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
