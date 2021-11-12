export default interface Company {
    name: string;
    phoneNumber: string;
    address: string;
    geolocation: {
        lat: number;
        lng: number;
    };
    logo: string;
    description: string;
}
