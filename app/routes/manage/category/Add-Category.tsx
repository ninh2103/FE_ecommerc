import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { CreateCategoryBodySchema, type CreateCategoryBodyType } from '~/validateSchema/category.schema'
import { createCategory } from '~/features/categorySlice'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '~/store'

export default function AddCategory() {
  const dispatch = useDispatch<AppDispatch>()
  const [open, setOpen] = useState(false)
  const form = useForm<CreateCategoryBodyType>({
    resolver: zodResolver(CreateCategoryBodySchema),
    defaultValues: {
      name: '',
      logo: '',
      parentCategoryId: null
    }
  })

  const onSubmit = async (values: CreateCategoryBodyType) => {
    try {
      await dispatch(createCategory(values))
      toast.success('Tạo danh mục thành công')
      setOpen(false)
      form.reset()
    } catch (error) {
      toast.error('Không thể tạo danh mục')
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size='sm' className='h-7 gap-1'>
          <PlusCircle className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Tạo danh mục</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Tạo danh mục</DialogTitle>
          <DialogDescription>Vui lòng nhập tên, logo và danh mục cha</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid auto-rows-max items-start gap-4 md:gap-8'
            id='add-category-form'
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
          <Button type='submit' form='add-category-form'>
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
