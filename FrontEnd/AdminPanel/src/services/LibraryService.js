import axios from '../utils/axiosConfig';


export default class LibraryService {
    async GetLibraries() {
        const response = await axios.get('Library/GetAllLibraries');
        return response;
    }
    async GetLibrariesbyid(data) {
        const response = await axios.get(`Library/GetAllLibraries/${data}`);
        return response;
    }
    async editLibraries(data) {
        const response = await axios.put('Library/EditLibrary', data);
        return response;
    }
    async createlibrary(data) {
        const response = await axios.post('Library/CreateLibraries', data);
        return response;
    }
    async deletelibrary(data) {
        const response = await axios.delete(`Library/DeleteLibrary/${data}`);
        return response;
    }

}