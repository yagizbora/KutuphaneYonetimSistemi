import axios from '../utils/axiosConfig';

export default class CustomerBookService {

    async getAllCustomerBooks() {
        try {
            const response = await axios.get('CustomerBook/CustomerBookList');
            return response;
        } catch (error) {
            throw error;
        }
    }
}