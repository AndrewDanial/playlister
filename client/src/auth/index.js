import React, { createContext, useEffect, useState, useContext } from "react";
import { useHistory } from 'react-router-dom'
import GlobalStoreContext from "../store";
import api from './auth-request-api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    GUEST: "CONTINUE_AS_GUEST",
    ERROR: "ERROR"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        err: null,
        isGuest: false
    });
    const history = useHistory();
    const { store } = useContext(GlobalStoreContext);
    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,

                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    isGuest: payload.isGuest
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                })
            }
            case AuthActionType.ERROR: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    err: payload
                })
            }
            case AuthActionType.GUEST: {
                return setAuth({
                    user: null,
                    loggedIn: true,
                    err: false,
                    isGuest: true
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }

    auth.continueAsGuest = async function () {
        authReducer({
            type: AuthActionType.LOGIN_USER,
            payload: {
                isGuest: true,
                user: "Guest",
            }
        });
    }

    auth.registerUser = async function (firstName, lastName, username, email, password, passwordVerify) {
        try {
            const response = await api.registerUser(firstName, lastName, username, email, password, passwordVerify);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
            }
        }
        catch (err) {
            console.log(err)
            authReducer({
                type: AuthActionType.ERROR,
                payload: err.response.data.errorMessage
            });
        }

    }

    auth.loginUser = async function (email, password) {
        try {
            const response = await api.loginUser(email, password);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
            }
        }
        catch (err) {
            authReducer({
                type: AuthActionType.ERROR,
                payload: err.response.data.errorMessage
            });
        }
    }

    auth.logoutUser = async function () {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            history.push("/");
        }
    }

    auth.getUserInitials = function () {
        let initials = "";
        if (auth.user && !auth.isGuest) {
            initials += auth.user.firstName.charAt(0);
            initials += auth.user.lastName.charAt(0);
        }
        console.log("user initials: " + initials);
        return initials;
    }

    auth.clearErr = function () {
        authReducer({
            type: AuthActionType.LOGOUT_USER,
            payload: null
        });
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };
