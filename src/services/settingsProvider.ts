import type {Answer, UserDetails} from "@/services/core/dbtypes";
import axios from "axios";
import backend from "@/services/backend";

const baseUrl = "http://localhost:5000"
const apiUrl = baseUrl + '/api/v1'
const defaultUrl = '/src/assets/user.png';

async function useProfilePicture(image: File): Promise<Answer> {
    const result: Answer = {
        success: false,
        errorMessage: ""
    }
    const formData = new FormData();
    formData.set('image', image)
    await axios.put(apiUrl + "/user/image", formData, backend.generateHeader())
        .then(_ => {
            result.success = true
        }).catch(error => {
            result.errorMessage = error.response.data.error
        })
    return result
}


async function getProfilePictureUrl(): Promise<string> {
    let result = defaultUrl;
    await backend.getUserDetails().then(response => {
        if (response) {
            result = getProfilePictureUrlFrom(response)
        }
    })
    return result;
}

function getProfilePictureUrlFrom(user: UserDetails): string {
    if (user.profile_picture !== undefined) {
        return baseUrl + user.profile_picture
    }
    return defaultUrl;
}

export {baseUrl, defaultUrl, useProfilePicture, getProfilePictureUrl, getProfilePictureUrlFrom};