import axios from '../utils/axiosConfig';

const DashboardService = {
    getDashboardData: async () => {
        try {
            const response = await axios.get('/Count/CountBooks');
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    }
};

export default DashboardService; 