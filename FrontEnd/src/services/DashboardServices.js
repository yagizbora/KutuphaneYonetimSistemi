import axios from '../utils/axiosConfig';

const DashboardService = {
    getDashboardData: async () => {
        try {
            const response = await axios.get('/Count/CountBooks');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default DashboardService; 