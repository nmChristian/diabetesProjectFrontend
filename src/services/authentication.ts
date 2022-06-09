import axios from "axios";

const key = "authentication"
const baseUrl = "http://localhost:5000/api/v1"

async function signUp(email: string, firstName: string, lastName: string, birthDate: string, password: string, passwordRepeat: string): Promise<boolean> {
    try {
        await axios.post(baseUrl + "/v1/user", {
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

async function signIn(email: string, password: string): Promise<{ success: boolean; error: string }> {
    let result = {
        success: false,
        error: ""
    }
    await axios.post(baseUrl + "/user/login", {
        email: email,
        password: password
    }).then(response => {
        sessionStorage.setItem(key, response.data.api_key);
        result.success = true
    }).catch(error => {
        result.error = error.response.data.error
    })
    return result;
}

function isAuthenticated(): boolean {
    const res = sessionStorage.getItem(key);
    return !!res;
}

function getApiKey(): string | null {
    return sessionStorage.getItem(key);
}

export {signUp, signIn, isAuthenticated, getApiKey}