import React, {createContext, useContext, useState, useEffect} from "react";
import api from "../api/axios";
import {setAccessToken} from "../api/axios";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch authenticated user
    const fetchUser = async () => {
        try {
            const res = await api.get("/api/auth/me/");
            setUser(res.data);
        } catch (err) {
            setUser(null);
        }
    };

    // Initialize auth on app load
    useEffect(() => {
        const init = async () => {
            try {
                // Try refreshing access token using refresh token from HttpOnly cookie
                const res = await api.post("/api/refresh/");
                const access = res.data.access;
                setAccessToken(access);

                // Fetch user info
                await fetchUser();
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    // Login function
    const login = async (username, password) => {
        const res = await api.post("/api/auth/login/", {username, password});
        const access = res.data.access;
        setAccessToken(access);

        // Fetch user info
        await fetchUser();
    };

    // Logout function
    const logout = async () => {
        try {
            await api.post("/api/logout/");
        } catch (err) {
            console.error("Logout error:", err);
        }
        setAccessToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};
