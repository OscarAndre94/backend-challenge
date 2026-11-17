
import type { Request, Response } from "express";

interface UserRecord {
    id: number;
    username: string;
    email: string;
    password: string;
    pokemonIds: number[];
}

const users: UserRecord[] = [];
let nextUserId = 1;

export class UsersController {
   
    // Create user
    static createUser(req: Request, res: Response) {
        const userData = req.body;

        const newUser: UserRecord = {
            id: nextUserId++,
            username: userData.username,
            email: userData.email,
            password: userData.password,
            pokemonIds: userData.pokemonIds,
        };

        users.push(newUser);

        const { password, ...userResponse } = newUser;

        return res.status(201).json({
            status: 'success',
            data: userResponse,
        });
    }

    // Get all users
    static findAll(req: Request, res: Response) {
        const userList = users.map(({ password, ...user }) => user);

        return res.status(200).json({
            status: 'success',
            data: userList,
        });
    }

    // Get user by ID
    static findOne(req: Request, res: Response) {
        const id = Number(req.params.id);

        const user = users.find((user) => user.id === id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
            });
        }

        const { password, ...userResponse } = user;

        return res.status(200).json({
            status: 'success',
            data: userResponse,
        });
    }


     // Update user
    static updateUser(req: Request, res: Response) {
        const id = Number(req.params.id);

        const userIndex = users.findIndex((user) => user.id === id);

        if (userIndex === -1) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
            });
        }

        const user = users[userIndex];

        const updatedUser = {
            ...user,
            ...req.body,
            id: user.id,
        };

        users[userIndex] = updatedUser;

        const { password, ...userResponse } = updatedUser;

        return res.status(200).json({
            status: 'success',
            message: 'User updated successfully',
            data: userResponse,
        });
    }

   
    // Delete user
    static deleteUser(req: Request, res: Response) {
        const id = Number(req.params.id);

        const userIndex = users.findIndex((user) => user.id === id);

        if (userIndex === -1) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
            });
        }

        users.splice(userIndex, 1);

        return res.status(200).json({
            status: 'success',
            message: `User with ID ${id} deleted successfully`,
        });
    }
    // Update user's Pokemon
    static updatePokemon(req: Request, res: Response) {
        const id = Number(req.params.id);
        const { pokemonIds } = req.body;

        const user = users.find((user) => user.id === id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
            });
        }

        if (
            !Array.isArray(pokemonIds) ||
            !pokemonIds.every((pokemonId) =>
                Number.isInteger(pokemonId) && pokemonId > 0
            )
        ) {
            return res.status(400).json({
                status: 'error',
                message: 'pokemonIds must be an array of positive integers',
            });
        }

        user.pokemonIds = pokemonIds;

        const { password, ...userResponse } = user;

        return res.status(200).json({
            status: 'success',
            message: 'User Pokemon updated successfully',
            data: userResponse,
        });
    }
}
