import type { PokemonDetails } from "../../clients/pokemon.client.js";

export interface UserPokemonResponseDto {
  id: number;
  username: string;
  email: string;
  pokemon: PokemonDetails[];
  notFound: number[];
}