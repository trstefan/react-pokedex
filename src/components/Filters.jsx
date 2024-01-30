import { POKEMONS_REGIONS, TYPES, SORTING } from "../constants/constants";
export const Filters = ({ filters, updateFilters }) => {
  return (
    <div className="filters-container">
      <div className="filter-item">
        <label htmlFor="Search" className="pokemon-text">
          Region
        </label>
        <select
          name=""
          id=""
          value={filters.region}
          onChange={(e) => updateFilters({ region: e.target.value })}
        >
          x
          {POKEMONS_REGIONS.map((region) => (
            <option value={region} key={region}>
              {region.charAt(0).toUpperCase() + region.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-item">
        <label htmlFor="Search" className="pokemon-text">
          Type
        </label>
        <select
          value={filters.type}
          onChange={(e) => updateFilters({ type: e.target.value })}
        >
          {TYPES.map((type) => (
            <option value={type} key={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-item">
        <label htmlFor="Search" className="pokemon-text">
          Sort By
        </label>
        <select
          name=""
          id=""
          value={filters.sortBy}
          onChange={(e) => updateFilters({ sortBy: e.target.value })}
        >
          {SORTING.map((sortMethod) => (
            <option value={sortMethod} key={sortMethod}>
              {sortMethod.charAt(0).toUpperCase() + sortMethod.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-item">
        <label htmlFor="Search" className="pokemon-text">
          Search
        </label>
        <input
          type="text"
          placeholder="Search for a Pokemon"
          value={filters.searchedPokemon}
          onChange={(e) => updateFilters({ searchedPokemon: e.target.value })}
        />
      </div>
    </div>
  );
};
