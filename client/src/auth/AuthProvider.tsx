import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { MyApi } from "../api/client";
import type {LoginRequestDto} from "@/api/Api.ts";

export interface AuthUser{
    name: string;
    role: string;
}

interface AuthContextValue{
    token: string | null;
    user: AuthUser | null;
    login: (request: LoginRequestDto) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const NAME_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'; 

function parseJwtUser(token: string) : AuthUser | null {
    try {
        const payloadPart = token.split('.')[1];
        if (!payloadPart) return null;
        
        // JWT uses Base64Url (- and _ instead of + and /) 
        const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        
        // Discard tokens that have expired on initialization
        if (typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now()) {
            return null;
        }
        
        const name = payload[NAME_CLAIM];
        const role = payload[ROLE_CLAIM];
        if (!name || !role) return null;
        
        return {name, role};
    }catch {
        return null;
    }
}
    
export function AuthProvider ({ children }: {children: ReactNode}) {
    const [token, setToken] = useState<string | null>(() => {
        const stored = sessionStorage.getItem('token');
            if (!stored || !parseJwtUser(stored)) {
                sessionStorage.removeItem('token');
                return null;
            }
            MyApi.setSecurityData(stored)
            return stored;
    });
    
    const user = token ? parseJwtUser(token) : null;

    useEffect(() => {
        MyApi.setSecurityData(token);
    }, [token]);
    
    async function login (request: LoginRequestDto){
        let response;
        try {
            response = await MyApi.api.authLogin(request);
        }catch (err: any) {
            if (err instanceof Response && err.status === 401){
                throw new Error('Invalid email or password.');
            }
            if (err?.status === 401) {
                throw new Error(err?.error?.message || 'Invalid email or password.');
            }
            throw new Error('Could not reach the server. Please, try again.')
        }
        
    const receivedToken = response.data.token;
        if(typeof receivedToken !== 'string' || !receivedToken) {
            throw new Error ('The server returned an invalid token.')
        }
        
    sessionStorage.setItem('token',receivedToken);
    MyApi.setSecurityData(receivedToken);
    setToken(receivedToken);
    }
    
function logout() {
        sessionStorage.removeItem('token');
        MyApi.setSecurityData(null);
        setToken(null);
    }
    return(
        <AuthContext.Provider value={{token, user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(){
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside an AuthProvider');
    }
    return context;
}