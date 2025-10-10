'use client'
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
import { Switch } from '~/components/ui/switch'
import { UpdateRoleBodySchema, type UpdateRoleBodyType } from '~/validateSchema/role.schema'
import { roleApi } from '~/apiRequest/role'
import { toast } from 'sonner'
import { updateRole } from '~/features/roleSlice'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '~/store'

export default function EditRole({
  id,
  setId,
  onSubmitSuccess
}: {
  id?: number | undefined
  setId: (value: number | undefined) => void
  onSubmitSuccess?: () => void
}) {
  const form = useForm<UpdateRoleBodyType>({
    resolver: zodResolver(UpdateRoleBodySchema) as any,
    defaultValues: {
      name: '',
      description: '',
      isActive: true,
      permissionsIds: []
    }
  })
  const dispatch = useDispatch<AppDispatch>()

  const onSubmit = async (values: UpdateRoleBodyType) => {
    if (!id) return
    try {
      await dispatch(updateRole({ body: values, roleId: id }))
      toast.success('Cập nhật vai trò thành công')
      form.reset()
      onSubmitSuccess?.()
      setId(undefined)
    } catch (error) {
      toast.error('Không thể cập nhật vai trò')
    }
  }

  useEffect(() => {
    const run = async () => {
      if (!id) return
      try {
        const role = await roleApi.getRoleById(id)
        form.reset({
          name: role.name ?? '',
          description: role.description ?? '',
          isActive: Boolean(role.isActive),
          permissionsIds: []
        })
      } catch (error) {
        toast.error('Không thể tải thông tin vai trò')
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
          <DialogTitle>Cập nhật vai trò</DialogTitle>
          <DialogDescription>Chỉnh sửa tên, mô tả và trạng thái</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid auto-rows-max items-start gap-4 md:gap-8'
            id='edit-role-form'
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
                name='isActive'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='isActive'>Kích hoạt</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
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
          <Button type='submit' form='edit-role-form'>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
