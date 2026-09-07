import axios from 'axios';


const fetchData = async() => {
    try{
        
        const response = await axios.get("http://localhost:8000/");
        return response.data;
    }
    catch(error){
        console.log(error);
        throw error;
    }
};

export default fetchData