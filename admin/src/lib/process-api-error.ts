export function processApiError(res: any): Error {
    const { message } = res;
    if (Array.isArray(message)) {
        return new Error(message.join(', '));
    } else {
        return new Error(message);
    }
}
