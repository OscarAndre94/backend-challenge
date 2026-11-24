import { describe, expect, it, jest } from "@jest/globals";

import type { CreateUserDto } from "../../../src/users/dtos/index.js";
import { UsersService } from "../../../src/users/users.service.js";
import { UsersRepository } from "../../../src/users/users.repository.js";
import { PokemonClient } from "../../../src/clients/pokemon.client.js";

describe("UsersService", () => {
  describe("create", () => {
    it("should create a user and return the data without password", async () => {
      // Arrange
      const createMock: jest.MockedFunction<UsersRepository["create"]> =
        jest.fn();

      createMock.mockResolvedValue({
        id: 1,
        username: "testuser",
        email: "test@example.com",
        password: "hashed-password",
        pokemonIds: [25],
      });

      const usersRepository = {
        create: createMock,
      } as unknown as UsersRepository;

      const pokemonClient = {} as PokemonClient;

      const usersService = new UsersService(usersRepository, pokemonClient);

      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "123456",
        pokemonIds: [25],
      };

      // Act
      const result = await usersService.create(userData);

      // Assert
      expect(createMock).toHaveBeenCalledTimes(1);

      expect(createMock).toHaveBeenCalledWith(
        expect.objectContaining({
          username: "testuser",
          email: "test@example.com",
          pokemonIds: [25],
          password: expect.any(String),
        }),
      );

      const repositoryData = createMock.mock.calls[0][0];

      expect(repositoryData.password).not.toBe(userData.password);

      expect(result).toEqual({
        id: 1,
        username: "testuser",
        email: "test@example.com",
        pokemonIds: [25],
      });

      expect(result).not.toHaveProperty("password");
    });

    it("should propagate repository errors", async () => {
      // Arrange
      const error = new Error("Database connection failed");

      const createMock: jest.MockedFunction<UsersRepository["create"]> =
        jest.fn();
      createMock.mockRejectedValue(error);

      const usersRepository = {
        create: createMock,
      } as unknown as UsersRepository;

      const pokemonClient = {} as PokemonClient;

      const usersService = new UsersService(usersRepository, pokemonClient);

      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "123456",
        pokemonIds: [25],
      };

      // Act & Assert
      await expect(usersService.create(userData)).rejects.toThrow(
        "Database connection failed",
      );

      expect(createMock).toHaveBeenCalledTimes(1);
    });
  });
});
