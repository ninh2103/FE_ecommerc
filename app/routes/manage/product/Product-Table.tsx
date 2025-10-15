import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import { Button } from '~/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '~/components/ui/alert-dialog'
import { Input } from '~/components/ui/input'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '~/store'
import { deleteProduct, getManagementProducts, getProducts } from '~/features/productSlice'
import { toast } from 'sonner'
import type { ProductType } from '~/validateSchema/product.schema'
import AutoPagination from '~/components/auto-pagination'
import AddProduct from '~/routes/manage/product/Add-Product'
import EditProduct from '~/routes/manage/product/Edit-Product'

type ProductItem = ProductType

const ProductTableContext = createContext<{
  setProductIdEdit: (value: number) => void
  productIdEdit: number | undefined
  productDelete: ProductItem | null
  setProductDelete: (value: ProductItem | null) => void
}>({
  setProductIdEdit: () => {},
  productIdEdit: undefined,
  productDelete: null,
  setProductDelete: () => {}
})

export const columns: ColumnDef<ProductItem>[] = [
  { accessorKey: 'id', header: 'ID' },
  {
    accessorKey: 'images',
    header: 'Ảnh',
    cell: ({ row }) => {
      const images = (row.getValue('images') as string[]) || []
      const firstImage = images[0]
      const safeSrc =
        firstImage && (firstImage.startsWith('http') || firstImage.startsWith('/')) ? firstImage : undefined
      return (
        <div>
          <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
            <AvatarImage src={safeSrc} />
            <AvatarFallback className='rounded-none'>{row.original.name}</AvatarFallback>
          </Avatar>
        </div>
      )
    }
  },
  { accessorKey: 'name', header: 'Tên', cell: ({ row }) => <div className='capitalize'>{row.getValue('name')}</div> },
  {
    accessorKey: 'basePrice',
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Giá gốc
        <CaretSortIcon className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => <div>{Number(row.getValue('basePrice')).toLocaleString('vi-VN')}</div>
  },
  {
    accessorKey: 'virtualPrice',
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Giá niêm yết
        <CaretSortIcon className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => <div>{Number(row.getValue('virtualPrice')).toLocaleString('vi-VN')}</div>
  },
  { accessorKey: 'brandId', header: 'Thương hiệu' },
  {
    accessorKey: 'publishAt',
    header: 'Ngày phát hành',
    cell: ({ row }) => {
      const val = row.getValue('publishAt') as string | null
      if (!val) return <span>-</span>
      const date = new Date(val)
      return <span>{isNaN(date.getTime()) ? '-' : date.toLocaleString('vi-VN')}</span>
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setProductIdEdit, setProductDelete } = useContext(ProductTableContext)
      const openEdit = () => setProductIdEdit(row.original.id)
      const openDelete = () => setProductDelete(row.original as unknown as ProductItem)
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <DotsHorizontalIcon className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openEdit}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDelete}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

function AlertDialogDeleteProduct({
  productDelete,
  setProductDelete
}: {
  productDelete: ProductItem | null
  setProductDelete: (value: ProductItem | null) => void
}) {
  const dispatch = useDispatch<AppDispatch>()

  const handleConfirmDelete = async () => {
    if (!productDelete?.id) return
    try {
      await dispatch(deleteProduct(productDelete.id)).unwrap()
      toast.success('Xóa sản phẩm thành công')
      setProductDelete(null)
      dispatch(getManagementProducts())
    } catch (_) {
      toast.error('Xóa sản phẩm thất bại')
    }
  }

  return (
    <AlertDialog
      open={Boolean(productDelete)}
      onOpenChange={(value) => {
        if (!value) setProductDelete(null)
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa sản phẩm?</AlertDialogTitle>
          <AlertDialogDescription>
            Sản phẩm <span className='bg-foreground text-primary-foreground rounded px-1'>{productDelete?.name}</span>{' '}
            sẽ bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const DEFAULT_PAGE_SIZE = 10
export default function ProductTable() {
  const dispatch = useDispatch<AppDispatch>()
  const { data, page, limit, totalItems, totalPages, isLoading } = useSelector((s: RootState) => s.product)
  const [hasInitialFetch, setHasInitialFetch] = useState(false)

  useEffect(() => {
    if (!hasInitialFetch) {
      dispatch(getProducts())
      setHasInitialFetch(true)
    }
  }, [dispatch, hasInitialFetch])

  const pageIndex = page - 1
  const [productIdEdit, setProductIdEdit] = useState<number | undefined>()
  const [productDelete, setProductDelete] = useState<ProductItem | null>(null)
  const resolvedPageSize = DEFAULT_PAGE_SIZE
  const typedData = useMemo(() => (data ?? []) as unknown as ProductItem[], [data])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex,
    pageSize: resolvedPageSize
  })

  const table = useReactTable({
    data: typedData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: { sorting, columnFilters, columnVisibility, rowSelection, pagination }
  })

  useEffect(() => {
    const maxPageIndex = Math.max(0, totalPages - 1)
    if (pagination.pageIndex > maxPageIndex) {
      setPagination((prev) => ({ ...prev, pageIndex: maxPageIndex }))
    }
  }, [totalPages, pagination.pageIndex])

  useEffect(() => {
    table.setPagination({ pageIndex: pagination.pageIndex, pageSize: resolvedPageSize })
  }, [table, pagination.pageIndex, resolvedPageSize])

  return (
    <ProductTableContext.Provider value={{ productIdEdit, setProductIdEdit, productDelete, setProductDelete }}>
      <div className='w-full'>
        <EditProduct id={productIdEdit} setId={setProductIdEdit} />
        <AlertDialogDeleteProduct productDelete={productDelete} setProductDelete={setProductDelete} />
        <div className='flex items-center py-4'>
          <Input
            placeholder='Lọc theo tên...'
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
          <div className='ml-auto flex items-center gap-2'>
            <AddProduct />
          </div>
        </div>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center'>
                    {isLoading ? 'Loading...' : 'No results.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className='flex items-center justify-end space-x-2 py-4'>
          <div className='text-xs text-muted-foreground py-4 flex-1 '>
            Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong> trong{' '}
            <strong>{typedData.length}</strong> kết quả
          </div>
          <div>
            <AutoPagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              limit={limit}
              pathname='/manage/product'
            />
          </div>
        </div>
      </div>
    </ProductTableContext.Provider>
  )
}
