
import type { Request, Response } from 'express';

import { UsersRepository } from './users.repository.js';
import { UsersService } from './users.service.js';

import type {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserPokemonDto,
} from './dtos/index.js';

const usersRepository = new UsersRepository();
const usersService = new UsersService(usersRepository);

export class UsersController {

  // Create user
  static async createUser(req: Request, res: Response): Promise<void> {
    const userData = req.body as CreateUserDto;

    const user = await usersService.create(userData);

    res.status(201).json({
      status: 'success',
      data: user,
    });
  }

  // Get all users
  static async findAll(req: Request, res: Response): Promise<void> {
    const users = await usersService.findAll();

    res.status(200).json({
      status: 'success',
      data: users,
    });
  }

  // Get user by ID
  static async findOne(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);

    const user = await usersService.findById(id);

    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: user,
    });
  }

  // Update user
  static async updateUser(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const userData = req.body as UpdateUserDto;

    const user = await usersService.update(id, userData);

    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: user,
    });
  }

  // Delete user
  static async deleteUser(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);

    await usersService.delete(id);

    res.status(200).json({
      status: 'success',
      message: `User with ID ${id} deleted successfully`,
    });
  }

  // Update user's Pokemon
  static async updatePokemon(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const pokemonData = req.body as UpdateUserPokemonDto;
    const { pokemonIds } = pokemonData;

    if (
      !Array.isArray(pokemonIds) ||
      !pokemonIds.every(
        (pokemonId) => Number.isInteger(pokemonId) && pokemonId > 0
      )
    ) {
      res.status(400).json({
        status: 'error',
        message: 'pokemonIds must be an array of positive integers',
      });
      return;
    }

    const user = await usersService.updatePokemon(id, pokemonData);

    res.status(200).json({
      status: 'success',
      message: 'User Pokemon updated successfully',
      data: user,
    });
  }
}
