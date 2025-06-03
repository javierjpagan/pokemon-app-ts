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
  const [limit, setLimit] = useState(9); // Load 9 Pokémon
  const [searchTerm, setSearchTerm] = useState(''); //Store Search value


  const { data: data, fetchMore } = useQuery<QueryResult>(GET_POKEMONS, {
    variables: { first: limit },
  });

  const pokemons = data?.pokemons ?? [];

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  ); 


   // Scroll handler
  const handleScroll = useCallback(() => {
    const nearBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

    if (nearBottom) {
      setLimit((prev) => prev + 9); // Add 9 more Pokémon
    }
  }, []);

  // Scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Fetch more Pokémon when limit increases
  useEffect(() => {
    fetchMore({
      variables: { first: limit },
    });
  }, [limit, fetchMore]); 

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  
  };

  // Render the Pokémon list
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
    {filteredPokemons.map((pokemon) => (
  <Pokemon key={pokemon.id} pokemon={pokemon} />
))}
    </div>
    </>
  );
};
