import axiosClient from "~/lib/http"
import type { GetUserResType } from "~/validateSchema/account.schema"

const API_GET_USER_URL = '/user'  

export const userApi = {
  getUser: () => axiosClient.get<GetUserResType>(API_GET_USER_URL),
}