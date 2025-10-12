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
import { CreatePermissionBodySchema, type CreatePermissionBodyType } from '~/validateSchema/permission.schema'
import { permissionApi } from '~/apiRequest/permission'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '~/store'
import { getPermission } from '~/features/permissionSlice'

export default function AddPermission() {
  const dispatch = useDispatch<AppDispatch>()
  const [open, setOpen] = useState(false)
  const form = useForm<CreatePermissionBodyType>({
    resolver: zodResolver(CreatePermissionBodySchema),
    defaultValues: {
      name: '',
      description: '',
      path: '',
      method: '',
      module: ''
    }
  })

  const onSubmit = async (values: CreatePermissionBodyType) => {
    try {
      await permissionApi.createPermission(values)
      toast.success('Tạo quyền thành công')
      setOpen(false)
      form.reset()
      dispatch(getPermission({ page: 1, limit: 10 })) // Refresh data
    } catch (error) {
      toast.error('Không thể tạo quyền')
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size='sm' className='h-7 gap-1'>
          <PlusCircle className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Tạo quyền</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Tạo quyền</DialogTitle>
          <DialogDescription>Vui lòng nhập đầy đủ thông tin quyền</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid auto-rows-max items-start gap-4 md:gap-8'
            id='add-permission-form'
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
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='description'>Mô tả</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='description' className='w-full' {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='path'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='path'>Đường dẫn</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='path' className='w-full' placeholder='/api/example' {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='method'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='method'>Phương thức</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder='Chọn phương thức' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='GET'>GET</SelectItem>
                            <SelectItem value='POST'>POST</SelectItem>
                            <SelectItem value='PUT'>PUT</SelectItem>
                            <SelectItem value='DELETE'>DELETE</SelectItem>
                            <SelectItem value='PATCH'>PATCH</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='module'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='module'>Module</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='module' className='w-full' placeholder='auth, user, product...' {...field} />
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
          <Button type='submit' form='add-permission-form'>
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
