import axiosClient from '~/lib/http'
import type { GetCategoryTranslationResType } from '~/validateSchema/category-translation.schema'
import type {
  CategoryType,
  CategoryIncludeTranslationType,
  CreateCategoryBodyType,
  GetAllCategoriesResType,
  UpdateCategoryBodyType
} from '~/validateSchema/category.schema'

const API_GET_CATEGORY_URL = '/category'
const API_CREATE_CATEGORY_URL = '/category'
const API_UPDATE_CATEGORY_URL = '/category'
const API_DELETE_CATEGORY_URL = '/category'
const API_GET_CATEGORY_BY_ID_URL = '/category'

export const categoryApi = {
  getCategory: (): Promise<GetAllCategoriesResType> => axiosClient.get(API_GET_CATEGORY_URL),
  createCategory: (body: CreateCategoryBodyType): Promise<CategoryIncludeTranslationType> =>
    axiosClient.post(API_CREATE_CATEGORY_URL, body),
  updateCategory: (body: UpdateCategoryBodyType, categoryId: number): Promise<CategoryIncludeTranslationType> =>
    axiosClient.put(`${API_UPDATE_CATEGORY_URL}/${categoryId}`, body),
  deleteCategory: (categoryId: number): Promise<void> => axiosClient.delete(`${API_DELETE_CATEGORY_URL}/${categoryId}`),
  getCategoryById: (categoryId: number): Promise<CategoryIncludeTranslationType> =>
    axiosClient.get(`${API_GET_CATEGORY_BY_ID_URL}/${categoryId}`)
}
