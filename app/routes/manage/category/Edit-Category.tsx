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
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { UpdateCategoryBodySchema, type UpdateCategoryBodyType } from '~/validateSchema/category.schema'
import { categoryApi } from '~/apiRequest/category'
import { toast } from 'sonner'
import { updateCategory } from '~/features/categorySlice'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '~/store'

export default function EditCategory({
  id,
  setId,
  onSubmitSuccess
}: {
  id?: number | undefined
  setId: (value: number | undefined) => void
  onSubmitSuccess?: () => void
}) {
  const form = useForm<UpdateCategoryBodyType>({
    resolver: zodResolver(UpdateCategoryBodySchema) as any,
    defaultValues: {
      name: '',
      logo: '',
      parentCategoryId: null
    }
  })
  const dispatch = useDispatch<AppDispatch>()

  const onSubmit = async (values: UpdateCategoryBodyType) => {
    if (!id) return
    try {
      await dispatch(updateCategory({ body: values, CategoryId: id }))
      toast.success('Cập nhật danh mục thành công')
      form.reset()
      onSubmitSuccess?.()
      setId(undefined)
    } catch (error) {
      toast.error('Không thể cập nhật danh mục')
    }
  }

  useEffect(() => {
    const run = async () => {
      if (!id) return
      try {
        const category = await categoryApi.getCategoryById(id)
        form.reset({
          name: category.name ?? '',
          logo: category.logo ?? '',
          parentCategoryId: category.parentCategoryId
        })
      } catch (error) {
        toast.error('Không thể tải thông tin danh mục')
      }
    }
    run()
  }, [id, form])

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
          <DialogTitle>Cập nhật danh mục</DialogTitle>
          <DialogDescription>Chỉnh sửa tên, logo và danh mục cha</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid auto-rows-max items-start gap-4 md:gap-8'
            id='edit-category-form'
          >
            <div className='grid gap-4 py-4'>
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
              <FormField
                control={form.control}
                name='logo'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='logo'>Logo</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input
                          id='logo'
                          className='w-full'
                          value={field.value ?? ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='parentCategoryId'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='parentCategoryId'>Danh mục cha (ID)</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input
                          id='parentCategoryId'
                          className='w-full'
                          value={field.value ?? ''}
                          onChange={(e) => {
                            const value = e.target.value
                            field.onChange(value === '' ? null : Number(value))
                          }}
                        />
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
          <Button type='submit' form='edit-category-form'>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
