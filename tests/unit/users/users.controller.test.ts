
import { describe, expect, it, jest } from "@jest/globals";

import { UsersController } from "../../../src/users/users.controller.js";
import { UsersService } from "../../../src/users/users.service.js";
import { mockRequest, mockResponse } from "../../helpers/express-mocks.js";



describe("UsersController", () => {
  describe("createUser", () => {
    it("should create a user and return status 201", async () => {
      const user = {
        id: 1,
        username: "testuser",
        email: "test@example.com",
        pokemonIds: [25],
      };

      const createSpy = jest
        .spyOn(UsersService.prototype, "create")
        .mockResolvedValue(user);

      const req = mockRequest({
        username: "testuser",
        email: "test@example.com",
        password: "123456",
        pokemonIds: [25],
      });

      const res = mockResponse();

      await UsersController.createUser(req, res);

      expect(createSpy).toHaveBeenCalledWith(req.body);

      expect(res.status).toHaveBeenCalledWith(201);

      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: user,
      });
    });
  });

  describe("findAll", () => {
  it("should return all users with status 200", async () => {
    const users = [
      {
        id: 1,
        username: "testuser",
        email: "test@example.com",
        pokemonIds: [25],
      },
      {
        id: 2,
        username: "testuser2",
        email: "test2@example.com",
        pokemonIds: [6],
      },
    ];

    const findAllSpy = jest
      .spyOn(UsersService.prototype, "findAll")
      .mockResolvedValue(users);

    const req = mockRequest();
    const res = mockResponse();

    await UsersController.findAll(req, res);

    expect(findAllSpy).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      data: users,
    });
  });
});

describe("findOne", () => {
  it("should return a user with status 200 when user exists", async () => {
    const user = {
      id: 1,
      username: "testuser",
      email: "test@example.com",
      pokemon: [],
      notFound: [],
    };

    const findByIdSpy = jest
      .spyOn(UsersService.prototype, "findById")
      .mockResolvedValue(user);

    const req = mockRequest({}, { id: "1" });
    const res = mockResponse();

    await UsersController.findOne(req, res);

    expect(findByIdSpy).toHaveBeenCalledWith(1);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      data: user,
    });
  });
});

describe("updateUser", () => {
  it("should update a user and return status 200", async () => {
    const user = {
      id: 1,
      username: "updateduser",
      email: "updated@example.com",
      pokemonIds: [25, 6],
    };

    const updateData = {
      username: "updateduser",
      email: "updated@example.com",
    };

    const updateSpy = jest
      .spyOn(UsersService.prototype, "update")
      .mockResolvedValue(user);

    const req = mockRequest(updateData, { id: "1" });
    const res = mockResponse();

    await UsersController.updateUser(req, res);

    expect(updateSpy).toHaveBeenCalledWith(1, updateData);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "User updated successfully",
      data: user,
    });
  });
});

describe("deleteUser", () => {
  it("should delete a user and return status 200", async () => {
    const deleteSpy = jest
      .spyOn(UsersService.prototype, "delete")
      .mockResolvedValue(undefined);

    const req = mockRequest({}, { id: "1" });
    const res = mockResponse();

    await UsersController.deleteUser(req, res);

    expect(deleteSpy).toHaveBeenCalledWith(1);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "User with ID 1 deleted successfully",
    });
  });
});

describe("updatePokemon", () => {
  it("should update user Pokemon and return status 200", async () => {
    const pokemonData = {
      pokemonIds: [25, 6],
    };

    const user = {
      id: 1,
      username: "testuser",
      email: "test@example.com",
      pokemonIds: [25, 6],
    };

    const updatePokemonSpy = jest
      .spyOn(UsersService.prototype, "updatePokemon")
      .mockResolvedValue(user);

    const req = mockRequest(pokemonData, { id: "1" });
    const res = mockResponse();

    await UsersController.updatePokemon(req, res);

    expect(updatePokemonSpy).toHaveBeenCalledWith(1, pokemonData);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "User Pokemon updated successfully",
      data: user,
    });
  });

  it("should return status 400 when Pokemon IDs are invalid", async () => {
  const pokemonData = {
    pokemonIds: [25, -6],
  };

  const updatePokemonSpy = jest.spyOn(
    UsersService.prototype,
    "updatePokemon",
  );

  const req = mockRequest(pokemonData, { id: "1" });
  const res = mockResponse();

  await UsersController.updatePokemon(req, res);

  expect(updatePokemonSpy).not.toHaveBeenCalled();

  expect(res.status).toHaveBeenCalledWith(400);

  expect(res.json).toHaveBeenCalledWith({
    status: "error",
    message: "pokemonIds must be an array of positive integers",
  });
});

});

});
