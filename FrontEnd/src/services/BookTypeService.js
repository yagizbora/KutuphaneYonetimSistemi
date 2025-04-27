import axios from '../utils/axiosConfig';


export default class BookTypeService {

    async getbooktypes() {
        const response = await axios.get('/BookType/ListBookType')
        return response;
    }

    async deletebooktype(id) {
        const response = await axios.delete(`/BookType/DeleteTypeOfBook/${id}`);
        return response;
    }
    async getbooktypebyid(id) {
        const response = await axios.get(`/BookType/ListBookType/${id}`);
        return response;
    }

    async booktypeupdatebyid(data) {
        const response = await axios.put(`/BookType/UpdateBookType`, data);
        return response;
    }
}
