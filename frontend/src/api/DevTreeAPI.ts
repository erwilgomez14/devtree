import { isAxiosError } from "axios";
import api from "../config/axios";
import { ProfileForm, User } from "../types";

export async function getUser() {
  try {
    const response = await api<User>("/user");
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
      // console.log(error.response.data.error);
    }
  }
}

export async function updateProfile(formData: ProfileForm) {
  try {
    const { data } = await api.patch<string>("/user", formData);
    // console.log(data);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
      // console.log(error.response.data.error);
    }
  }
}

export async function uploadImage(file : File) {
  let formData = new FormData()
  formData.append('file', file)
  // console.log(formData)

  try {

    // const { data : {image} } : { data : {image: string}} = await api.post('/user/image', formData)
    // console.log(image)
    const response = await api.post('/user/image', formData);
// console.log(response.data); 
    return response.data

  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
