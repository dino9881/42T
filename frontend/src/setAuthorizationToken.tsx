import axios from 'axios';
import instance from './refreshToken';

export default function setAuthorizationToken(token: string | undefined) {
    if (token) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete instance.defaults.headers.common['Authorization'];
    }
}