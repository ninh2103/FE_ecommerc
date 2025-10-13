import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useEffect, useState, createContext, useContext } from 'react'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState
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
import { Input } from '~/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
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
import AutoPagination from '~/components/auto-pagination'
import type { BrandIncludeTranslationType } from '~/validateSchema/brand.schema'
import AddBrand from './Add-Brand'
import EditBrand from './Edit-Brand'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '~/store'
import { deleteBrand, getBrand } from '~/features/brandSlice'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

type BrandItem = BrandIncludeTranslationType

const BrandTableContext = createContext<{
  setBrandIdEdit: (value: number | undefined) => void
  brandIdEdit: number | undefined
  brandDelete: BrandItem | null
  setBrandDelete: (value: BrandItem | null) => void
}>({
  setBrandIdEdit: () => {},
  brandIdEdit: undefined,
  brandDelete: null,
  setBrandDelete: () => {}
})

export const columns: ColumnDef<BrandIncludeTranslationType>[] = [
  { accessorKey: 'id', header: 'ID' },
  {
    accessorKey: 'logo',
    header: 'Logo',
    cell: ({ row }) => {
      const logoUrl = row.original.logo
      const safeSrc = logoUrl && (logoUrl.startsWith('http') || logoUrl.startsWith('/')) ? logoUrl : undefined
      return (
        <div>
          <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
            <AvatarImage src={safeSrc ?? undefined} />
            <AvatarFallback className='rounded-none'>{logoUrl ? 'Logo' : 'No logo'}</AvatarFallback>
          </Avatar>
        </div>
      )
    }
  },
  { accessorKey: 'name', header: 'Tên', cell: ({ row }) => <div className='capitalize'>{row.getValue('name')}</div> },
  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setBrandIdEdit, setBrandDelete } = useContext(BrandTableContext)
      const openEdit = () => setBrandIdEdit(row.original.id)
      const openDelete = () => setBrandDelete(row.original)
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

function AlertDialogDeleteBrand({
  brandDelete,
  setBrandDelete,
  onDeleteSuccess
}: {
  brandDelete: BrandItem | null
  setBrandDelete: (value: BrandItem | null) => void
  onDeleteSuccess: (brandId: number) => void
}) {
  const handleDelete = async () => {
    if (!brandDelete?.id) return
    try {
      await onDeleteSuccess(brandDelete.id)
      toast.success('Xóa thương hiệu thành công')
    } catch (error) {
      toast.error('Xóa thương hiệu thất bại')
    }
    setBrandDelete(null)
  }

  return (
    <AlertDialog
      open={Boolean(brandDelete)}
      onOpenChange={(value) => {
        if (!value) setBrandDelete(null)
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa thương hiệu?</AlertDialogTitle>
          <AlertDialogDescription>
            Thương hiệu <span className='bg-foreground text-primary-foreground rounded px-1'>{brandDelete?.name}</span>{' '}
            sẽ bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const PAGE_SIZE = 10
export default function BrandTable() {
  const dispatch = useDispatch<AppDispatch>()
  const { data, page, limit, totalItems, totalPages } = useSelector((state: RootState) => state.brand)

  const isLoading = useSelector((state: RootState) => state.brand.isLoading)
  const pageIndex = 0
  const [brandIdEdit, setBrandIdEdit] = useState<number | undefined>()
  const [brandDelete, setBrandDelete] = useState<BrandItem | null>(null)
  const brands: BrandIncludeTranslationType[] = data
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex,
    pageSize: PAGE_SIZE
  })

  useEffect(() => {
    if (!isLoading && (!brands || brands.length === 0)) {
      dispatch(getBrand())
    }
  }, [dispatch, isLoading, brands])

  const table = useReactTable({
    data: brands,
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
    table.setPagination({ pageIndex, pageSize: PAGE_SIZE })
  }, [table, pageIndex])

  const handleDeleteBrand = (brandId: number) => {
    dispatch(deleteBrand(brandId))
  }

  return (
    <BrandTableContext.Provider value={{ brandIdEdit, setBrandIdEdit, brandDelete, setBrandDelete }}>
      <div className='w-full'>
        <EditBrand id={brandIdEdit} setId={setBrandIdEdit} onSubmitSuccess={() => {}} />
        <AlertDialogDeleteBrand
          brandDelete={brandDelete}
          setBrandDelete={setBrandDelete}
          onDeleteSuccess={handleDeleteBrand}
        />
        <div className='flex items-center py-4'>
          <Input
            placeholder='Lọc theo tên thương hiệu...'
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
          <div className='ml-auto flex items-center gap-2'>
            <AddBrand />
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className='flex items-center justify-end space-x-2 py-4'>
          <div className='text-xs text-muted-foreground py-4 flex-1 '>
            Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong> trong <strong>{brands.length}</strong>{' '}
            kết quả
          </div>
          <div>
            <AutoPagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              limit={limit}
              pathname='/manage/brand'
            />
          </div>
        </div>
      </div>
    </BrandTableContext.Provider>
  )
}
