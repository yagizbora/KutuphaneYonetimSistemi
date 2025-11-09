import axios from '../utils/axiosConfig';


export default class LogService {
    async PaymentLogs(data) {
        try {
            const response = await axios.post("/Logs/PaymentLogs", data)
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
    async RequestBookLogs() {
        try {
            const response = await axios.get("/Logs/RequestBookLogs")
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    async RequestBookLogsExcel() {
        try {
            const response = await axios.get('/Logs/RequestBookLogsExcel', {
                responseType: 'blob'
            });

            const contentDisposition = response.headers['content-disposition'];

            let fileName = 'RequestBookLogs.xlsx';

            if (contentDisposition) {
                const filenameStarMatch = contentDisposition.match(/filename\*\s*=\s*(?:UTF-8'')?([^;\n]*)/i);
                if (filenameStarMatch && filenameStarMatch[1]) {
                    fileName = decodeURIComponent(filenameStarMatch[1].trim());
                } else {
                    const filenameMatch = contentDisposition.match(/filename\s*=\s*["']?([^"';\n]+)["']?/i);
                    if (filenameMatch && filenameMatch[1]) {
                        fileName = filenameMatch[1].trim();
                    }
                }
            } else {
                console.warn('Content-Disposition header bulunamadı. Varsayılan dosya adı kullanılacak.');
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }
        catch (error) {
            throw error;
        }
    }
}