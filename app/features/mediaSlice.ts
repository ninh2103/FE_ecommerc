import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { mediaApi } from "~/apiRequest/media"
import type { UploadMediaBodyType } from "~/validateSchema/media.schema"



const initialState = {
  url: '',
}

export const uploadMedia = createAsyncThunk<any, UploadMediaBodyType>('media/uploadMedia', async (body) => {
  const response = await mediaApi.uploadMedia(body)
  return response
})

export const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setMedia: (state, action: PayloadAction<{ url: string }>) => {
      state.url = action.payload.url
    }
  },
  extraReducers: (builder) => {
    builder.addCase(uploadMedia.fulfilled, (state, action) => {
      const payload = action.payload as any
      state.url = payload?.data?.[0]?.url || payload?.url || ''
    })
    builder.addCase(uploadMedia.rejected, (state) => {
      state.url = ''
    })
    builder.addCase(uploadMedia.pending, (state) => {
      state.url = ''
    })
  }
})

export const { setMedia } = mediaSlice.actions

export default mediaSlice.reducer