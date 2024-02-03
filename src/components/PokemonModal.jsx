import React, { useState, useRef, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  formatPokemonName,
  formatStatName,
  getPokemonDetails,
  getPokemonEvolution,
} from "./apiFunctions";
import { COLOURS_PER_TYPE, COLOURS_PER_STAT } from "../constants/constants";
import { getColorGradient } from "./PokemonCard";

export const PokemonModal = ({
  detailPokemon,
  allPokemonDetails,
  toggleModal,
}) => {
  const modalBackground = useRef();
  const [pokemonDetails, setPokemonDetails] = useState(detailPokemon);
  const [speciesInfo, setSpeciesInfo] = useState();
  const [loading, setLoading] = useState(true);
  const [evolution, setEvolution] = useState([]);

  useEffect(() => {
    const getSpeciesInfo = async () => {
      const speciesData = await getPokemonDetails(pokemonDetails.species.url);
      setSpeciesInfo(speciesData);

      const evolutionData = await getPokemonEvolution(
        speciesData.evolution_chain.url
      );
      setEvolution(evolutionData);

      setLoading(false);
    };

    setLoading(true);
    if (pokemonDetails != null) {
      getSpeciesInfo();
    }
  }, [pokemonDetails]);

  const handleBackgroundClick = (e) => {
    if (e.target === modalBackground.current) {
      toggleModal();
    }
  };

  const changePokemon = (pokemonId) => {
    setPokemonDetails(allPokemonDetails[pokemonId - 1]);
  };

  const typeColorGradient = getColorGradient(pokemonDetails.types);

  return (
    <div
      className="modal-background"
      ref={modalBackground}
      onClick={handleBackgroundClick}
    >
      <div
        className="modal-container"
        style={{
          background: `linear-gradient(${typeColorGradient[0]} 35%, ${typeColorGradient[1]}) 100%`,
        }}
      >
        <div className="left-panel-info">
          <h4 className="pokemon-text">
            {"#" + ("00" + pokemonDetails.id).slice(-3)}
          </h4>
          <div className="sprite-container">
            <LazyLoadImage
              src={
                pokemonDetails.sprites.other["official-artwork"].front_default
              }
              alt={pokemonDetails.name}
              className="pokemon-sprite"
            />
          </div>
          <h3 className="pokemon-text">
            {formatPokemonName(pokemonDetails.species.name)}
          </h3>
          <div className="pokemon-genera">
            {loading ? "Loading" : speciesInfo.genera[7].genus}
          </div>
          <div className="pokemon-types">
            {" "}
            {pokemonDetails.types.map((type) => (
              <span
                key={type.type.name}
                className="type-span"
                style={{
                  backgroundColor: `${COLOURS_PER_TYPE[type.type.name]}`,
                }}
              >
                {type.type.name.charAt(0).toUpperCase() +
                  type.type.name.slice(1)}
              </span>
            ))}
          </div>
          <div className="pokemon-dimensions">
            <div className="height">
              {" "}
              <h5>Height</h5>
              <span>{pokemonDetails.height / 10}m</span>
            </div>
            <div className="weight">
              <h5>Weight</h5>
              <span>{pokemonDetails.weight / 10}kg</span>
            </div>
          </div>
        </div>
        <div className="right-panel">
          <div className="pokemon-description">
            <h4 className="pokemon-text"> Description</h4>
            <div>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <p>
                  {
                    speciesInfo.flavor_text_entries
                      .slice()
                      .reverse()
                      .find((flavor) => flavor.language.name === "en")
                      .flavor_text
                  }
                </p>
              )}
            </div>
          </div>
          <div className="pokemon-stats">
            <h4 className="pokemon-text"> Stats</h4>
            {pokemonDetails.stats.map((stat) => {
              return (
                <div key={stat.stat.name} className="stats-section">
                  <h6 className="stat-name">
                    {formatStatName(stat.stat.name)}
                  </h6>
                  <div className="stats-container">
                    <div
                      className="stat-bar"
                      style={{
                        backgroundColor: COLOURS_PER_STAT[stat.stat.name],
                        width: `${(stat.base_stat / 255) * 100}%`,
                      }}
                    >
                      <span>{stat.base_stat}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pokemon-evolutions">
            <h4 className="pokemon-text"> Evolution Tree</h4>
            <div className="evolutions-container">
              {!loading ? (
                evolution.map((column, i) => (
                  <React.Fragment key={i}>
                    <div
                      className={`evolution-column ${
                        column.length === 2
                          ? "two-items"
                          : column.length > 2
                          ? "more-items"
                          : ""
                      }`}
                    >
                      {column.map((item) => (
                        <div
                          className="evolution-child"
                          key={item}
                          onClick={() => changePokemon(item)}
                        >
                          <div className="evolution-child-sprite-container">
                            <LazyLoadImage
                              className="evolution-sprite"
                              src={
                                allPokemonDetails[item - 1].sprites.other[
                                  "official-artwork"
                                ].front_default
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    {i + 1 !== evolution.length && (
                      <div className="evolution-arrow">
                        <span>&#10145;</span>
                      </div>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <h2>Loading</h2>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
