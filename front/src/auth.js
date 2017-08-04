export const setToken = (token, expires) => {
    localStorage.setItem('token', token)
    localStorage.setItem('expires', expires)
}