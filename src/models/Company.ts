import * as mongoose from "mongoose";


export interface Company extends mongoose.Document {
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

export const CompanyModel = mongoose.model<Company>("Company", companySchema);
