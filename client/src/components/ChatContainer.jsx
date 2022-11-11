import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { getAllMessagesRoute, sendMessageRoute } from '../utils/APIRoutes';
import ChatInput from './ChatInput';
import Logout from './Logout';
import {v4 as uuidv4} from 'uuid'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import aesjs from 'aes-js';

function ChatContainer({currentChat, currentUser, socket}) {

    const [messages, setMessages] = useState([])
    const [arrivalMessage, setArrivalMessage] = useState(null)

    const scrollRef = useRef()
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchApi () {
            if(currentChat) {
                try {
                    const response = await axios.post(getAllMessagesRoute, {
                        from: currentUser._id,
                        to: currentChat._id
                    }, {withCredentials: true})
                    const encryptedMessages = response.data
                    const decryptedMessages = encryptedMessages.map((msg) => {
                        return {
                            fromSelf: msg.fromSelf,
                            message: decryptMessage(msg.message)
                        }
                    })
                    setMessages(decryptedMessages)
                } catch (ex) {
                    console.log("in catch")
                    navigate("/login")
                }
            }
        }
        fetchApi()
    }, [currentChat])

    const encryptMessage = (msg) => {
        var key_128 = JSON.parse(process.env.REACT_APP_MESSAGE_KEY)
        var textBytes = aesjs.utils.utf8.toBytes(msg)
        var aesCtr = new aesjs.ModeOfOperation.ctr(key_128, new aesjs.Counter(5))
        var encryptedBytes = aesCtr.encrypt(textBytes)
        var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes)
        return encryptedHex
    }

    const decryptMessage = (msg) => {
        var key_128 = JSON.parse(process.env.REACT_APP_MESSAGE_KEY)
        var encryptedBytes = aesjs.utils.hex.toBytes(msg)
        var aesCtr = new aesjs.ModeOfOperation.ctr(key_128, new aesjs.Counter(5))
        var decryptedBytes = aesCtr.decrypt(encryptedBytes)
        var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes)
        return decryptedText
    }

    const handleSendMsg = async (msg) => {
        const encryptedMsg = encryptMessage(msg)
        try {
            await axios.post(sendMessageRoute, {
                from: currentUser._id,
                to: currentChat._id,
                message: encryptedMsg
            }, {withCredentials: true})
        } catch (ex) {
            navigate("/login")
        }
        socket.current.emit("send-msg", {
            to: currentChat._id,
            from: currentUser._id,
            msg: encryptedMsg,
            token: Cookies.get("accessToken")
        })
        const msgs = [...messages]
        msgs.push({fromSelf: true, message: msg})
        setMessages(msgs)
    }

    useEffect(() => {
        if(socket.current) {
            socket.current.on("msg-receive", (data) => {
                data.from === currentChat._id && setArrivalMessage({fromSelf: false, message: decryptMessage(data.msg)})
            })
        }
    })

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage])
    }, [arrivalMessage])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behaviour: "smooth"})
    }, [messages])

    return currentChat && <Container>
        <div className="chat-header">
            <div className="user-details">
                 <div className="avatar">
                 <img 
                    src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} 
                    alt="avatar" 
                />
                 </div>
                 <div className="username">
                     <h3>{currentChat.username}</h3>
                 </div>
            </div>
            <Logout />
        </div>
        <div className="chat-messages">
            {
                messages.map((message) => {
                     return (
                        <div ref={scrollRef} key={uuidv4()}>
                            <div className={`message ${message.fromSelf ? "sent" : "recieved"}`}>
                                <div className="content">
                                    <p>
                                        {message.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                     )
                })
            }
        </div>
        <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
}

const Container = styled.div`
    display: grid;
    grid-template-rows: 10% 78% 12%;
    overflow: hidden;
    background-color: #d9d9d9;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
        grid-template-rows: 15% 70% 15%;
    }
    .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0rem 2rem;
        background-color: rgb(240, 242, 245);
        .user-details {
            display: flex;
            align-items: center;
            gap: 1rem;
            .avatar {
                img {
                    height: 3rem;
                }
            }
            .username {
                h3 {
                    color: black;
                }
            }
        }
    }
    .chat-messages {
        padding: 1rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        overflow: auto;
        &::-webkit-scrollbar: {
            width: 0.2rem;
            &-thumb {
                background-color: #ffffff39;
                width: 0.1rem;
                border-radius: 1rem;
            }
        }
        .message {
            display: flex;
            align-items: center;
            .content {
                max-width: 40%;
                overflow-wrap: break-word;
                padding: 0.5rem;
                font-size: 1rem;
                border-radius: 0.5rem;
                color: white;
            }
        }
        .sent {
            justify-content: flex-end;
            .content {
                background-color: #800b0b;
            }
        }
        .recieved {
            justify-content: flex-start;
            .content {
                background-color: #a81616;
            }
        }
    }
`

export default ChatContainer;