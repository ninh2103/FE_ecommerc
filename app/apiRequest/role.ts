import axiosClient from '~/lib/http'
import type { CreateRoleBodyType, GetRoleResType, UpdateRoleBodyType, RoleType } from '~/validateSchema/role.schema'

const API_GET_ROLE_URL = '/role'
const API_CREATE_ROLE_URL = '/role'
const API_UPDATE_ROLE_URL = '/role'
const API_DELETE_ROLE_URL = '/role'
const API_GET_ROLE_BY_ID_URL = '/role'

export const roleApi = {
  getRole: (): Promise<GetRoleResType> => axiosClient.get(API_GET_ROLE_URL),
  createRole: (body: CreateRoleBodyType): Promise<RoleType> => axiosClient.post(API_CREATE_ROLE_URL, body),
  updateRole: (body: UpdateRoleBodyType, roleId: number): Promise<RoleType> =>
    axiosClient.put(`${API_UPDATE_ROLE_URL}/${roleId}`, body),
  deleteRole: (roleId: number): Promise<void> => axiosClient.delete(`${API_DELETE_ROLE_URL}/${roleId}`),
  getRoleById: (roleId: number): Promise<RoleType> => axiosClient.get(`${API_GET_ROLE_BY_ID_URL}/${roleId}`)
}
