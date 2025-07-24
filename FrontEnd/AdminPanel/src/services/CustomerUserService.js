import axios from '../utils/axiosConfig';


export default class CustomerUserService {



    async CustomerUserCreate(data) {
        const response = await axios.post('auth/CustomerUser/CreateCustomerUser', data);
        return response;
    }

}



