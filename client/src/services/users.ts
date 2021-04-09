import axios from 'axios';

const API_BASE = 'http://localhost:3000';

interface Credentials {
    username?: string,
    password?: string,
}

const login = async (credentials: Credentials) => {
    return axios({
        url: API_BASE + '/login',
        data: credentials,
        headers: {'content-type': 'application/json'},
    });
};

export default {
    login,
};