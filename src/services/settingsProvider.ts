import type {Answer} from "@/services/core/dbtypes";
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
        .then(response => {
            result.success = true
        }).catch(error => {
            result.errorMessage = error.response.data.error
        })
    return result
}


async function getProfilePictureUrl(): Promise<string> {
    let result = defaultUrl;
    await backend.getUserDetails().then(response => {
        result = baseUrl + response.profile_picture
    })
    return result;
}

export {defaultUrl, useProfilePicture, getProfilePictureUrl}