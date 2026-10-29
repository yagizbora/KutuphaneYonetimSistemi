import axios from '../utils/axiosConfig';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:44336/api';
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

export default class CustomerEBookService {
    getStaticFileUrl(filePath) {
        if (!filePath) return null;
        if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
            return filePath;
        }
        return `${API_ORIGIN}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
    }

    async getCatalog() {
        const response = await axios.get('/CustomerEBook/Catalog');
        return response.data;
    }

    async getMyLibrary() {
        const response = await axios.get('/CustomerEBook/MyLibrary');
        return response.data;
    }

    async getMyRequests() {
        const response = await axios.get('/CustomerEBook/MyRequests');
        return response.data;
    }

    async requestAccess(ebookId) {
        const response = await axios.post('/CustomerEBook/RequestAccess', { ebook_id: ebookId });
        return response.data;
    }

    async cancelRequest(requestId) {
        const response = await axios.delete(`/CustomerEBook/CancelRequest/${requestId}`);
        return response.data;
    }

    async toggleFavorite(ebookId) {
        const response = await axios.post(`/CustomerEBook/ToggleFavorite/${ebookId}`);
        return response.data;
    }

    async downloadEBook(ebookId, fallbackName = 'ekitap.pdf') {
        const response = await axios.get(`/CustomerEBook/Download/${ebookId}`, {
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
}
