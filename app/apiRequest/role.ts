import axiosClient from "~/lib/http"
import type { GetRoleResType } from "~/validateSchema/role.schema"

const API_GET_ROLE_URL = '/role'

export const roleApi = {
  getRole: (): Promise<GetRoleResType> => axiosClient.get(API_GET_ROLE_URL),
}