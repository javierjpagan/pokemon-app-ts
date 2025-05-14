import React, {useState, useEffect, useCallback } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { Pokemon } from '../components/Pokemon';
import { GET_POKEMONS } from '../graphql/get-pokemons';
import { GET_FUZZY_POKEMON } from '../graphql/get-fuzzy-pokemon';

type Attack = {
  name: string;
  damage: number;
};

type PokemonType = {
  id: string;
  name: string;
  maxHP: number;
  maxCP: number;
  image: string;
  attacks: {
    special: Attack[];
  };
};

type QueryResult = {
  pokemons: PokemonType[];
};

export const PokemonsContainer: React.FC = () => {
  const [limit, setLimit] = useState(9); // Step 1: Start with 9 Pokémon
  const [searchTerm, setSearchTerm] = useState('');


  const { data: listData, fetchMore } = useQuery<QueryResult>(GET_POKEMONS, {
    variables: { first: limit },
  });

  const [fetchPokemon, { data: searchData }] = useLazyQuery(GET_FUZZY_POKEMON);

//   const pokemons = data?.pokemons ?? [];

   // Step 2: Scroll handler
  const handleScroll = useCallback(() => {
    const nearBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

    if (nearBottom) {
      setLimit((prev) => prev + 9); // Step 3: Load more Pokémon
    }
  }, [searchTerm]);

  // Step 4: Attach scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Step 5: Fetch more Pokémon when limit increases
  useEffect(() => {
    fetchMore({
      variables: { first: limit },
    });
  }, [limit, fetchMore, searchTerm]); 

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  
    if (value.length >= 2) {
      fetchPokemon({ variables: { pokemon: value } });
    }
  };

  const pokemonsToDisplay: PokemonType[] = searchTerm
    ? searchData?.getFuzzyPokemon ?? []
    : listData?.pokemons ?? [];

  return (
    <>
    <div className="search-bar" style={{ padding: '20px', textAlign: 'center'}}>
  <input
    type="text"
    placeholder="Search Pokémon"
    value={searchTerm}
    onChange={handleSearch}
    style={{ padding: '10px', fontSize: '16px', width: '300px' }}
  />
</div>

    <div className="container">
      {pokemonsToDisplay.map((pokemon) => (
        <Pokemon key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
    </>
  );
};
