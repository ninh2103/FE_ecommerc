import axiosClient from '~/lib/http'
import type {
  CategoryTranslationType,
  UpdateCategoryTranslationBodyType
} from '~/validateSchema/category-translation.schema'

import type { CreateCategoryTranslationBodyType } from '~/validateSchema/category-translation.schema'

const API_CREATE_CATEGORY_TRANSLATION_URL = '/category-translation'
const API_UPDATE_CATEGORY_TRANSLATION_URL = '/category-translation'
const API_DELETE_CATEGORY_TRANSLATION_URL = '/category-translation'
const API_GET_CATEGORY_TRANSLATION_BY_ID_URL = '/category-translation'

export const categoryTranslationApi = {
  createCategoryTranslation: (body: CreateCategoryTranslationBodyType): Promise<CategoryTranslationType> =>
    axiosClient.post(API_CREATE_CATEGORY_TRANSLATION_URL, body),
  updateCategoryTranslation: (
    body: UpdateCategoryTranslationBodyType,
    categoryTranslationId: number
  ): Promise<CategoryTranslationType> =>
    axiosClient.put(`${API_UPDATE_CATEGORY_TRANSLATION_URL}/${categoryTranslationId}`, body),
  deleteCategoryTranslation: (categoryTranslationId: number): Promise<void> =>
    axiosClient.delete(`${API_DELETE_CATEGORY_TRANSLATION_URL}/${categoryTranslationId}`),
  getCategoryTranslationById: (categoryTranslationId: number): Promise<CategoryTranslationType> =>
    axiosClient.get(`${API_GET_CATEGORY_TRANSLATION_BY_ID_URL}/${categoryTranslationId}`)
}
