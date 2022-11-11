import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { allUsersRoute, currentUserRoute, host } from '../utils/APIRoutes';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client'
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';

function Chat(props) {

    const socket = useRef()

    const [contacts, setContacts] = useState([])
    const [currentUser, setCurrentUser] = useState(undefined)
    const [currentChat, setCurrentChat] = useState(undefined)
    const [isLoaded, setIsLoaded] = useState(false) 

    const navigate = useNavigate()

    useEffect(() => {
        (async () => {
            const response = await axios.get(currentUserRoute, {withCredentials: true})
            setCurrentUser(response.data)
            setIsLoaded(true)
        })()
        .catch(err => navigate("/login"))
    }, [])

    useEffect(() => {
        if(currentUser) {
            socket.current = io(host)
            socket.current.emit("add-user", currentUser._id)
        }
    })

    useEffect(() => {
        async function myFetchApi () {
            if(currentUser) {
                if(currentUser.isAvatarImageSet) {
                    const users = await axios.get(`${allUsersRoute}/${currentUser._id}`, {withCredentials: true})
                    setContacts(users.data)
                } else {
                    navigate('/setAvatar')
                }
            }
        }
        myFetchApi()
    }, [currentUser])

    const handleChatChange = (chat) => {
        setCurrentChat(chat)
    }
 
    return <Container>
        <div className="container">
            <Contacts 
                contacts={contacts} 
                currentUser={currentUser} 
                changeChat={handleChatChange}
            />
            {
                isLoaded && currentChat === undefined ?  
                <Welcome currentUser={currentUser} /> :
                <ChatContainer 
                    currentChat={currentChat} 
                    currentUser={currentUser}
                    socket={socket} 
                />
            }
        </div> 
    </Container>
}

const Container = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: rgb(38, 38, 38);
    .container {
        height: 85vh;
        width: 85vw;
        background-color: rgb(114, 212, 183);
        display: grid;
        grid-template-columns: 25% 75%;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
            grid-template-columns: 35% 65%;
        }
    }
`

export default Chat