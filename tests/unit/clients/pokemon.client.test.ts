import { afterEach, describe, expect, it, jest } from '@jest/globals';

import { PokemonClient } from '../../../src/clients/pokemon.client.js';
import { pokemonMock } from '../../mocks/pokemon/pokemon.mock.js';

describe('PokemonClient - Unit Tests', () => {
  const pokemonClient = new PokemonClient();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getPokemonDetailsByIds', () => {
    it('should return pokemon details successfully', async () => {
      jest.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => pokemonMock,
      } as Response);

      const result = await pokemonClient.getPokemonDetailsByIds([25]);

      expect(result).toEqual({
        pokemon: [
          {
            id: 25,
            name: 'pikachu',
          },
        ],
        notFound: [],
      });

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.POKEMON_API_URL}/pokemon/25`,
      );
    });
  });
});