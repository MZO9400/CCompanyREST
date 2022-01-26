export const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            version: "1.0.0",
            title: "C Company API Docs",
            description: "API server for C Company",
            contact: {
                name: "Hamza",
                url: "https://github.com/MZO9400",
                email: "hamza.hameed00@gmail.com"
            },
        },
        servers: [
            {
                url: "https://c-company.herokuapp.com/api/v1"
            },
            {
                url: "http://localhost:3000/api/v1"
            }
        ],
    },
    apis: [
        ".//src/**/*.ts",
    ]
}
