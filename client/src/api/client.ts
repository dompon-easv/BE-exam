import {Api} from './Api'

//not to have to instantiate Api.ts in every file
export const MyApi = new Api({
    baseUrl: 'http://localhost:5154'
})

export function showApiError(err: any, fallback = 'Something went wrong.') {
    const validationErrors = err?.error?.errors;

    if (validationErrors && typeof validationErrors === 'object') {
        const messages = Object.values(validationErrors).flat().join('\n');
        if (messages) {
            alert(messages);
            return;
        }
    }

    const message =
        err?.error?.detail ||
        err?.error?.title ||
        err?.error?.message ||
        fallback;

    alert(message);
}