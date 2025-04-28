import axiosConfig from '../utils/axiosConfig';

export default class userService {

    async logout() {
        const response = await axiosConfig.post('/auth/User/Logout');
        if (response) {
            return response;
        }
    }
    async createuser(data) {
        try {
            const response = await axiosConfig.post('/auth/User/CreateUser', data);
            return response;
        }
        catch (error) {
            console.error('Error creating user:', error);
        }

    }
}