import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { UpdateBrandBodySchema, type UpdateBrandBodyType } from '~/validateSchema/brand.schema'
import { brandApi } from '~/apiRequest/brand'
import { toast } from 'sonner'
import { updateBrand } from '~/features/brandSlice'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '~/store'
import { uploadMedia } from '~/features/mediaSlice'
import { handleErrorApi } from '~/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Upload } from 'lucide-react'

export default function EditBrand({
  id,
  setId,
  onSubmitSuccess
}: {
  id?: number | undefined
  setId: (value: number | undefined) => void
  onSubmitSuccess?: () => void
}) {
  const form = useForm<UpdateBrandBodyType>({
    resolver: zodResolver(UpdateBrandBodySchema) as any,
    defaultValues: {
      name: '',
      logo: ''
    }
  })
  const dispatch = useDispatch<AppDispatch>()

  const [file, setFile] = useState<File | null>(null)
  const onSubmit = async (values: UpdateBrandBodyType) => {
    if (!id) return
    try {
      await dispatch(updateBrand({ body: values, BrandId: id }))
      toast.success('Cập nhật thương hiệu thành công')
      form.reset()
      onSubmitSuccess?.()
      setId(undefined)
    } catch (error) {
      toast.error('Không thể cập nhật thương hiệu')
    }
  }

  useEffect(() => {
    const run = async () => {
      if (!id) return
      try {
        const brand = await brandApi.getBrandById(id)
        form.reset({
          name: brand.name ?? '',
          logo: brand.logo ?? ''
        })
      } catch (error) {
        toast.error('Không thể tải thông tin thương hiệu')
      }
    }
    run()
  }, [id, form])

  const logo = form.watch('logo')

  const previewLogoFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return logo
  }, [file, logo])

  const handleUploadLogo = async (file: File) => {
    try {
      const result = await dispatch(uploadMedia({ file })).unwrap()
      const uploadedUrl = result?.data?.[0]?.url || result?.url || ''
      if (uploadedUrl) {
        form.setValue('logo', uploadedUrl, { shouldValidate: true, shouldDirty: true })
      }
    } catch (error) {
      handleErrorApi<any>({
        error: error as any,
        setError: form.setError
      })
    }
  }

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          setId(undefined)
        }
      }}
    >
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Cập nhật thương hiệu</DialogTitle>
          <DialogDescription>Chỉnh sửa tên và logo</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid auto-rows-max items-start gap-4 md:gap-8'
            id='edit-brand-form'
          >
            <div className='grid gap-4 py-4'>
              <FormField
                control={form.control}
                name='logo'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center gap-6'>
                      <div className='flex gap-2 items-start justify-start'>
                        <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
                          <AvatarImage src={previewLogoFromFile ?? undefined} />
                          {!(
                            previewLogoFromFile &&
                            (previewLogoFromFile.startsWith('http') || previewLogoFromFile.startsWith('/'))
                          ) ? (
                            <AvatarFallback className='rounded-none'>Logo</AvatarFallback>
                          ) : null}
                        </Avatar>
                        <Input
                          type='file'
                          accept='image/*'
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleUploadLogo(file)
                          }}
                          className='hidden'
                        />
                        <button
                          className='flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed'
                          type='button'
                          onClick={() => {
                            const input = document.createElement('input')
                            input.type = 'file'
                            input.accept = 'image/*'
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0]
                              if (file) handleUploadLogo(file)
                            }
                            input.click()
                          }}
                        >
                          <Upload className='h-4 w-4 text-muted-foreground' />
                          <span className='sr-only'>Tải lên</span>
                        </button>
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='name'>Tên</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='name' className='w-full' {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='edit-brand-form'>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
