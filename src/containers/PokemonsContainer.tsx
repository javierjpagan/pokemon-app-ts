import React from 'react';
import { useQuery } from '@apollo/client';
// import { useQuery } from '@apollo/react-hooks';
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
  const { data } = useQuery<QueryResult>(GET_POKEMONS, {
    variables: { first: 9 },
  });

  const pokemons = data?.pokemons ?? [];

  return (
    <div className="container">
      {pokemons.map((pokemon) => (
        <Pokemon key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
};
