export const addElipsis = (str, limit) => {
    if (typeof str !== 'string') return '';
    return str.length > limit ? str.substring(0, limit) + '...' : str;
}


export const getAccessToken = () => {
    return sessionStorage.getItem('access token');
}
