import { gql } from '@apollo/client';

export const GET_FUZZY_POKEMON = gql`
  query getFuzzyPokemon($pokemon: String!) {
    getFuzzyPokemon(pokemon: $pokemon) {
      id
      name
      image
      maxHP
      maxCP
      attacks {
        special {
          name
          damage
        }
      }
    }
  }
`;
