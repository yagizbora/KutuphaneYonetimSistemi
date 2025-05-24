import axios from '../utils/axiosConfig';


export default class AuthorService {

    async createauthor(data) {
        try {
            const response = await axios.post('/Author/CreateAuthor', data);
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    async getAllAuthors() {
        try {
            const response = await axios.get('/Author/GetAuthor');
            return response;
        } catch (error) {
            throw error;
        }
    }


}