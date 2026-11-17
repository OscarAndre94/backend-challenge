import { prisma } from '../config/prisma.js';

import type {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserPokemonDto,
} from './dtos/index.js';

export class UsersRepository {
  async create(data: CreateUserDto) {
    return prisma.user.create({
      data,
    });
  }

  async findAll() {
    return prisma.user.findMany();
  }

  async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: UpdateUserDto) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async updatePokemon(id: number, data: UpdateUserPokemonDto) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.user.delete({
      where: { id },
    });
  }
}