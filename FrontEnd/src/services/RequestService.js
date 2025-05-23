import axios from '../utils/axiosConfig';


export default class RequestService {
    async getbookrequest(data) {
        try {
            const response = await axios.post('BookRequest/GetBookRequest', data)
            return response.data;
        }
        catch (error) {
            throw error;
        }
    }
    async getbookrequestbyid(data) {
        try {
            const response = await axios.get(`BookRequest/GetBookRequest/${data}`)
            return response.data;
        }
        catch (error) {
            throw error;
        }
    }
    async createbookrequest(data) {
        try {
            const response = await axios.post('BookRequest/CreateRequest', data)
            return response
        }
        catch (error) {
            throw error;
        }
    }
    async deletebookrequest(data) {
        try {
            const response = await axios.delete(`BookRequest/DeleteRequest/${data.id}`)
            return response
        }
        catch (error) {
            console.log(error);
        }
    }
    async complatedbookrequest(data) {
        try {
            const response = await axios.post(`BookRequest/ComplateRequest`, data)
            return response
        }
        catch (error) {
            console.log(error);
        }
    }
}