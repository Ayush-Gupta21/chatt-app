import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Logo from '../assets/logo.png'

function Contacts({contacts, currentUser, changeChat}) {

    const [currentUserName, setCurrentUserName] = useState(undefined)
    const [currentUserImage, setCurrentUserImage] = useState(undefined)
    const [currentSelected, setCurrentSelected] = useState(undefined)

    useEffect(() => {
        if(currentUser) {
            setCurrentUserName(currentUser.username)
            setCurrentUserImage(currentUser.avatarImage)
        }
    }, [currentUser])

    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index)
        changeChat(contact)
    }

    return <>
            {
                currentUserName && currentUserImage && (
                    <Container>   
                        <div className="brand">
                            <img src={Logo} alt="logo" />
                            <h3>Chat App</h3>
                        </div>
                        <div className="contacts">
                            {
                                contacts.map((contact, index) => {
                                    if(contact.isAvatarImageSet) {
                                        return (
                                            <div 
                                                className={`contact ${index === currentSelected ? "selected" : ""}`} 
                                                key={index}
                                                onClick={() => changeCurrentChat(index, contact)}
                                            >
                                                <div className="avatar">
                                                    <img 
                                                        src={`data:image/svg+xml;base64,${contact.avatarImage}`} 
                                                        alt="avatar" 
                                                    />
                                                </div>
                                                <div className="username">
                                                    <h3>{contact.username}</h3>
                                                </div>
                                            </div>
                                        )
                                    }
                                })
                            }
                        </div>
                        <div className="current-user">
                            <div className="avatar">
                                <img 
                                    src={`data:image/svg+xml;base64,${currentUserImage}`} 
                                    alt="avatar" 
                                />
                            </div>
                            <div className="username">
                                <h2>{currentUserName}</h2>
                            </div>
                        </div>
                    </Container>
                )
            }
        </>
}

const Container = styled.div`
    display: grid;
    grid-template-rows: 10% 75% 15%;
    overflow: hidden;
    background-color: #a80420;
    .brand {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        img {
            height: 2rem;
        }
        h3 {
            color: white;
            font-size: 1.5rem;
        }
    }
    .contacts {
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: auto;
        gap: 0.1rem;
        &::-webkit-scrollbar {
            width: 0.4rem;
            &-thumb {
                background-color: rgb(0, 0, 0, 0.3);
                width: 0.1rem;
                border-radius: 1rem;
            }
        }
        .contact {
            background-color: #ffffff39;
            min-height: 5rem;
            width: 90%;
            cursor: pointer;
            border-radius: 0.2rem;
            padding: 0.4rem;
            gap: 1rem;
            align-items: center;
            display: flex;
            transition: 0.2 ease-in-out;
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
            &:hover {
                color: black;
                background-color: grey;
                transition: 0.3s ease-in;
            }
        }
        .selected {
            background-color: grey;
        }
    }
    .current-user {
         background-color: #0d0d30;
         display: flex;
         justify-content: center;
         align-items: center;
         gap: 2rem;
         .avatar {
            img {
                height: 4rem;
                max-inline-size: 100%;
            }
         }
         .username {
            h2 {
                color: white;
            }
         }
         @media screen and (min-width: 720px) and (max-width: 1080px) {
            gap: 0.5rem;
             .username {
                h2 {
                    font-size: 1rem;
                }
             }
        }
    }
`

export default Contacts;