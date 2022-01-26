import express, {NextFunction, Request, Response} from 'express';
import authHandler from "../middleware/authHandler";
import {getAllCompanies, toICompany} from "../models/Company";
import redisInstance from "../helpers/RedisInstance";

const CACHE = 'companies';

const router = express.Router();

const cacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
    redisInstance
        .getInstance()
        .get(CACHE)
        .then((data: string | null) => {
            if (data) {
                res.status(200).json({
                    status: true, message: 'OK', data: JSON.parse(data)
                });
            } else {
                throw new Error('No data');
            }
        })
        .catch(() => {
            next();
        });
}


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
 *           example: data:image/jpeg;base64,.....
 *         description:
 *           type: string
 *           example: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 *
 * */
router.get('/', cacheMiddleware, async (req, res) => {
    const companies = await getAllCompanies(process.env.MONGOURI ? process.env.MONGOURI : '');
    try {
        const result = await toICompany(companies)
        res.status(200).json({
            status: true, message: 'OK', data: result
        });
        await redisInstance.getInstance().set(CACHE, JSON.stringify(result));
    } catch (e) {
        res.status(500).json({
            status: false, message: "Internal Server Error"
        })
    }
});


export default router;
