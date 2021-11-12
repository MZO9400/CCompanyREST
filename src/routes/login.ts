import express from 'express';
import {User, UserModel} from "../models/User";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

interface LoginResponse {
  user: {
    email: string;
    name: string
  }
  token: string;
  status: true,
  message: string;
}

/**
 * @swagger
 * paths:
 *   /login:
 *     post:
 *       responses:
 *         '200':
 *           description: OK
 *         '500':
 *           description: Internal Server Error
 *         '401':
 *           description: Password is invalid
 *         '404':
 *           description: User Not Found
 *     parameters:
 *       - in: body
 *         description: User object
 *         schema:
 *           $ref: '#/components/schemas/Login'
 *
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 * */
router.post('/', (req, res) => {
  const { password, email } = req.body;

  UserModel.findOne({ email }, (err: Error, user: User) => {
    if (err) {
      res.status(500).send(err);
    } else if (!user) {
      res.status(404).send('User not found');
    } else {
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          res.status(500).send(err);
        } else if (isMatch) {
          if (!process.env.SALT) {
            throw new Error('SALT is not defined');
          }
          const token = jwt.sign(
              {
                email: user.email
              },
              process.env.SALT,
              {
                algorithm: 'RS256',
                expiresIn: '365d'
              });
          const loginResponse : LoginResponse = {
            user: {
              email: user.email,
              name: user.name
            },
            token: token,
            status: true,
            message: 'Login Successful'
          };
          res.status(200).send(loginResponse);
        } else {
          res.status(401).send('Password is incorrect');
        }
      });
    }
  });
});


export default router;
