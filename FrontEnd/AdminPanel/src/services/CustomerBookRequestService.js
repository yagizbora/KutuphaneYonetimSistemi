import axios from '../utils/axiosConfig';


export default class CustomerBookRequestService {
    async ListCustomerBookRequests() {
        const response = await axios.get('CustomerBook/RequestBookAdminList');
        return response;
    }
    async CustomerRequestResult(data) {
        const response = await axios.post('CustomerBook/RequestBookAdminResult', data);
        return response;
    }
}