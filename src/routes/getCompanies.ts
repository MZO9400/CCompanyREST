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
router.get('/', authHandler, cacheMiddleware, async (req, res) => {
    const companies = await getAllCompanies(process.env.MONGOURI ? process.env.MONGOURI : '');
    try {
        let result = await toICompany(companies)

        if (req.body.authorized === true) {
            result = result.map(company => {
                company.logo = 'data:image/png;base64,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dM8XLSDsMEpdDpg3BJoToELxf3ZFCggB0Pzl4UkIQGAVATagBf0dCCkorz0EIOCLQKnrS9YZCDsEX68LdiEAgbEIlFThyFJASnIgrzEEIBAngRI2sNkISKkpZJyvDqOCAASGEsh1fUpaQEpQeF5DCEAgLwI5VUiSFJCcHJDXq8FsIACBqgRy2AAnIyC5poBVg412EIBAvgRSXd+iFpAcFDrfkGdmEICADwIpVViiFJCUAPoIIGxCAAIQSGEDHY2ApJrCEeYQgAAEfBOIdX0MKiApKKzvwMA+BCAAgToEYqrQBBGQmADUcRxtIQABCLgmsGTJEllnnXVk6623Hmb6008/lb6+PvMZef3www+yfPlyWX/99WXp0qWia2qnbW9v75hDXLFihXz22Weyww47DLb5559/5Jdffhn2zFprrWVsd64//vhDvvzyS9luu+1kzTXXHPx9awISawrmOhiwBwEIQKAqgU8++USmTJkiV155pVx++eXmMV2oDzroIPn444/NzzNmzJC7775b1lhjDfn777/lmGOOkWeeecbc23nnnWX+/PmioqFCoh+9OmIyYcKEYUN55JFH5LTTTpNff/118PfvvPOO7LrrrsPaHXbYYfLcc8+Z311zzTVy6aWXmv+vt956pr+pU6ean70KCCWqqmFEOwhAoDQCuqnee++95Y033hgmIEcddZR8//338tRTT5lsYf/995fbbrvNLPw33XSTEZp58+bJRhttJIceeqjssssu8thjjw3iG63C89FHH8n9998vDz30kGk3VECefPJJueSSS+S+++4btLHhhhvK9ttvb8a2++67y7333isqKueee67MnTtXvv76a9EsxYuAUKIq7VVgvhCAQF0Cl112mdnla0noyCOPNMLw448/yqabbiovvPCCHHjggcbkscceawRl4cKFsuOOO5oMRDMWvW699VY544wzTOZxwgknmDLYzTffbO6dfvrppjR11VVXyeOPPy6vvfaafP755/LFF18ME5Drr79eFi1aNCguQ+dxzjnnGBF56aWXzK/fe+89k/W8+OKLcsABB7gTEEpUdcOH9hCAQKkEVAz2228/+fDDD+XUU081YqEC8sorr8hee+1lFv4NNtjA4LniiivkxhtvNCKhu34VHc0G9NJsQMtdakfPTFSIVCz0rOP444+X119/3WQQnfVZBeeGG24wbbXMpSUuzWwWLFhgftbzkBNPPFGOO+44mTx5shx88MGmvHXdddeZ/vQsZN1115W77rpLTj755O4EhBJVqeHPvCEAgaYEli1bZspD1157rVmE991330EB0TOK6dOny7///is9PT2mCy0fnXTSSSZz0Azj5Zdflj333NPc65yhaJaw2267yaxZs+SBBx4w97QsddFFFw0bppbCzj//fHn//feNIOnZiZ6x/PTTT3L11VebTEf/1X5effVV2WabbeTMM8+UCy+8cNCOZkhqV7OTRiUsSlRNQ4fnIACB0gloaen555+XW265xRyM60Ks5xgzZ8405SzNQH7++Wfp7+83qLTdPffcYxb0iRMnmgN0PSfR69133zXPqhhoxtApgelht9oYeYiuAnLBBReYElYnAfjmm2/MN7o222wzk4U88cQTJgvRb4edffbZpmymWUvnUmF79tln5YgjjqguIJSoSg975g8BCLggcNZZZxkx6FyaPWyyySZGOB588EFTIuqUnrSNCo6Wlu644w5z6H700UfLeeedZx5/9NFHTUbx1VdfmZ9nz55tDsN/++03s+jroffQa6iA6O9VOPRgXQ/qO9/k0rGdcsop5qD8zjvvlDfffNMIhl76u6222sqcpWiWMm4GQonKRbhgAwIQgMDYBPScQYWh8zVePbPQbECFYM6cOaak9fDDD8u0adPk4osvNtmICoyWm7QEps/efvvtpq2ejehi/8EHH5hMQzMUPfTuXCMFRH+v/avg6MG4CoMKlp616OH6W2+9ZcREbWvZTbMltalnKJqJjCoglKgIdwhAAALtEBgpILr46zectByll55BdL5ZpaWnww8/3JyD6LXHHnuYcpj+fYgu8Icccoj5uq7+vM8++5hSlX7DSgVBLxUazViGfo337bffNgf5+q9e2267rTz99NOy0047mdKYZjFqU6+NN97YCI3e02tQQLTeVuUPUdpBSi8QgAAEyiWgJSv9240ttthC9G8yRl56oK7nJ1pOcnXpHzDqteWWWxrbQy/NdvTAXs9INPPo/KHiwMCA9CxevHilnnFMmjTJfEYevLgaIHYgAAEIQCBtAqoVenaiH9WK/wA+V3jgNFFAUgAAAABJRU5ErkJggg==';
                return company;
            });
        }
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
