import axios from "axios";
const getPokemonList = async (url) => {
  const response = await axios.get(url);

  response.data.results = response.data.results.map((pokemon) => {
    return { id: getPokemonIdFromUrl(pokemon.url), ...pokemon };
  });

  return response.data.results;
};

const getPokemonDetails = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

const getPokemonIdFromUrl = (url) => {
  const urlSegments = url.split("/");
  // Handle trailing backslash
  const pokemonId = urlSegments.pop() || urlSegments.pop();
  return pokemonId;
};

const getPokemonEvolution = async (url) => {
  const evolutions = [];
  const response = await axios.get(url);
  const evoData = response.data;

  //bft of evolution tree
  const searchEvolutionTree = (node, level) => {
    if (evolutions[level] === undefined) evolutions[level] = [];
    evolutions[level].push(getPokemonIdFromUrl(node.species.url));
    node.evolves_to.forEach((child) => searchEvolutionTree(child, level + 1));
  };
  searchEvolutionTree(evoData.chain, 0);

  return evolutions;
};

const formatPokemonName = (name) => {
  // Capitalize each word and change gender letters to the apprpriate symbol
  return name
    .toLowerCase()
    .split("-")
    .map((s) => {
      if (s === "m") {
        return "♂";
      } else if (s === "f") {
        return "♀";
      }
      return s.charAt(0).toUpperCase() + s.substring(1);
    })
    .join(" ");
};

const formatStatName = (name) => {
  if (name === "hp") return "HP";

  return name
    .toLowerCase()
    .split("-")
    .map((s) => {
      if (s === "special") return "Sp";
      return s.charAt(0).toUpperCase() + s.substring(1);
    })
    .join(" ");
};

export {
  getPokemonList,
  getPokemonDetails,
  getPokemonEvolution,
  formatPokemonName,
  formatStatName,
};
