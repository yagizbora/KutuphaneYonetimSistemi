import axios from '../utils/axiosConfig';


export default class LogService {
    async PaymentLogs() {
        try {
            const response = await axios.get("/Logs/PaymentLogs")
            return response;
        }
        catch (error) {
            console.error("Error fetching payment logs:", error);
            throw error;
        }
    }
    async UserLoginOperationLogs(data) {
        try {
            const response = await axios.post("/Logs/UserLoginOperationLogs", data)
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    async UserOperationLogs(data) {
        try {
            const response = await axios.post("/Logs/UserOperationLogs", data)
            return response;
        }
        catch (error) {
            throw error;
        }
    }
}