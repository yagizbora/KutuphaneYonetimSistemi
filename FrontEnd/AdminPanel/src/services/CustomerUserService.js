import axios from '../utils/axiosConfig';


export default class CustomerUserService {

    async ListCustomerUsers() {
        const response = await axios.get('auth/CustomerUser/ListAllCustomerUser');
        return response;
    }
    async ListCustomerUsersbyid(data) {
        const response = await axios.get(`auth/CustomerUser/ListAllCustomerUser/${data}`);
        return response;
    }

    async CustomerUserCreate(data) {
        const response = await axios.post('auth/CustomerUser/CreateCustomerUser', data);
        return response;
    }

    async editCustomerUser(data) {
        const response = await axios.put(`auth/CustomerUser/EditCustomerUser`, data);
        return response;
    }

}



