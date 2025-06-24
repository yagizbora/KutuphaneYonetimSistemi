import axios from '../utils/axiosConfig';


export default class LibraryService {
    async GetLibraries() {
        const response = await axios.get('Library/GetAllLibraries');
        return response;
    }
    async createlibrary(data) {
        const response = await axios.post('Library/CreateLibraries', data);
        return response;
    }

}