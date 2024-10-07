import gen9Data from "./database/gen9randombattle.json";
import gen8Data from "./database/gen8randombattle.json";
import gen7Data from "./database/gen7randombattle.json";
/**
 * Fetch and combine the gen 7-9 randbat sets to serve as the database for this tool
 * This is essentially at nat dex, though most unevolved pokemon are excluded
 *
 * @returns A JSON object that has the randbats sets for all pokemon with a randbat set
 *
 * TODO download the json files and reference them locally, at least for testing and development.
 *      it will be faster, and I'm paranoid if we run this enough people might get annoyed at us
 * TODO this function could likely be made much more performant (not that it's noticeably slow)
 *      since there's a known amount of dexited mons, and which database to pull them from
 *      we shouldn't need to loop over every possible entry and check
 */
export async function getAllRandBatSets() {
  //get each generation as a json object
  const gen9Mons = await getGenerationalData(9, true); // as the most recent generation serves as the aggregate set
  const gen8Mons = await getGenerationalData(8, false);
  const gen7Mons = await getGenerationalData(7, false);
  //compile dexited mons into gen 9 - this is required due to lack of natdex randbats
  mergeGenData(gen9Mons, gen8Mons, 8);
  mergeGenData(gen9Mons, gen7Mons, 7);
  return gen9Mons;
}

/**
 * Merge mainPokemonSet and addOnPokemonSet such that mainPokemonSet becomes the result of
 * mainPokemonSet union* addOnPokemonSet
 * union in terms of pokemon, not the respective pokemon attributes (for example, if a mon that exists in gen 9
 * has a z move in gen 7 it will not count as a distinct entry)
 * In addition, any pokemon coming from the union will have the generation of the addOnPokemonSet added as an attribute
 * in order to inform the structure of the json object they were loaded with
 *
 * @param mainPokemonSet a set of pokemon that will have the addOnPokemon added to it's set
 * @param addOnPokemon the set of pokemon to add into the mainPokemon set
 * @param generation the generation of the addOnPokemon dataset
 */
function mergeGenData(mainPokemonSet, addOnPokemon, generation) {
  for (const mon in addOnPokemon) {
    if (!mainPokemonSet.hasOwnProperty(mon)) {
      mainPokemonSet[mon] = addOnPokemon[mon];
      mainPokemonSet[mon]["gen"] = generation;
    }
  }
}

/**
 * Load json object for the given generation
 * @param generation the generation to load the data for
 * @param useLocal true if we should use the local copy otherwise fetch the online data
 * @returns the json object representing the given generation
 * TODO - look into the best way to not include non dexited pokemon in earlier gen data sets
 */
async function getGenerationalData(generation, useLocal) {
  if (useLocal) {
    if (generation === 9) {
      return gen9Data;
    } else if (generation === 8) {
      return gen8Data;
    } else if (generation === 7) {
      return gen7Data;
    } else {
      throw new Error("Unexpected generation");
    }
  } else {
    const url =
      "https://pkmn.github.io/randbats/data/gen" +
      generation +
      "randombattle.json";
    return await (await fetch(url)).json();
  }
}

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
 * TODO - potentially update both here and the data generation for initial load
 *        to check the actual data structure and not generation (in case this changes either in existing
 *        generations or in future generations)
 * TODO - get IVs. They only matter for confusion and foul play, so pretty niche
 * TODO - potentially clean up the special handling of gen 8 - overall it's not that bad
 */
export function generateMon(name, setForMon, generation) {
  let role;
  if (generation !== 8) {
    const roleIndex = getRandomInt(Object.keys(setForMon["roles"]).length);

    role = Object.keys(setForMon["roles"])[roleIndex];
  }
  const level = setForMon["level"];
  const ability = generateAbility(setForMon, generation, role);
  const item = generateItem(setForMon, generation, role);
  const tera = generateTera(setForMon, generation, role);
  const moves = generateMoves(setForMon, generation, role);

  return generateStringForMon(name, item, ability, level, tera, moves);
}

/**
 * Generate a move set for the given pokemon out of it's competively viable randbat move options
 * TODO - make this have some intelligence (ex no choice specs agility ampharos)
 * @param setForMon - the set for the given pokemon
 * @param generation - the generation for the given pokemon
 * @param role the pokemons role if it has one
 * @returns a set of competitively viable moves for the given pokemon
 */
function generateMoves(setForMon, generation, role) {
  let moves =
    generation === 8 ? setForMon["moves"] : setForMon["roles"][role]["moves"];

  while (moves.length > 4) {
    moves.splice(getRandomInt(moves.length), 1);
  }

  return moves;
}

/**
 * Generate an ability for the given pokemon
 * TODO - increase the intelligence of move/item/ability selection
 * @param setForMon - the set for the given pokemon
 * @param generation - the generation for the given pokemon
 * @param role the pokemons role if it has one. Generation 8 does not include role in the heirarchy
 * @returns one of pokemon's ability
 */
function generateAbility(setForMon, generation, role) {
  const abilityIndex =
    generation === 8
      ? getRandomInt(setForMon["abilities"].length)
      : getRandomInt(setForMon["roles"][role]["abilities"].length);

  const ability =
    generation === 8
      ? setForMon["abilities"][abilityIndex]
      : setForMon["roles"][role]["abilities"][abilityIndex];

  return ability;
}

/**
 * Determine the tera type for the given pokemon
 * TODO make this smarter for non gen 9 pokemon
 * @param setForMon - the set for the given pokemon, only
 * @param generation - the generation for the given pokemon, determines how to calculate the tera
 *                     gen 9 has them in the data set. gen 7 and 8 need to determine off of some other logic
 * @param role - only matters for gen 9 since the others don't have it in the database, used as index
 * @returns
 */
function generateTera(setForMon, generation, role) {
  if (generation === 9) {
    const teraIndex = getRandomInt(
      setForMon["roles"][role]["teraTypes"].length
    );
    return setForMon["roles"][role]["teraTypes"][teraIndex];
  } else {
    return "Steel"; // todo improve this logic
  }
}

/**
 * Generate an item for the given pokemon
 * TODO - increase the intelligence of move/item/ability selection
 * @param setForMon - the set for the given pokemon
 * @param generation - the generation for the given pokemon
 * @param role the pokemons role if it has one
 * @returns one of pokemon's items
 */
function generateItem(setForMon, generation, role) {
  const itemIndex =
    generation === 8
      ? getRandomInt(setForMon["items"].length)
      : getRandomInt(setForMon["roles"][role]["items"].length);

  const item =
    generation === 8
      ? setForMon["items"][itemIndex]
      : setForMon["roles"][role]["items"][itemIndex];

  return item;
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
