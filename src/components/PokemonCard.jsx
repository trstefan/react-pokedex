import React from "react";
import { formatPokemonName } from "./apiFunctions";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  COLOURS_PER_TYPE,
  COLOURS_SECONDARY_TYPE,
} from "../constants/constants";

export const PokemonCard = ({ pokemonDetails }) => {
  const gradientMix = getColorGradient(pokemonDetails.types);

  return (
    <div
      className="pokemon-card"
      style={{
        background: `radial-gradient(circle at top, ${gradientMix[0]} 35%, ${gradientMix[1]}) 100%`,
      }}
    >
      <div className="pokemon-id pokemon-text">
        {" "}
        <h4>{"#" + ("00" + pokemonDetails.id).slice(-3)}</h4>
      </div>
      <div className="sprite-container">
        <LazyLoadImage
          src={pokemonDetails.sprites.other["official-artwork"].front_default}
          className="pokemon-sprite"
        />
      </div>
      <h3 className="pokemon-text">
        {formatPokemonName(pokemonDetails.species.name)}
      </h3>
      <div className="pokemon-types">
        {" "}
        {pokemonDetails.types.map((type) => (
          <span
            key={type.type.name}
            className="type-span"
            style={{ backgroundColor: `${COLOURS_PER_TYPE[type.type.name]}` }}
          >
            {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
          </span>
        ))}
      </div>
    </div>
  );
};

export const getColorGradient = (typesArray) => {
  if (typesArray.length === 1) {
    return [
      COLOURS_PER_TYPE[typesArray[0].type.name],
      COLOURS_SECONDARY_TYPE[typesArray[0].type.name],
    ];
  } else {
    return [
      COLOURS_PER_TYPE[typesArray[0].type.name],
      COLOURS_PER_TYPE[typesArray[1].type.name],
    ];
  }
};
