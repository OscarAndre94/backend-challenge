
export interface PokemonDetails {
  id: number;
  name: string;
}

export interface PokemonResult {
  pokemon: PokemonDetails[];
  notFound: number[];
}

export class PokemonClient {
  async getPokemonDetailsByIds(
    ids: number[],
  ): Promise<PokemonResult> {
    const baseUrl = process.env.POKEMON_API_URL;

    const pokemonPromises = ids.map(async (id) => {
      const response = await fetch(`${baseUrl}/pokemon/${id}`);

      // Pokémon not found
      if (response.status === 404) {
        return {
          status: 'notFound' as const,
          id,
        };
      }

      // Other HTTP errors
      if (!response.ok) {
        throw new Error(`PokéAPI error: ${response.status}`);
      }

      const pokemon = await response.json();

      return {
        status: 'success' as const,
        data: {
          id: pokemon.id,
          name: pokemon.name,
        },
      };
    });

    const results = await Promise.allSettled(pokemonPromises);

    const pokemon: PokemonDetails[] = [];
    const notFound: number[] = [];

    for (const result of results) {
      if (result.status === 'rejected') {
        throw result.reason;
      }

      if (result.value.status === 'notFound') {
        notFound.push(result.value.id);
      } else {
        pokemon.push(result.value.data);
      }
    }

    return { pokemon, notFound };
  }
}