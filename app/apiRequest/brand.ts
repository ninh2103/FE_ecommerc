import axiosClient from '~/lib/http'
import type {
  CreateBrandBodyType,
  GetBrandDetailResType,
  GetBrandResType,
  UpdateBrandBodyType
} from '~/validateSchema/brand.schema'

const API_CREATE_BRAND_URL = '/brand'
const API_UPDATE_BRAND_URL = '/brand'
const API_DELETE_BRAND_URL = '/brand'
const API_GET_BRAND_BY_ID_URL = '/brand'
const API_GET_ALL_BRANDS_URL = '/brand'

export const brandApi = {
  createBrand: (body: CreateBrandBodyType): Promise<GetBrandDetailResType> =>
    axiosClient.post(API_CREATE_BRAND_URL, body),
  updateBrand: (body: UpdateBrandBodyType, brandId: number): Promise<GetBrandDetailResType> =>
    axiosClient.put(`${API_UPDATE_BRAND_URL}/${brandId}`, body),
  deleteBrand: (brandId: number) => axiosClient.delete(`${API_DELETE_BRAND_URL}/${brandId}`),
  getBrandById: (brandId: number): Promise<GetBrandDetailResType> =>
    axiosClient.get(`${API_GET_BRAND_BY_ID_URL}/${brandId}`),
  getBrands: (): Promise<GetBrandResType> => axiosClient.get(API_GET_ALL_BRANDS_URL)
}
