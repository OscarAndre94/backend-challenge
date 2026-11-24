import { afterAll, beforeEach, describe, expect, it } from "@jest/globals";

import { prisma } from "../../../src/config/prisma.js";
import { UsersRepository } from "../../../src/users/users.repository.js";

describe("UsersRepository - Integration Tests", () => {
  const usersRepository = new UsersRepository();

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("create", () => {
    it("should create a user successfully", async () => {
      const userData = {
        username: "integration_user",
        email: "integration@example.com",
        password: "hashed_password",
        pokemonIds: [],
      };

      const user = await usersRepository.create(userData);

      expect(user).toHaveProperty("id");
      expect(user.username).toBe(userData.username);
      expect(user.email).toBe(userData.email);
      expect(user.password).toBe(userData.password);
      expect(user.pokemonIds).toEqual([]);
    });
  });

 describe('findAll', () => {
  it('should return all users', async () => {
    await usersRepository.create({
      username: 'integration_user_1',
      email: 'integration1@example.com',
      password: 'hashed_password',
      pokemonIds: [],
    });

    await usersRepository.create({
      username: 'integration_user_2',
      email: 'integration2@example.com',
      password: 'hashed_password',
      pokemonIds: [],
    });

    const users = await usersRepository.findAll();

    expect(users).toHaveLength(2);
    expect(users[0].username).toBe('integration_user_1');
    expect(users[1].username).toBe('integration_user_2');
  });
});

  describe('findById', () => {
  it('should return a user by id', async () => {
    const userData = {
      username: 'integration_user',
      email: 'integration@example.com',
      password: 'hashed_password',
      pokemonIds: [],
    };

    const createdUser = await usersRepository.create(userData);

    const user = await usersRepository.findById(createdUser.id);

    expect(user).not.toBeNull();
    expect(user?.id).toBe(createdUser.id);
    expect(user?.username).toBe(userData.username);
    expect(user?.email).toBe(userData.email);
  });
});

 describe('update', () => {
  it('should update a user successfully', async () => {
    const userData = {
      username: 'integration_user',
      email: 'integration@example.com',
      password: 'hashed_password',
      pokemonIds: [],
    };

    const createdUser = await usersRepository.create(userData);

    const updateData = {
      username: 'updated_user',
      email: 'updated@example.com',
    };

    const updatedUser = await usersRepository.update(
      createdUser.id,
      updateData,
    );

    expect(updatedUser.id).toBe(createdUser.id);
    expect(updatedUser.username).toBe(updateData.username);
    expect(updatedUser.email).toBe(updateData.email);
    expect(updatedUser.password).toBe(userData.password);
  });
});

 describe('updatePokemon', () => {
  it('should update a user pokemon list successfully', async () => {
    const userData = {
      username: 'integration_user',
      email: 'integration@example.com',
      password: 'hashed_password',
      pokemonIds: [],
    };

    const createdUser = await usersRepository.create(userData);

    const updateData = {
      pokemonIds: [25, 1, 4, 7],
    };

    const updatedUser = await usersRepository.updatePokemon(
      createdUser.id,
      updateData,
    );

    expect(updatedUser.id).toBe(createdUser.id);
    expect(updatedUser.pokemonIds).toEqual(updateData.pokemonIds);
  });
});

  describe('delete', () => {
  it('should delete a user successfully', async () => {
    const userData = {
      username: 'integration_user',
      email: 'integration@example.com',
      password: 'hashed_password',
      pokemonIds: [],
    };

    const createdUser = await usersRepository.create(userData);

    const deletedUser = await usersRepository.delete(createdUser.id);

    expect(deletedUser.id).toBe(createdUser.id);

    const user = await usersRepository.findById(createdUser.id);

    expect(user).toBeNull();
  });
});

});
