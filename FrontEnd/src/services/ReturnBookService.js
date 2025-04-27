import axios from '../utils/axiosConfig'


export default class ReturnBookService {
    async getReturnBook() {
        const response = await axios.get('/BookTakenUntaken/TakenBooksGet')
        return response;
    }

    async deleteReturnBook(data) {
        const response = await axios.delete('/BookTakenUntaken/TakenBooksDelete', { data: data })
        return response;
    }
    async CalculateBookLending(data) {
        const response = await axios.get(`/BookTakenUntaken/CalculateBookLending/${data}`);
        return response;
    }
    async ReturnBook(data) {
        const response = await axios.post('/BookTakenUntaken/ReturnBook', data);
        return response;
    }
}
