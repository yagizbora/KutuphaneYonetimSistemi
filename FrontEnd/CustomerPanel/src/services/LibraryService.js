import axios from '../utils/axiosConfig';


export default class LibraryService {

    async getAllLibrariesForCustomers() {
        try {
            const response = await axios.get('Library/GetAllLibrariesForCustomers');
            return response;
        } catch (error) {
            return error;
        }

    }
}