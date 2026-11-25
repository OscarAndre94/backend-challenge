import { describe, expect, it, jest } from "@jest/globals";

import { UsersService } from "../../../src/users/users.service.js";
import { UsersRepository } from "../../../src/users/users.repository.js";
import { PokemonClient } from "../../../src/clients/pokemon.client.js";
import { UpdateUserDto } from "../../../src/users/dtos/index.js";
import { UpdateUserPokemonDto } from "../../../src/users/dtos/index.js";


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


describe("findById", () => {
  it("should return a user with Pokemon details", async () => {
    const findByIdMock: jest.MockedFunction<
      UsersRepository["findById"]
    > = jest.fn();

    findByIdMock.mockResolvedValue({
      id: 1,
      username: "testuser",
      email: "test@example.com",
      password: "hashed-password",
      pokemonIds: [25],
    });

    const getPokemonDetailsMock: jest.MockedFunction<
      PokemonClient["getPokemonDetailsByIds"]
    > = jest.fn();

    getPokemonDetailsMock.mockResolvedValue({
      pokemon: [{ id: 25, name: "pikachu" }],
      notFound: [],
    });

    const usersRepository = {
      findById: findByIdMock,
    } as unknown as UsersRepository;

    const pokemonClient = {
      getPokemonDetailsByIds: getPokemonDetailsMock,
    } as unknown as PokemonClient;

    const usersService = new UsersService(
      usersRepository,
      pokemonClient,
    );

    const result = await usersService.findById(1);

    expect(findByIdMock).toHaveBeenCalledWith(1);
    expect(getPokemonDetailsMock).toHaveBeenCalledWith([25]);

    expect(result).toEqual({
      id: 1,
      username: "testuser",
      email: "test@example.com",
      pokemon: [{ id: 25, name: "pikachu" }],
      notFound: [],
    });

    expect(result).not.toHaveProperty("password");
    expect(result).not.toHaveProperty("pokemonIds");
  });

  it("should return null when the user does not exist", async () => {
    const findByIdMock: jest.MockedFunction<
      UsersRepository["findById"]
    > = jest.fn();

    findByIdMock.mockResolvedValue(null);

    const getPokemonDetailsMock: jest.MockedFunction<
      PokemonClient["getPokemonDetailsByIds"]
    > = jest.fn();

    const usersRepository = {
      findById: findByIdMock,
    } as unknown as UsersRepository;

    const pokemonClient = {
      getPokemonDetailsByIds: getPokemonDetailsMock,
    } as unknown as PokemonClient;

    const usersService = new UsersService(
      usersRepository,
      pokemonClient,
    );

    const result = await usersService.findById(999);

    expect(result).toBeNull();
    expect(findByIdMock).toHaveBeenCalledWith(999);
    expect(getPokemonDetailsMock).not.toHaveBeenCalled();
  });

  it("should return a user with an empty Pokemon list", async () => {
    const findByIdMock: jest.MockedFunction<
      UsersRepository["findById"]
    > = jest.fn();

    findByIdMock.mockResolvedValue({
      id: 1,
      username: "testuser",
      email: "test@example.com",
      password: "hashed-password",
      pokemonIds: [],
    });

    const getPokemonDetailsMock: jest.MockedFunction<
      PokemonClient["getPokemonDetailsByIds"]
    > = jest.fn();

    getPokemonDetailsMock.mockResolvedValue({
      pokemon: [],
      notFound: [],
    });

    const usersRepository = {
      findById: findByIdMock,
    } as unknown as UsersRepository;

    const pokemonClient = {
      getPokemonDetailsByIds: getPokemonDetailsMock,
    } as unknown as PokemonClient;

    const usersService = new UsersService(
      usersRepository,
      pokemonClient,
    );

    const result = await usersService.findById(1);

    expect(result).toEqual({
      id: 1,
      username: "testuser",
      email: "test@example.com",
      pokemon: [],
      notFound: [],
    });

    expect(getPokemonDetailsMock).toHaveBeenCalledWith([]);
  });
});

describe("findAll", () => {
  it("should return all users without passwords", async () => {
    // Arrange
    const findAllMock: jest.MockedFunction<UsersRepository["findAll"]> =
      jest.fn();

    findAllMock.mockResolvedValue([
      {
        id: 1,
        username: "user1",
        email: "user1@example.com",
        password: "hashed-password-1",
        pokemonIds: [25],
      },
      {
        id: 2,
        username: "user2",
        email: "user2@example.com",
        password: "hashed-password-2",
        pokemonIds: [1, 4],
      },
    ]);

    const usersRepository = {
      findAll: findAllMock,
    } as unknown as UsersRepository;

    const pokemonClient = {} as PokemonClient;

    const usersService = new UsersService(usersRepository, pokemonClient);

    // Act
    const result = await usersService.findAll();

    // Assert
    expect(findAllMock).toHaveBeenCalledTimes(1);

    expect(result).toEqual([
      {
        id: 1,
        username: "user1",
        email: "user1@example.com",
        pokemonIds: [25],
      },
      {
        id: 2,
        username: "user2",
        email: "user2@example.com",
        pokemonIds: [1, 4],
      },
    ]);

    expect(result[0]).not.toHaveProperty("password");
    expect(result[1]).not.toHaveProperty("password");
  });

  it("should return an empty array when there are no users", async () => {
    // Arrange
    const findAllMock: jest.MockedFunction<UsersRepository["findAll"]> =
      jest.fn();

    findAllMock.mockResolvedValue([]);

    const usersRepository = {
      findAll: findAllMock,
    } as unknown as UsersRepository;

    const pokemonClient = {} as PokemonClient;

    const usersService = new UsersService(usersRepository, pokemonClient);

    // Act
    const result = await usersService.findAll();

    // Assert
    expect(findAllMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });
});


describe("update", () => {
  it("should update a user and return the data without password", async () => {
    // Arrange
    const updateMock: jest.MockedFunction<
      UsersRepository["update"]
    > = jest.fn();

    updateMock.mockResolvedValue({
      id: 1,
      username: "updateduser",
      email: "updated@example.com",
      password: "hashed-password",
      pokemonIds: [25],
    });

    const usersRepository = {
      update: updateMock,
    } as unknown as UsersRepository;

    const pokemonClient = {} as PokemonClient;

    const usersService = new UsersService(
      usersRepository,
      pokemonClient,
    );

    const updateData: UpdateUserDto = {
      username: "updateduser",
      email: "updated@example.com",
    };

    // Act
    const result = await usersService.update(1, updateData);

    // Assert
    expect(updateMock).toHaveBeenCalledWith(1, updateData);

    expect(result).toEqual({
      id: 1,
      username: "updateduser",
      email: "updated@example.com",
      pokemonIds: [25],
    });

    expect(result).not.toHaveProperty("password");
  });

  it("should hash the new password before updating the user", async () => {
    // Arrange
    const updateMock: jest.MockedFunction<
      UsersRepository["update"]
    > = jest.fn();

    updateMock.mockResolvedValue({
      id: 1,
      username: "testuser",
      email: "test@example.com",
      password: "new-hashed-password",
      pokemonIds: [25],
    });

    const usersRepository = {
      update: updateMock,
    } as unknown as UsersRepository;

    const pokemonClient = {} as PokemonClient;

    const usersService = new UsersService(
      usersRepository,
      pokemonClient,
    );

    const updateData: UpdateUserDto = {
      password: "NewPassword123",
    };

    // Act
    const result = await usersService.update(1, updateData);

    // Assert
    expect(updateMock).toHaveBeenCalledTimes(1);

    const repositoryData = updateMock.mock.calls[0][1];

    expect(repositoryData.password).not.toBe(updateData.password);
    expect(repositoryData.password).toEqual(expect.any(String));
    expect(repositoryData.password).toContain(":");

    expect(result).not.toHaveProperty("password");
  });

  it("should propagate repository errors when the user does not exist", async () => {
    // Arrange
    const error = new Error("Record to update not found");

    const updateMock: jest.MockedFunction<
      UsersRepository["update"]
    > = jest.fn();

    updateMock.mockRejectedValue(error);

    const usersRepository = {
      update: updateMock,
    } as unknown as UsersRepository;

    const pokemonClient = {} as PokemonClient;

    const usersService = new UsersService(
      usersRepository,
      pokemonClient,
    );

    // Act & Assert
    await expect(
      usersService.update(999, { username: "updateduser" }),
    ).rejects.toThrow("Record to update not found");

    expect(updateMock).toHaveBeenCalledWith(999, {
      username: "updateduser",
    });
  });
});

describe("updatePokemon", () => {
  it("should update a user's Pokemon and return the updated user", async () => {
    const updatePokemonMock: jest.MockedFunction<
      UsersRepository["updatePokemon"]
    > = jest.fn();

    updatePokemonMock.mockResolvedValue({
      id: 1,
      username: "testuser",
      email: "test@example.com",
      password: "hashed-password",
      pokemonIds: [25, 6,  7],
    });

    const usersRepository = {
      updatePokemon: updatePokemonMock,
    } as unknown as UsersRepository;

    const pokemonClient = {} as PokemonClient;

    const usersService = new UsersService(
      usersRepository,
      pokemonClient,
    );

    const updateData: UpdateUserPokemonDto = {
      pokemonIds: [25, 6,  7],
    };

    const result = await usersService.updatePokemon(1, updateData);

    expect(updatePokemonMock).toHaveBeenCalledWith(1, updateData);

    expect(result).toEqual({
      id: 1,
      username: "testuser",
      email: "test@example.com",
      pokemonIds: [25, 6,  7],
    });

    expect(result).not.toHaveProperty("password");
  });

  it("should propagate repository errors when the user does not exist", async () => {
    const error = new Error("Record to update not found");

    const updatePokemonMock: jest.MockedFunction<
      UsersRepository["updatePokemon"]
    > = jest.fn();

    updatePokemonMock.mockRejectedValue(error);

    const usersRepository = {
      updatePokemon: updatePokemonMock,
    } as unknown as UsersRepository;

    const pokemonClient = {} as PokemonClient;

    const usersService = new UsersService(
      usersRepository,
      pokemonClient,
    );

    await expect(
      usersService.updatePokemon(999, { pokemonIds: [25] }),
    ).rejects.toThrow("Record to update not found");

    expect(updatePokemonMock).toHaveBeenCalledWith(999, {
      pokemonIds: [25],
    });
  });
});

describe("delete", () => {
  it("should delete a user successfully", async () => {
    const deleteMock: jest.MockedFunction<
      UsersRepository["delete"]
    > = jest.fn();

    deleteMock.mockResolvedValue({
  id: 1,
  username: "testuser",
  email: "test@example.com",
  password: "hashed-password",
  pokemonIds: [25],
});

    const usersRepository = {
      delete: deleteMock,
    } as unknown as UsersRepository;

    const pokemonClient = {} as PokemonClient;

    const usersService = new UsersService(
      usersRepository,
      pokemonClient,
    );

    await usersService.delete(1);

    expect(deleteMock).toHaveBeenCalledTimes(1);
    expect(deleteMock).toHaveBeenCalledWith(1);
  });

  it("should propagate repository errors when the user does not exist", async () => {
    const error = new Error("Record to delete does not exist");

    const deleteMock: jest.MockedFunction<
      UsersRepository["delete"]
    > = jest.fn();

    deleteMock.mockRejectedValue(error);

    const usersRepository = {
      delete: deleteMock,
    } as unknown as UsersRepository;

    const pokemonClient = {} as PokemonClient;

    const usersService = new UsersService(
      usersRepository,
      pokemonClient,
    );

    await expect(
      usersService.delete(999),
    ).rejects.toThrow("Record to delete does not exist");

    expect(deleteMock).toHaveBeenCalledWith(999);
  });
});

  });
});
