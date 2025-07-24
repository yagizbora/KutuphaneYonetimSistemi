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
    async getAllAuthorsbyid(id) {
        try {
            const response = await axios.get(`/Author/GetAuthor/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async EditAuthor(data) {
        try {
            const response = await axios.put('Author/EditAuthor', data);
            return response;
        } catch (error) {
            throw error;
        }
    }
    async DeleteAuthor(data) {
        try {
            const response = await axios.delete(`Author/DeleteAuthor/${data.id}`);
            return response;
        }
        catch (error) {
            throw error;
        }
    }
}