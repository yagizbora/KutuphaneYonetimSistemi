import axios, { axiosFile } from '../utils/axiosConfig';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:44336/api';
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

export default class EBookService {
    getStaticFileUrl(filePath) {
        if (!filePath) return null;
        if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
            return filePath;
        }
        return `${API_ORIGIN}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
    }

    async getEBooks(filter = {}) {
        const response = await axios.post('/EBook/GetEBooks', filter);
        return response.data;
    }

    async getEBookById(id) {
        const response = await axios.get(`/EBook/GetEBook/${id}`);
        return response.data;
    }

    async createEBook(formData) {
        const response = await axiosFile.post('/EBook/CreateEBook', formData);
        return response.data;
    }

    async updateEBook(formData) {
        const response = await axiosFile.put('/EBook/UpdateEBook', formData);
        return response.data;
    }

    async deleteEBook(id) {
        const response = await axios.delete(`/EBook/DeleteEBook/${id}`);
        return response.data;
    }

    async getEBooksExcel(filter = {}) {
        const response = await axios.post('/EBook/GetAllEBooksExcel', filter, {
            responseType: 'blob'
        });

        const contentDisposition = response.headers['content-disposition'];
        let fileName = 'EBooks.xlsx';

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
        }

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return true;
    }

    async downloadEBookFile(id, fallbackName = 'ekitap.pdf') {
        const response = await axios.get(`/EBook/Download/${id}`, {
            responseType: 'blob'
        });

        const contentDisposition = response.headers['content-disposition'];
        let fileName = fallbackName;

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

    async getAdminRequestList() {
        const response = await axios.get('/EBook/AdminRequestList');
        return response.data;
    }

    async submitAdminRequestResult(payload) {
        const response = await axios.post('/EBook/AdminRequestResult', payload);
        return response.data;
    }

    async revokeAccess(requestId) {
        const response = await axios.post(`/EBook/RevokeAccess/${requestId}`);
        return response.data;
    }
}
