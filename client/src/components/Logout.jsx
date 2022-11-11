import React from 'react';
import { useNavigate } from 'react-router-dom';
import {BiPowerOff} from 'react-icons/bi'
import styled from 'styled-components';
import axios from 'axios';
import { logoutRoute } from '../utils/APIRoutes';
import { toast } from 'react-toastify';

function Logout(props) {

    const navigate = useNavigate()

    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark" 
    }

    const handleClick = async() => {
        const res = await axios.post(logoutRoute, {withCredentials: true})
        toast.success(res.data.message, toastOptions)
        navigate('/login')
    }

    return <Button onClick={handleClick}>
        <BiPowerOff />
    </Button>
}

const Button = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: black;
    border: none;
    cursor: pointer;
    svg {
        font-size: 1.3rem;
        color: #ebe7ff;
    }
`

export default Logout;