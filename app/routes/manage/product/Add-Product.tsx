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
import { useMemo, useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { createProduct } from '~/features/productSlice'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '~/store'
import { handleErrorApi } from '~/lib/utils'
import { uploadMedia } from '~/features/mediaSlice'
import { useCallback } from 'react'
import { PlusCircle, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { getManagementProducts } from '~/features/productSlice'
import {
  CreateProductBodySchema,
  type CreateProductBodyType,
  VariantsSchema,
  generateSKUs
} from '~/validateSchema/product.schema'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { getBrand } from '~/features/brandSlice'
import { getCategory } from '~/features/categorySlice'

export default function AddProduct() {
  const dispatch = useDispatch<AppDispatch>()
  const brands = useSelector((s: RootState) => s.brand.data)
  const categories = useSelector((s: RootState) => s.category.data)
  const isCategoryLoading = useSelector((s: RootState) => s.category.isLoading)
  const isBrandLoading = useSelector((s: RootState) => s.brand.isLoading)
  const [open, setOpen] = useState(false)

  const form = useForm<CreateProductBodyType>({
    resolver: zodResolver(CreateProductBodySchema) as any,
    defaultValues: {
      name: '',
      publishAt: null,
      basePrice: 0,
      virtualPrice: 0,
      brandId: 0,
      images: [],
      variants: [],
      categories: [],
      skus: []
    }
  })

  useEffect(() => {
    if (!isBrandLoading && (!brands || brands.length === 0)) dispatch(getBrand()).catch(() => {})
    if (!isCategoryLoading && (!categories || categories.length === 0)) dispatch(getCategory()).catch(() => {})
  }, [dispatch, isBrandLoading, isCategoryLoading, brands, categories])

  const images = form.watch('images')
  const name = form.watch('name')

  const handleUploadImage = async (file: File) => {
    try {
      const result = await dispatch(uploadMedia({ file })).unwrap()
      const uploadedUrl = result?.data?.[0]?.url || result?.url || ''
      if (uploadedUrl) {
        form.setValue('images', [...(images || []), uploadedUrl], { shouldValidate: true, shouldDirty: true })
      }
    } catch (error) {
      handleErrorApi<any>({ error: error as any, setError: form.setError })
    }
  }

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant
  } = useFieldArray({
    control: form.control,
    name: 'variants'
  })

  const { fields: skuFields, replace: replaceSku } = useFieldArray({ control: form.control, name: 'skus' })

  const regenerateSkus = useCallback(async () => {
    const variants = form.getValues('variants')
    const validation = await VariantsSchema.safeParseAsync(variants)
    if (!validation.success) {
      toast.error('Variants không hợp lệ')
      return
    }
    const baseSkus = generateSKUs(variants)
    replaceSku(
      baseSkus.map((sku) => ({
        value: sku.value,
        price: form.getValues('basePrice') || sku.price,
        stock: sku.stock,
        image: images?.[0] || sku.image
      }))
    )
  }, [form, images, replaceSku])

  const handleSubmit = async () => {
    try {
      // Ensure SKUs in sync with variants before submit
      await regenerateSkus()
      const isValid = await form.trigger()
      if (!isValid) {
        toast.error('Vui lòng kiểm tra lại thông tin')
        return
      }
      const values = form.getValues()
      await dispatch(createProduct(values)).unwrap()
      toast.success('Tạo sản phẩm thành công')
      setOpen(false)
      form.reset()
      dispatch(getManagementProducts())
    } catch (error) {
      handleErrorApi<any>({ error: error as any, setError: form.setError })
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size='sm' className='h-7 gap-1'>
          <PlusCircle className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Tạo sản phẩm</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[800px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Tạo sản phẩm</DialogTitle>
          <DialogDescription>Điền thông tin sản phẩm</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className='grid auto-rows-max items-start gap-4 md:gap-8'
            id='add-product-form'
            onSubmit={(e) => e.preventDefault()}
          >
            <div className='grid gap-4 py-4'>
              {/* Images uploader */}
              <FormField
                control={form.control}
                name='images'
                render={() => (
                  <FormItem>
                    <div className='flex items-center gap-6 flex-wrap'>
                      {images?.map((img, idx) => (
                        <div key={idx} className='relative'>
                          <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
                            <AvatarImage src={img} />
                            <AvatarFallback className='rounded-none'>{name || 'IMG'}</AvatarFallback>
                          </Avatar>
                          <button
                            title='Xóa ảnh'
                            type='button'
                            className='absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1'
                            onClick={() => {
                              const next = [...(images || [])]
                              next.splice(idx, 1)
                              form.setValue('images', next, { shouldDirty: true, shouldValidate: true })
                            }}
                          >
                            <X className='h-3 w-3' />
                          </button>
                        </div>
                      ))}
                      <button
                        title='Tải lên ảnh'
                        className='flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed'
                        type='button'
                        onClick={() => {
                          const input = document.createElement('input')
                          input.type = 'file'
                          input.accept = 'image/*'
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0]
                            if (file) handleUploadImage(file)
                          }
                          input.click()
                        }}
                      >
                        <Upload className='h-4 w-4 text-muted-foreground' />
                        <span className='sr-only'>Tải lên</span>
                      </button>
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
                name='brandId'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='brandId'>Thương hiệu</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))}
                          value={String(field.value || '')}
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Chọn thương hiệu' />
                          </SelectTrigger>
                          <SelectContent>
                            {brands.map((b) => (
                              <SelectItem key={b.id} value={String(b.id)}>
                                {b.name}
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
                name='categories'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label>Danh mục</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <div className='grid grid-cols-2 gap-2'>
                          {categories.map((c) => {
                            const checked = (field.value || []).includes(c.id)
                            return (
                              <label key={c.id} className='flex items-center gap-2 text-sm'>
                                <input
                                  type='checkbox'
                                  checked={checked}
                                  onChange={(e) => {
                                    const current = new Set<number>(field.value || [])
                                    if (e.target.checked) current.add(c.id)
                                    else current.delete(c.id)
                                    field.onChange(Array.from(current))
                                  }}
                                />
                                {c.name}
                              </label>
                            )
                          })}
                        </div>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='basePrice'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='basePrice'>Giá gốc</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input
                          id='basePrice'
                          type='number'
                          className='w-full'
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='virtualPrice'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='virtualPrice'>Giá niêm yết</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input
                          id='virtualPrice'
                          type='number'
                          className='w-full'
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              {/* Variants */}
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <Label>Thuộc tính (Variants)</Label>
                  <Button
                    type='button'
                    variant='secondary'
                    size='sm'
                    onClick={() => appendVariant({ value: '', options: [] })}
                  >
                    Thêm thuộc tính
                  </Button>
                </div>
                <div className='space-y-4'>
                  {variantFields.map((vf, idx) => (
                    <div key={vf.id} className='border rounded p-3 space-y-2'>
                      <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                        <Label>Tên</Label>
                        <div className='col-span-3 w-full space-y-2'>
                          <FormField
                            control={form.control}
                            name={`variants.${idx}.value` as const}
                            render={({ field }) => <Input {...field} />}
                          />
                          <FormMessage />
                        </div>
                      </div>
                      <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                        <Label>Options (phân cách bởi dấu phẩy)</Label>
                        <div className='col-span-3 w-full space-y-2'>
                          <FormField
                            control={form.control}
                            name={`variants.${idx}.options` as const}
                            render={({ field }) => (
                              <Input
                                value={(field.value || []).join(',')}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      .split(',')
                                      .map((s) => s.trim())
                                      .filter(Boolean)
                                  )
                                }
                              />
                            )}
                          />
                          <FormMessage />
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Button type='button' variant='secondary' size='sm' onClick={regenerateSkus}>
                          Tạo SKUs
                        </Button>
                        <Button type='button' variant='destructive' size='sm' onClick={() => removeVariant(idx)}>
                          Xóa
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SKUs quick view */}
              <div className='space-y-2'>
                <Label>SKUs</Label>
                <div className='grid gap-2'>
                  {skuFields.map((sf, i) => (
                    <div key={sf.id} className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <span className='text-sm col-span-1'>{form.getValues(`skus.${i}.value`)}</span>
                      <div className='col-span-3 grid grid-cols-3 gap-2 w-full'>
                        <Input
                          type='number'
                          value={form.getValues(`skus.${i}.price`)}
                          onChange={(e) =>
                            form.setValue(`skus.${i}.price`, Number(e.target.value), { shouldDirty: true })
                          }
                        />
                        <Input
                          type='number'
                          value={form.getValues(`skus.${i}.stock`)}
                          onChange={(e) =>
                            form.setValue(`skus.${i}.stock`, Number(e.target.value), { shouldDirty: true })
                          }
                        />
                        <Input
                          placeholder='SKU image URL'
                          value={form.getValues(`skus.${i}.image`) || ''}
                          onChange={(e) => form.setValue(`skus.${i}.image`, e.target.value, { shouldDirty: true })}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type='button' form='add-product-form' onClick={handleSubmit} disabled={form.formState.isSubmitting}>
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
