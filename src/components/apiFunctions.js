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

export { getPokemonList, getPokemonDetails, formatPokemonName };
