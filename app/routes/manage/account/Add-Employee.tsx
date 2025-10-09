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
import { CreateUserBodySchema, type CreateUserBodyType } from '~/validateSchema/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle, Upload } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { createUser } from '~/features/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '~/store'
import { handleErrorApi } from '~/lib/utils'
import { uploadMedia } from '~/features/mediaSlice'
import { getRole } from '~/features/roleSlice'
import { useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'
import { toast } from 'sonner'
import { getUser } from '~/features/userSlice'

export default function AddEmployee() {
  const dispatch = useDispatch<AppDispatch>()
  const roles = useSelector((s: RootState) => s.role.roles)
  const isRoleLoading = useSelector((s: RootState) => s.role.isLoading)
  const [file, setFile] = useState<File | null>(null)
  const [open, setOpen] = useState(false)
  const form = useForm<CreateUserBodyType>({
    resolver: zodResolver(CreateUserBodySchema),
    defaultValues: {
      name: '',
      email: '',
      avatar: null, // Schema expects string | null, not undefined
      password: '',
      roleId: 1, // Default to valid role ID instead of 0
      status: 'ACTIVE',
      phoneNumber: ''
    }
  })

  useEffect(() => {
    // Chỉ fetch role khi chưa có dữ liệu và không trong trạng thái loading
    if (!isRoleLoading && (!roles || roles.length === 0)) {
      dispatch(getRole())
        .unwrap()
        .catch(() => {})
    }
  }, [dispatch, isRoleLoading, roles])

  const avatar = form.watch('avatar')
  const name = form.watch('name')
  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return avatar
  }, [file, avatar])

  const handleUploadAvatar = async (file: File) => {
    try {
      const result = await dispatch(uploadMedia({ file })).unwrap()
      const uploadedUrl = result?.data?.[0]?.url || result?.url || ''
      if (uploadedUrl) {
        form.setValue('avatar', uploadedUrl, { shouldValidate: true, shouldDirty: true })
      }
    } catch (error) {
      handleErrorApi<any>({
        error: error as any,
        setError: form.setError
      })
    }
  }

  const handleCreateUser = async () => {
    try {
      const isValid = await form.trigger()
      if (!isValid) {
        toast.error('Vui lòng kiểm tra lại thông tin nhập vào', {
          duration: 5000
        })
        return
      }

      const formData = form.getValues()

      await dispatch(createUser(formData)).unwrap()
      setOpen(false) // Chỉ đóng khi thành công
      toast.success('Tạo tài khoản thành công', {
        duration: 3000
      })
      form.reset()
      // Delay refresh user list (silent) để toast hiển thị đủ lâu, không chớp UI
      setTimeout(() => {
        dispatch(getUser({ silent: true }))
      }, 1500)
    } catch (error: any) {
      handleErrorApi<any>({
        error: error as any,
        setError: form.setError
      })
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size='sm' className='h-7 gap-1'>
          <PlusCircle className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Tạo tài khoản</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Tạo tài khoản</DialogTitle>
          <DialogDescription>Các trường tên, email, mật khẩu là bắt buộc</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className='grid auto-rows-max items-start gap-4 md:gap-8'
            id='add-employee-form'
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <div className='grid gap-4 py-4'>
              <FormField
                control={form.control}
                name='avatar'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center gap-6'>
                      <div className='flex gap-2 items-start justify-start'>
                        <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
                          <AvatarImage src={previewAvatarFromFile || ''} />
                          <AvatarFallback className='rounded-none'>{name || 'Avatar'}</AvatarFallback>
                        </Avatar>
                        <Input
                          type='file'
                          accept='image/*'
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleUploadAvatar(file)
                            }
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
                              if (file) {
                                handleUploadAvatar(file)
                              }
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
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='email'>Email</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='email' className='w-full' {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='password'>Mật khẩu</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='password' className='w-full' type='password' {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='roleId'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='roleId'>Vai trò</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value.toString()}>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Chọn vai trò' />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.id.toString()}>
                                {role.name}
                              </SelectItem>
                            ))}
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
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='status'>Trạng thái</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Chọn trạng thái' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='ACTIVE'>Hoạt động</SelectItem>
                            <SelectItem value='INACTIVE'>Không hoạt động</SelectItem>
                            <SelectItem value='BLOCKED'>Bị chặn</SelectItem>
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
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='phoneNumber'>Số điện thoại</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='phoneNumber' className='w-full' placeholder='Nhập tối thiểu 10 số' {...field} />
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
          <Button
            type='button'
            form='add-employee-form'
            onClick={handleCreateUser}
            disabled={form.formState.isSubmitting}
          >
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
