
import axios from '../utils/axiosConfig';

export default class LendingBookService {
    async getLendingBooks() {
        const response = await axios.get('/BookTakenUntaken/LendingBooksGet');
        return response.data;
    }

    async getLendingBooksById(id) {
        const response = await axios.get(`/BookTakenUntaken/LendingBooksGetbyid/${id}`);
        return response.data;
    }

    async lendBook(data) {
        const response = await axios.post('/BookTakenUntaken/LendingBooksGetbyid/{id}', data);
        return response.data;
    }

}
