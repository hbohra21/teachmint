import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

export const useFetch = (path, initialState, immediate = true) => {


    const [data, setData] = useState(null);

    const [response, setResponse] = useState(initialState);
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const history = useNavigate()


    const getData = async (url) => {
        setIsLoading(true)
        try {


            const headers = {

                'Content-Type': 'application/json'
            };

            const response = await fetch(url, {
                // headers: headers
            });
            const jsonData = await response.json();
            setData(jsonData);

            if (!response.ok) {
                history("/")
                throw new Error(toast.error(jsonData.message ?? "Session Expired"));
            }


            setData(jsonData);
            var result
            if (response.data) {
                result = response.data
            } else {
                result = response.response
            }
            return result
        } catch (error) {
            setErrorMsg(error.message);
        }
        finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        if (immediate) {
            getData(path)
        }
    }, [])

    return [data, isLoading, getData, errorMsg, setResponse,];
};

export default useFetch
