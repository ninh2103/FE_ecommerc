import axiosClient from "~/lib/http"
import type { ChangePasswordBodyType } from "~/validateSchema/auth.schema"
import type { MessageResponseType } from "~/validateSchema/message.schema"
import type { GetUserProfileResponseType, UpdateUserProfileBodyType } from "~/validateSchema/profile.chema"

const API_GET_PROFILE_URL = '/profile'
const API_UPDATE_PROFILE_URL = '/profile'
const API_CHANGE_PASSWORD_URL = '/profile/change-password'



export const profileApi = {
  getProfile: (): Promise<GetUserProfileResponseType> => axiosClient.get(API_GET_PROFILE_URL),
  updateProfile: (body: UpdateUserProfileBodyType): Promise<GetUserProfileResponseType> => axiosClient.put(API_UPDATE_PROFILE_URL, body),
  changePassword: (body: ChangePasswordBodyType):Promise<MessageResponseType> => axiosClient.put(API_CHANGE_PASSWORD_URL, body),

}