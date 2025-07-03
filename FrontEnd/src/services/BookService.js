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
    // BUG VAR DÜZELTİLECEK!
    async getbookexcel(data) {
        try {
            const response = await axios.post('/Book/GetAllBooksExcel');

            console.log('Headers:', response.headers);
            const contentDisposition = response.headers['Content-Disposition'];

            let fileName = 'Books.xlsx';

            if (contentDisposition) {
                // Öncelikli olarak filename* (UTF-8)
                const filenameStarMatch = contentDisposition.match(/filename\*\s*=\s*(?:UTF-8'')?([^;\n]*)/i);
                if (filenameStarMatch && filenameStarMatch[1]) {
                    fileName = decodeURIComponent(filenameStarMatch[1].trim());
                    console.log('filename* bulundu:', fileName);
                } else {
                    // Alternatif klasik filename
                    const filenameMatch = contentDisposition.match(/filename\s*=\s*["']?([^"';\n]+)["']?/i);
                    if (filenameMatch && filenameMatch[1]) {
                        fileName = filenameMatch[1].trim();
                        console.log('filename bulundu:', fileName);
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

        } catch (error) {
            console.error('Dosya indirilirken hata oluştu:', error);
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