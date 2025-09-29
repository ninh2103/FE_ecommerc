import axiosClient from "~/lib/http"
import type { UploadMediaBodyType } from "~/validateSchema/media.schema"

const API_UPLOAD_MEDIA_URL = '/upload/images'

export const mediaApi = {
  uploadMedia: (body: UploadMediaBodyType) => {
    const formData = new FormData()
    formData.append('files', body.file)
    console.log(formData)
    return axiosClient.post(API_UPLOAD_MEDIA_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}