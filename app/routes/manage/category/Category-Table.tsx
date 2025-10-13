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
import type { CategoryIncludeTranslationType } from '~/validateSchema/category.schema'
import AddCategory from './Add-Category'
import EditCategory from './Edit-Category'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '~/store'
import { deleteCategory, getCategory } from '~/features/categorySlice'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

type CategoryItem = CategoryIncludeTranslationType

const CategoryTableContext = createContext<{
  setCategoryIdEdit: (value: number | undefined) => void
  categoryIdEdit: number | undefined
  categoryDelete: CategoryItem | null
  setCategoryDelete: (value: CategoryItem | null) => void
}>({
  setCategoryIdEdit: () => {},
  categoryIdEdit: undefined,
  categoryDelete: null,
  setCategoryDelete: () => {}
})

export const columns: ColumnDef<CategoryIncludeTranslationType>[] = [
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
  { accessorKey: 'parentCategoryId', header: 'Danh mục cha' },
  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setCategoryIdEdit, setCategoryDelete } = useContext(CategoryTableContext)
      const openEdit = () => setCategoryIdEdit(row.original.id)
      const openDelete = () => setCategoryDelete(row.original)
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

function AlertDialogDeleteCategory({
  categoryDelete,
  setCategoryDelete,
  onDeleteSuccess
}: {
  categoryDelete: CategoryItem | null
  setCategoryDelete: (value: CategoryItem | null) => void
  onDeleteSuccess: (categoryId: number) => void
}) {
  const handleDelete = async () => {
    if (!categoryDelete?.id) return
    try {
      await onDeleteSuccess(categoryDelete.id)
      toast.success('Xóa danh mục thành công')
    } catch (error) {
      toast.error('Xóa danh mục thất bại')
    }
    setCategoryDelete(null)
  }

  return (
    <AlertDialog
      open={Boolean(categoryDelete)}
      onOpenChange={(value) => {
        if (!value) setCategoryDelete(null)
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa danh mục?</AlertDialogTitle>
          <AlertDialogDescription>
            Danh mục <span className='bg-foreground text-primary-foreground rounded px-1'>{categoryDelete?.name}</span>{' '}
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
export default function CategoryTable() {
  const dispatch = useDispatch<AppDispatch>()
  const { data, page, limit, totalItems, totalPages } = useSelector((state: RootState) => state.category)

  const isLoading = useSelector((state: RootState) => state.category.isLoading)
  const pageIndex = 0
  const [categoryIdEdit, setCategoryIdEdit] = useState<number | undefined>()
  const [categoryDelete, setCategoryDelete] = useState<CategoryItem | null>(null)
  const categories: CategoryIncludeTranslationType[] = data
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex,
    pageSize: PAGE_SIZE
  })

  useEffect(() => {
    if (!isLoading && (!categories || categories.length === 0)) {
      dispatch(getCategory())
    }
  }, [dispatch, isLoading, categories])

  const table = useReactTable({
    data: categories,
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

  const handleDeleteCategory = (categoryId: number) => {
    dispatch(deleteCategory(categoryId))
  }

  return (
    <CategoryTableContext.Provider value={{ categoryIdEdit, setCategoryIdEdit, categoryDelete, setCategoryDelete }}>
      <div className='w-full'>
        <EditCategory id={categoryIdEdit} setId={setCategoryIdEdit} onSubmitSuccess={() => {}} />
        <AlertDialogDeleteCategory
          categoryDelete={categoryDelete}
          setCategoryDelete={setCategoryDelete}
          onDeleteSuccess={handleDeleteCategory}
        />
        <div className='flex items-center py-4'>
          <Input
            placeholder='Lọc theo tên danh mục...'
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
          <div className='ml-auto flex items-center gap-2'>
            <AddCategory />
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
            Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong> trong{' '}
            <strong>{categories.length}</strong> kết quả
          </div>
          <div>
            <AutoPagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              limit={limit}
              pathname='/manage/category'
            />
          </div>
        </div>
      </div>
    </CategoryTableContext.Provider>
  )
}
