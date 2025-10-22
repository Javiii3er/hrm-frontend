import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { ApiClient } from '../types/api.gen.ts';
import type { LoginRequest, AuthResponse, User, ApiResponse } from '../types/api.gen.ts'; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'; 
const apiClient = new ApiClient({ baseURL: API_BASE_URL });

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
    apiClient: ApiClient; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const setAuthData = useCallback((token: string, userData: User) => {
        localStorage.setItem('accessToken', token);
        apiClient.setToken(token);
        setUser(userData);
    }, []);

    const clearAuthData = useCallback(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        apiClient.setToken(undefined); 
        setUser(null);
    }, []);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            apiClient.setToken(accessToken);
            apiClient.getProfile()
                .then((response: ApiResponse<User>) => { 
                    if (response.success) {
                        setUser(response.data);
                    } else {
                        clearAuthData();
                    }
                })
                .catch(() => {
                    clearAuthData();
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [clearAuthData, setAuthData]);

    const login = useCallback(async (credentials: LoginRequest): Promise<void> => {
        try {
            setIsLoading(true); 
            

            console.log(' Enviando login al backend...', credentials);
            
            const response: ApiResponse<AuthResponse> = await apiClient.login(credentials); 

            console.log(' Respuesta del backend:', response);

            if (response.success) {
                const { accessToken, user, refreshToken } = response.data;

                console.log(' Token recibido:', accessToken);
                console.log(' Usuario:', user);

                localStorage.setItem('refreshToken', refreshToken);
                
                setAuthData(accessToken, user);
                
            } else {
                throw new Error(response.message || "Login failed");
            }
        } catch (error: unknown) {
            console.error(' Error en login:', error);
            
            clearAuthData();
            
            const err = error as Error;

            throw new Error(err.message || "Credenciales inválidas o error de red.");

        } finally {
            setIsLoading(false);
        }
    }, [clearAuthData, setAuthData]);

    const logout = useCallback(() => {
        clearAuthData();
    }, [clearAuthData]);

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        apiClient,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};