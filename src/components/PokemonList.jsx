import React, { useEffect, useState } from "react";
import axios from "axios";
import { PokemonCard } from "./PokemonCard";
import { PokemonModal } from "./PokemonModal";
import {
  getPokemonDetails,
  getPokemonList,
  formatPokemonName,
} from "./apiFunctions";
import loadingIcon from "../assets/images/loading.gif";
import { Filters } from "./Filters";
import { REGIONS_INFO } from "../constants/constants";

export const PokemonList = () => {
  const initialFilters = {
    region: "all",
    type: "all",
    sortBy: "id",
    searchedPokemon: "",
  };
  const [allPokemonDetails, setAllPokemonDetails] = useState([]);
  const [displayedPokemons, setDisplayedPokemons] = useState([]);
  const [numPokemon, setNumPokemon] = useState(20);
  const POKEMONS_PER_LOAD = 20;
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    region: "all",
    type: "all",
    sortBy: "id",
    searchedPokemon: "",
  });
  const [showPokemonModal, setShowPokemonModal] = useState(false);
  const [detailPokemon, setDetailPokemon] = useState({});

  //fetching all pokes without any filters set
  useEffect(() => {
    const fetchPokemons = async () => {
      const pokesList = await getPokemonList(
        "https://pokeapi.co/api/v2/pokemon?limit=1302"
      );

      const allResponses = await Promise.all(
        pokesList.map((pokemon) => getPokemonDetails(pokemon.url))
      );

      setAllPokemonDetails(allResponses);
      setDisplayedPokemons(allResponses);
      setIsLoading(false);
    };
    fetchPokemons();
  }, []);

  // Filters
  useEffect(() => {
    const start = REGIONS_INFO[filters.region].start;
    const limit = REGIONS_INFO[filters.region].limit;
    const filteredPokemon = allPokemonDetails
      .slice(start, start + limit)
      .filter((pokemon) => {
        return (
          filters.type === "all" ||
          pokemon.types.map((type) => type.type.name).includes(filters.type)
        );
      })
      .filter((pokemon) => {
        return formatPokemonName(pokemon.species.name)
          .toLowerCase()
          .includes(filters.searchedPokemon.toLowerCase());
      });

    // Sort
    if (filters.sortBy === "name") {
      filteredPokemon.sort((p1, p2) =>
        p1.species.name.localeCompare(p2.species.name)
      );
    }

    setDisplayedPokemons(filteredPokemon);
    setNumPokemon(POKEMONS_PER_LOAD);
  }, [allPokemonDetails, filters]);

  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    //console.log(filters);
  };

  const loadMorePokemon = () => {
    setNumPokemon(numPokemon + POKEMONS_PER_LOAD);
  };

  const toggleModal = (pokemonDetails) => {
    if (pokemonDetails) {
      setDetailPokemon(pokemonDetails);
    } else {
      setDetailPokemon({});
    }
    setShowPokemonModal((value) => !value);
  };

  if (isLoading)
    return (
      <div className="loading-screen pokemon-text">
        <img src={loadingIcon} alt="loading icon" />
        <h1>Loading...</h1>
      </div>
    );

  return (
    <div>
      <header>
        <p className="pokemon-text">Pokedex</p>
        <p className="pokemon-text-cursive">Gotta Catch ‘Em All!</p>
      </header>
      <Filters filters={filters} updateFilters={updateFilters} />

      <div className="pokemon-list">
        <button onClick={clearFilters} className="btn">
          Clear filters
        </button>
        {displayedPokemons.length == 0 && (
          <div className="pokemon-text">
            <h3>No Pokemons found! &#58;&#40;</h3>
          </div>
        )}
        <div className="pokemon-grid">
          {" "}
          {displayedPokemons.slice(0, numPokemon).map((pokemon) => (
            <PokemonCard
              key={pokemon.name}
              pokemonDetails={pokemon}
              toggleModal={toggleModal}
            />
          ))}
        </div>
        {numPokemon < displayedPokemons.length && (
          <button onClick={loadMorePokemon} className="btn">
            Load more
          </button>
        )}
      </div>
      {showPokemonModal && (
        <PokemonModal
          toggleModal={toggleModal}
          detailPokemon={detailPokemon}
          allPokemonDetails={allPokemonDetails}
        />
      )}
    </div>
  );
};
