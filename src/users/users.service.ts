import { randomBytes, scrypt } from 'node:crypto';
import { promisify } from 'node:util';

import { UsersRepository } from './users.repository.js';

import type {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserPokemonDto,
  UserResponseDto,
} from './dtos/index.js';

const scryptAsync = promisify(scrypt);

export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');

    const derivedKey = (await scryptAsync(
      password,
      salt,
      64
    )) as Buffer;

    return `${salt}:${derivedKey.toString('hex')}`;
  }

  private toUserResponse(user: {
    id: number;
    username: string;
    email: string;
    pokemonIds: number[];
  }): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      pokemonIds: user.pokemonIds,
    };
  }

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const password = await this.hashPassword(data.password);

    const user = await this.usersRepository.create({
      ...data,
      password,
    });

    return this.toUserResponse(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.findAll();

    return users.map((user) => this.toUserResponse(user));
  }

  async findById(id: number): Promise<UserResponseDto | null> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      return null;
    }

    return this.toUserResponse(user);
  }

  async update(
    id: number,
    data: UpdateUserDto
  ): Promise<UserResponseDto> {
    const updatedData = { ...data };

    if (updatedData.password) {
      updatedData.password = await this.hashPassword(
        updatedData.password
      );
    }

    const user = await this.usersRepository.update(id, updatedData);

    return this.toUserResponse(user);
  }

  async updatePokemon(
    id: number,
    data: UpdateUserPokemonDto
  ): Promise<UserResponseDto> {
    const user = await this.usersRepository.updatePokemon(id, data);

    return this.toUserResponse(user);
  }

  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}