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
import { useEffect, useCallback } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '~/store'
import { handleErrorApi } from '~/lib/utils'
import { uploadMedia } from '~/features/mediaSlice'
import { Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { getBrand } from '~/features/brandSlice'
import { getCategory } from '~/features/categorySlice'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { getManagementProductById, getProductById, updateProduct } from '~/features/productSlice'
import {
  UpdateProductBodySchema,
  type UpdateProductBodyType,
  VariantsSchema,
  generateSKUs
} from '~/validateSchema/product.schema'

export default function EditProduct({
  id,
  setId
}: {
  id?: number | undefined
  setId: (value: number | undefined) => void
}) {
  const dispatch = useDispatch<AppDispatch>()
  const brands = useSelector((s: RootState) => s.brand.data)
  const categories = useSelector((s: RootState) => s.category.data)
  const isCategoryLoading = useSelector((s: RootState) => s.category.isLoading)
  const isBrandLoading = useSelector((s: RootState) => s.brand.isLoading)

  const form = useForm<UpdateProductBodyType>({
    resolver: zodResolver(UpdateProductBodySchema) as any,
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

  const images = form.watch('images')

  useEffect(() => {
    if (!id) return
    ;(async () => {
      try {
        const data = await dispatch(getProductById(id)).unwrap()
        form.reset({
          name: data.name ?? '',
          publishAt: data.publishAt ? new Date(data.publishAt) : null,
          basePrice: data.basePrice,
          virtualPrice: data.virtualPrice,
          brandId: data.brandId,
          images: data.images || [],
          variants: data.variants || [],
          categories: data.categories?.map((c: any) => c.id) || [],
          skus: data.skus?.map((s) => ({ value: s.value, price: s.price, stock: s.stock, image: s.image })) || []
        })
      } catch (error) {
        toast.error('Không tải được thông tin sản phẩm')
        setId(undefined)
      }
    })()
  }, [dispatch, form, id, setId])

  useEffect(() => {
    if (!isBrandLoading && (!brands || brands.length === 0)) dispatch(getBrand()).catch(() => {})
    if (!isCategoryLoading && (!categories || categories.length === 0)) dispatch(getCategory()).catch(() => {})
  }, [dispatch, isBrandLoading, isCategoryLoading, brands, categories])

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant
  } = useFieldArray({
    control: form.control,
    name: 'variants'
  })
  const { fields: skuFields } = useFieldArray({ control: form.control, name: 'skus' })

  const regenerateSkusPreserving = useCallback(async () => {
    const variants = form.getValues('variants')
    const validation = await VariantsSchema.safeParseAsync(variants)
    if (!validation.success) {
      toast.error('Variants không hợp lệ')
      return
    }
    const oldSkus = form.getValues('skus')
    const next = generateSKUs(variants).map((sku) => {
      const found = oldSkus.find((s) => s.value === sku.value)
      return {
        value: sku.value,
        price: found?.price ?? sku.price,
        stock: found?.stock ?? sku.stock,
        image: found?.image ?? sku.image
      }
    })
    form.setValue('skus', next, { shouldDirty: true, shouldValidate: true })
  }, [form])

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

  const handleSubmit = async () => {
    try {
      const isValid = await form.trigger()
      if (!isValid || !id) return
      const values = form.getValues()
      await dispatch(updateProduct({ body: values, productId: id })).unwrap()
      toast.success('Cập nhật sản phẩm thành công')
      setId(undefined)
    } catch (error) {
      handleErrorApi<any>({ error: error as any, setError: form.setError })
    }
  }

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) setId(undefined)
      }}
    >
      <DialogContent className='sm:max-w-[800px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Cập nhật sản phẩm</DialogTitle>
          <DialogDescription>Chỉnh sửa thông tin sản phẩm</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className='grid auto-rows-max items-start gap-4 md:gap-8'
            id='edit-product-form'
            onSubmit={(e) => e.preventDefault()}
          >
            <div className='grid gap-4 py-4'>
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
                            <AvatarFallback className='rounded-none'>IMG</AvatarFallback>
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

              {/* Variants simple edit */}
              <div className='space-y-2'>
                <Label>Thuộc tính (Variants)</Label>
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
                        <Button type='button' variant='secondary' size='sm' onClick={regenerateSkusPreserving}>
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
          <Button type='button' form='edit-product-form' onClick={handleSubmit}>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
