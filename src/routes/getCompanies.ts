import express from 'express';
import authHandler from "../middleware/authHandler";
import {getAllCompanies, toICompany} from "../models/Company";

const router = express.Router();

/**
 * @swagger
 * paths:
 *   /getCompanies:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CompaniesResponse'
 *         '401':
 *           description: Unauthorized
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/GeneralResponse'
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     CompaniesResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: OK
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Company'
 *     Company:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *           example: C Company
 *         address:
 *           type: string
 *           example: Street 1, Boulevard 2, Avenue 3
 *         phone:
 *           type: string
 *           example: +1 (123) 456-7890
 *         geolocation:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *               example: 37.4224764
 *             longitude:
 *               type: number
 *               example: -122.0842499
 *         logo:
 *           type: string
 *           example: https://www.example.com/logo.png
 *         description:
 *           type: string
 *           example: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 *
 * */
router.get('/', authHandler, async (req, res) => {
    const companies = await getAllCompanies(process.env.MONGOURI ? process.env.MONGOURI : '');
    try {
        res.status(200).json({
            status: true,
            message: 'OK',
            data: await toICompany(companies)
        });
    } catch (e) {
        res.status(500).json({
            status: false,
            message: "Internal Server Error"
        })
    }
});


export default router;
