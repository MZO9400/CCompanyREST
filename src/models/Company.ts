import * as mongoose from "mongoose";
import {MongoClient} from "mongodb";
import {generateRandomPhoneNumber} from "../helpers/Company";
import fetchRandomImage from "../helpers/Images";

export interface ICompany {
    name: string;
    phoneNumber: string;
    address: string;
    geolocation: {
        lat: number;
        lng: number;
    };
    logo?: string;
    description: string;

}

export interface ICompanyMongoose extends mongoose.Document, ICompany {}

const companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        geolocation: {
            lat: {
                type: Number,
                required: true,
            },
            lng: {
                type: Number,
                required: true,
            },
        },
        logo: {
            type: String,
            required: false,
        },
        description: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const getAllCompanies = (URL: string): Promise<any> => {
    return new Promise((res, rej) => {
        MongoClient.connect(URL, async (err, db) => {
            if (err) {
                rej(err)
            } else {
                const dbo = db?.db("mad")?.collection('ccompany');
                const results = await dbo?.find({});
                results?.toArray((err, result) => {
                    if (err) {
                        rej(err)
                    } else {
                        res(result)
                    }
                });
            }
        })
    })
}

export const toICompany = async (data: any[]): Promise<ICompany[]> => {
    return new Promise((res, rej) => {
        const promises = data.map(async (company: any) => ({
            id: company._id,
            name: company.name,
            phoneNumber: generateRandomPhoneNumber(),
            address: company.vicinity,
            geolocation: {
                lat: company.geometry.location.lat,
                lng: company.geometry.location.lng,
            },
            logo: await fetchRandomImage(),
            description: company.types.map(
                (i: string) => i[0].toUpperCase() + i.slice(1).replace("_", " ")
            ).join(", "),
        }))
        Promise.all(promises).then(res).catch(rej)
    })
}

export const CompanyModel = mongoose.model<ICompanyMongoose>("Company", companySchema);
