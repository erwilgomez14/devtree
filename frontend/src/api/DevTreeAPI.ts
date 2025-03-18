import { isAxiosError } from "axios";
import api from "../config/axios";

export async function getUser() {
  
  try {

    const response = await api.get("/user");
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
      // console.log(error.response.data.error);
    }
  }
}
