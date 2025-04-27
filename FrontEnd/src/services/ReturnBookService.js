import axios from '../utils/axiosConfig'


export default class ReturnBookService {
    async getReturnBook() {
        const response = await axios.get('/BookTakenUntaken/TakenBooksGet')
        return response;
    }
}
