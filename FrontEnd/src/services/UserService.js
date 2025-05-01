import axiosConfig from '../utils/axiosConfig';

export default class userService {

    async logout() {
        try {
            const response = await axiosConfig.post('/auth/User/Logout');
            if (response) {
                return response;
            }
        }
        catch (error) {
            throw error;
        }
    }

    async getUsers() {
        try {
            const response = await axiosConfig.get('/auth/User/ListAllUser');
            return response;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }
    async getUserById(data) {
        try {
            const response = await axiosConfig.get(`/auth/User/ListAllUser/${data}`);
            return response;
        }
        catch (error) {
            console.error('Error fetching user by ID:', error);
            throw error;
        }
    }

    async edituser(data) {
        try {
            const response = await axiosConfig.post('/auth/User/EditUser', data);
            return response;
        }
        catch (error) {
            console.error('Error editing user:', error);
            throw error;
        }
    }
    async createuser(data) {
        try {
            const response = await axiosConfig.post('/auth/User/CreateUser', data);
            return response;
        }
        catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async deleteuser(data) {
        try {
            const response = await axiosConfig.delete(`/auth/User/DeleteUser/${data.id}`);
            return response.data;
        }
        catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
    async changeusername(data) {
        try {
            const response = await axiosConfig.post('/auth/User/ChangeUsername', data);
            return response;
        }
        catch (error) {
            console.error('Error changing username:', error);
            throw error;
        }
    }
}