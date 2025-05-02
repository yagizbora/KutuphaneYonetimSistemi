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
}