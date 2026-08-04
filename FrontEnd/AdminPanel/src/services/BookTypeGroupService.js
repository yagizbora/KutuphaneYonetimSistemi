import axios from "../utils/axiosConfig";


export default class BookTypeGroupService {

    async GetBookTypeGroup() {
        const response = await axios.get("BookTypeGroup/GetBookTypeGroup")
        return response;
    }
    async UpdateBookTypeGroup(data) {
        const response = await axios.put("BookTypeGroup/UpdateBookTypeGroup",data)
        return response
    }
    async AddBookTypeGroup(data) {
        const response = await axios.post("BookTypeGroup/InsertBookTypeGroup",data)
        return response
    }
}