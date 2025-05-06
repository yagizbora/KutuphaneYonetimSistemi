import axios from '../utils/axiosConfig';


export default class BookService {
    async getBooks(data) {
        const response = await axios.post('/Book/GetBook', data);
        return response.data;
    }

    async createbook(data) {
        try {
            const response = await axios.post('/Book/CreateBook', data);
            return response;
        } catch (error) {
            console.error('Error creating book:', error);

        }
    }

    async getbooksbyid(id) {
        try {
            const response = await axios.get(`/Book/GetBook/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching book details:', error);

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

        }
    }
}