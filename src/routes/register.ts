import express from 'express';
import User from "../models/User";
import bcrypt from 'bcrypt';
import {emailExists} from "../helpers/User";

const router = express.Router();

/**
 * @swagger
 * paths:
 *   /register:
 *     post:
 *       responses:
 *         '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/GeneralResponse'
 *         '500':
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/GeneralResponse'
 *         '400':
 *           description: User Already Exists
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/GeneralResponse'
 *
 *     parameters:
 *       - in: body
 *         description: User to register
 *         type: RegisterRequest
 *         schema:
 *           $ref: '#/components/schemas/RegisterRequest'
 *
 * components:
 *   schemas:
 *     GeneralResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *         message:
 *           type: string
 *     RegisterRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         name:
 *           type: string
 * */
router.post('/', async (req, res) => {
    const {password, email, name} = req.body;

    if (await emailExists(email)) {
        return res.status(400).json({status: false, message: 'User already exists'});
    }

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({status: false, message: "Internal Server Error"});
        } else {
            const user = new User({
                email,
                password: hash as string,
                name
            });
            user.save()
                .then(() => res.status(200).json({status: true, message: 'User created'}))
                .catch(() => res.status(500).json({status: false, message: "Internal Server Error"}));
        }
    });
});


export default router;
