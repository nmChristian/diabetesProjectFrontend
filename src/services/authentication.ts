import axios from "axios";

const key = "authentication";

async function signIn(email: string, password: string): Promise<boolean> {
    try {
        const response = await axios.post("http://localhost:5000/api/v1/user/login", {
            email: email,
            password: password
        });
        sessionStorage.setItem(key, response.data.api_key);
        return true;
    } catch (e) {
        return false;
    }
}

function isAuthenticated(): boolean {
    const res = sessionStorage.getItem(key);
    return !!res;
}

function getApiKey(): string | null {
    return sessionStorage.getItem(key);
}

export {signIn, isAuthenticated, getApiKey}