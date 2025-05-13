import React, {useState, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { Pokemon } from '../components/Pokemon';
import { GET_POKEMONS } from '../graphql/get-pokemons';

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

  const { data, fetchMore } = useQuery<QueryResult>(GET_POKEMONS, {
    variables: { first: limit },
  });

  const pokemons = data?.pokemons ?? [];

   // Step 2: Scroll handler
  const handleScroll = useCallback(() => {
    const nearBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

    if (nearBottom) {
      setLimit((prev) => prev + 9); // Step 3: Load more Pokémon
    }
  }, []);

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
  }, [limit, fetchMore]); 

  return (
    <div className="container">
      {pokemons.map((pokemon) => (
        <Pokemon key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
};
