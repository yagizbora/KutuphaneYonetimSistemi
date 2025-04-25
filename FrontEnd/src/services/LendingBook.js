
import axios from '../utils/axiosConfig';

export default class LendingBookService {
    async getLendingBooks() {
        const response = await axios.get('/Book/LendingBooksGet');
        return response.data;
    }
    async lendBook(data) {
        const response = await axios.post('/Book/LendingBooks', data);
        return response.data;
    }
}
