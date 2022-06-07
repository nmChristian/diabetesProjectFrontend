import axios from "axios";

const key = "authentication";

async function signUp(email: string, firstName: string, lastName: string, birthDate: string, password: string, passwordRepeat: string): Promise<boolean> {
    try {
        await axios.post("http://localhost:5000/api/v1/user", {
            email: email,
            first_name: firstName,
            last_name: lastName,
            birthdate: birthDate,
            password: password,
            password_check: passwordRepeat
        });

        return true;
    } catch (e) {
        return false;
    }
}

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

export {signUp, signIn, isAuthenticated, getApiKey}