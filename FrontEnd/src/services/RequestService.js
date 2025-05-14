import axios from '../utils/axiosConfig';


export default class RequestService {
    async getbookrequest() {
        try {
            const response = await axios.get('BookRequest/GetBookRequest')
            return response.data;
        }
        catch (error) {
            throw error;
        }

    }
}