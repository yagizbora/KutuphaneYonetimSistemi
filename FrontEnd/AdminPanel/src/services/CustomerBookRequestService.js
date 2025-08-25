import axios from '../utils/axiosConfig';


export default class CustomerBookRequestService {
    async ListCustomerBookRequests() {
        const response = await axios.get('CustomerBook/RequestBookAdminList');
        return response;
    }
}