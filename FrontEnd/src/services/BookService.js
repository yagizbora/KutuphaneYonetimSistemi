import axios from '../utils/axiosConfig';


export default class BookService {
    async getBooks() {
        const response = await axios.get('/Book/GetBook');
        return response.data;
    }

    async getbooksbyid(id) {
        try {
            const response = await axios.get(`/Book/GetBook/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching book details:', error);
            throw error;
        }
    }

    async updateBook(id, bookData) {
        try {
            const response = await axios.put(`/Book/UpdateBook`, bookData);
            return response;
        } catch (error) {
            console.error('Error updating book:', error);
        }
    }

    async deleteBook(id) {
        try {
            const response = await axios.delete(`/Book/DeleteBook/${id}`);
            return response;
        } catch (error) {
            console.error('Error deleting book:', error);
            throw error;
        }
    }
}