import z from "zod"

export const UploadMediaBodySchema = z.object({
  file: z.instanceof(File, { message: 'File là bắt buộc' })
})

export type UploadMediaBodyType = z.TypeOf<typeof UploadMediaBodySchema>