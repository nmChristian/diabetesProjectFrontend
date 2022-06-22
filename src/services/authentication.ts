/* Author: Niels Torp Grønskov, s204510 */
/* Description: Provides the login session for users */

import axios from "axios";
import type {Answer} from "@/services/db-types";

const key = "authentication"
const baseUrl = "http://localhost:5000/api/v1"

async function signUp(email: string, firstName: string, lastName: string, birthDate: string, password: string, passwordRepeat: string): Promise<Answer> {
    let result: Answer = {
        success: false,
        errorMessage: ""
    }
    await axios.post(baseUrl + "/user", {
        email: email,
        first_name: firstName,
        last_name: lastName,
        birthdate: birthDate,
        password: password,
        password_check: passwordRepeat
    }).then(response => {
        result.success = true
    }).catch(error => {
        result.errorMessage = error.response.data.error
    })
    return result;
}

async function signIn(email: string, password: string): Promise<Answer> {
    let result: Answer = {
        success: false,
        errorMessage: ""
    }
    await axios.post(baseUrl + "/user/login", {
        email: email,
        password: password
    }).then(response => {
        sessionStorage.setItem(key, response.data.api_key);
        result.success = true
    }).catch(error => {
        result.errorMessage = error.response.data.error
    })
    return result;
}

function getApiKey(): string | null {
    return sessionStorage.getItem(key);
}

function isAuthenticated(): boolean {
    return !!getApiKey();
}

function clearApiKey() {
    sessionStorage.removeItem(key)
}

export {signUp, signIn, isAuthenticated, getApiKey, clearApiKey}