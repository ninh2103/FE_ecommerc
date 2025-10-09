import axiosClient from '~/lib/http'
import type { CreateUserBodyType, GetUserResType, UpdateUserBodyType, UserType } from '~/validateSchema/account.schema'

const API_GET_USER_URL = '/user'
const API_CREATE_USER_URL = '/user'
const API_UPDATE_USER_URL = '/user'
const API_DELETE_USER_URL = '/user'

export const userApi = {
  getUser: (): Promise<GetUserResType> => axiosClient.get(API_GET_USER_URL),
  createUser: (body: CreateUserBodyType) => axiosClient.post<UserType>(API_CREATE_USER_URL, body),
  updateUser: (body: UpdateUserBodyType) => axiosClient.put<UserType>(API_UPDATE_USER_URL, body),
  deleteUser: (id: number) => axiosClient.delete<UserType>(`${API_DELETE_USER_URL}/${id}`)
}
