import {MongoClient} from "mongodb";
import {generateRandomPhoneNumber} from "../helpers/Company";
import fetchRandomImage from "../helpers/Images";

export interface ICompany {
    name: string;
    phone: string;
    address: string;
    geolocation: {
        latitude: number;
        longitude: number;
    };
    logo?: string;
    description: string;

}

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
            phone: generateRandomPhoneNumber(),
            address: company.vicinity,
            geolocation: {
                latitude: company.geometry.location.lat,
                longitude: company.geometry.location.lng,
            },
            logo: await fetchRandomImage(),
            description: company.types.map(
                (i: string) => i[0].toUpperCase() + i.slice(1).replace("_", " ")
            ).join(", "),
        }))
        Promise.all(promises).then(res).catch(rej)
    })
}
