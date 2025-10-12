import axiosClient from '~/lib/http'
import type {
  CreatePermissionBodyType,
  GetPermissionResType,
  UpdatePermissionBodyType,
  PermissionType
} from '~/validateSchema/permission.schema'

const API_GET_PERMISSION_URL = '/permission'
const API_CREATE_PERMISSION_URL = '/permission'
const API_UPDATE_PERMISSION_URL = '/permission'
const API_DELETE_PERMISSION_URL = '/permission'
const API_GET_PERMISSION_BY_ID_URL = '/permission'

export const permissionApi = {
  getPermission: (): Promise<GetPermissionResType> => axiosClient.get(API_GET_PERMISSION_URL),
  createPermission: (body: CreatePermissionBodyType): Promise<PermissionType> =>
    axiosClient.post(API_CREATE_PERMISSION_URL, body),
  updatePermission: (body: UpdatePermissionBodyType, permissionId: number): Promise<PermissionType> =>
    axiosClient.put(`${API_UPDATE_PERMISSION_URL}/${permissionId}`, body),
  deletePermission: (permissionId: number): Promise<void> =>
    axiosClient.delete(`${API_DELETE_PERMISSION_URL}/${permissionId}`),
  getPermissionById: (permissionId: number): Promise<PermissionType> =>
    axiosClient.get(`${API_GET_PERMISSION_BY_ID_URL}/${permissionId}`)
}
