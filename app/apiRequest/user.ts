import axiosClient from "~/lib/http"

const API_GET_USER_URL = '/users/me'  

export const userApi = {
  getUser: () => axiosClient.get(API_GET_USER_URL),
}