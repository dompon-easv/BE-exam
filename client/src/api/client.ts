import {Api} from './Api'

//not to have to instantiate Api.ts in every file
export const MyApi = new Api({
    baseUrl: 'http://localhost:5154'
})