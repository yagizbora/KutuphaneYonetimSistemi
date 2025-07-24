import axiosConfig from '../utils/axiosConfig';

export default class userService {

    async logout() {
        try {
            const response = await axiosConfig.post('/auth/CustomerUser/CustomerLogout');
            if (response) {
                return response;
            }
        }
        catch (error) {
            throw error;
        }
    }


}