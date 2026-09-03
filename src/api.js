import { loginUser } from './controllers/authController';

/* API Configuration */
const baseUrl = 'http://localhost:3000/api';

// authentication
const authRoutes = [
    {
        route: '{baseUrl}/auth/login',
        type: 'POST',
        data: {
            email: '',
            password: '',
        },
    },
    {
        route: '{baseUrl}/auth/register',
        type: 'POST',
        data: {
            username: '',
            email: '',
            password: '',
        },
    },
];

// product
const productRoutes = [
    {
        route: '{baseUrl}/product',
        type: 'POST',
        data: {
            name: '',
            description: '',
            price: 0,
            category: '',
            stock: 0,
        },
    },
    {
        route: '{baseUrl}/product',
        type: 'GET',
        data: {},
    },
    {
        route: '{baseUrl}/product/:id',
        type: 'GET',
        data: {},
    },
    {
        route: '{baseUrl}/product/:id',
        type: 'PATCH',
        data: {
            name: '',
            description: '',
            price: 0,
            category: '',
            stock: 0,
        },
    },
    {
        route: '{baseUrl}/product/:id',
        type: 'DELETE',
        data: {},
    },
];

// order
const orderRoutes = [
    {
        route: '{baseUrl}/order',
        type: 'POST',
        data: {
            userId: '',
            items: [],
            totalAmount: 0,
            status: '',
        },
    },
    {
        route: '{baseUrl}/order',
        type: 'GET',
        data: {},
    },
    {
        route: '{baseUrl}/order/:id',
        type: 'GET',
        data: {},
    },
    {
        route: '{baseUrl}/order/:id',
        type: 'PATCH',
        data: {
            status: '',
        },
    },
    {
        route: '{baseUrl}/order/:id',
        type: 'DELETE',
        data: {},
    },
];

export { baseUrl, authRoutes, productRoutes, orderRoutes };
