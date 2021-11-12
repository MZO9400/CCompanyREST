import express from 'express';
import User, {IUser} from "../models/User";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

interface LoginResponse {
  user: {
    email: string;
    name: string
  }
  token: string;
  status: boolean,
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
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/LoginResponse'
 *         '500':
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/GeneralResponse'
 *         '401':
 *           description: Password is invalid
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/GeneralResponse'
 *         '404':
 *           description: User Not Found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/GeneralResponse'
 *     parameters:
 *       - in: body
 *         description: User object
 *         schema:
 *           $ref: '#/components/schemas/LoginRequest'
 *
 * components:
 *   schemas:
 *     LoginResponse:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             name:
 *               type: string
 *         token:
 *           type: string
 *         status:
 *           type: boolean
 *         message:
 *           type: string
 *     LoginRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 * */
router.post('/', (req, res) => {
  const { password, email } = req.body;

  User.findOne({ email }, (err: Error, user: IUser) => {
    if (err) {
      res.status(500).json({status: false, message: "Internal Server Error"});
    } else if (!user) {
      res.status(404).json({status: false, message: 'User not found'});
    } else {
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          res.status(500).json({status: false, message: "Internal Server Error"});
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
                expiresIn: '365d'
              });
          const loginResponse : LoginResponse = {
            user: {
              email: user.email,
              name: user.name
            },
            token,
            status: true,
            message: 'Login Successful'
          };
          res.status(200).json(loginResponse);
        } else {
          res.status(401).json({status: false, message: 'Password is incorrect'});
        }
      });
    }
  });
});


export default router;
