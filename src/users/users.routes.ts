
import { Router } from 'express';
import { UsersController } from './users.controller.js';

const router = Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - pokemonIds
 *             properties:
 *               username:
 *                 type: string
 *                 example: oscar
 *               email:
 *                 type: string
 *                 example: oscar@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               pokemonIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 25,  150]
 *     responses:
 *       201:
 *         description: User created successfully
 *
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
router.post('/', UsersController.createUser);
router.get('/', UsersController.findAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 *
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.get('/:id', UsersController.findOne);
router.put('/:id', UsersController.updateUser);
router.delete('/:id', UsersController.deleteUser);

/**
 * @swagger
 * /users/{id}/pokemon:
 *   put:
 *     summary: Update user's Pokemon
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pokemonIds
 *             properties:
 *               pokemonIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 25, 150]
 *     responses:
 *       200:
 *         description: Pokemon updated successfully
 *       404:
 *         description: User not found
 */
router.put('/:id/pokemon', UsersController.updatePokemon);

export default router;

