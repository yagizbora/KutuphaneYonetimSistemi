import axiosConfig from '../utils/axiosConfig';

export default class userService {

    async logout() {
        const response = await axiosConfig.post('/auth/User/Logout');
        if (response) {
            return response;
        }
    }
}