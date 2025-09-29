import axiosClient from "~/lib/http"
import type { GetUserProfileResponseType, UpdateUserProfileBodyType } from "~/validateSchema/profile.chema"

const API_GET_PROFILE_URL = '/profile'
const API_UPDATE_PROFILE_URL = '/profile'


export const profileApi = {
  getProfile: (): Promise<GetUserProfileResponseType> => axiosClient.get(API_GET_PROFILE_URL),
  updateProfile: (body: UpdateUserProfileBodyType): Promise<GetUserProfileResponseType> => axiosClient.put(API_UPDATE_PROFILE_URL, body)
}