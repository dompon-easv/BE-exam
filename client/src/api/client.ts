import {Api} from './Api';


export const MyApi = new Api<string>({
    baseUrl: 'http://localhost:5154',
    baseApiParams: {
        secure: true,
    },
    securityWorker: (token) => {
        if (!token) return;
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    },

})