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
import type { RoleType } from '~/validateSchema/role.schema'
import AddRole from './Add-Role'
import EditRole from './Edit-Role'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '~/store'
import { deleteRole, getRole } from '~/features/roleSlice'
import { toast } from 'sonner'

type RoleItem = RoleType

const RoleTableContext = createContext<{
  setRoleIdEdit: (value: number | undefined) => void
  roleIdEdit: number | undefined
  roleDelete: RoleItem | null
  setRoleDelete: (value: RoleItem | null) => void
}>({
  setRoleIdEdit: () => {},
  roleIdEdit: undefined,
  roleDelete: null,
  setRoleDelete: () => {}
})

export const columns: ColumnDef<RoleType>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: 'Tên',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('name')}</div>
  },
  {
    accessorKey: 'description',
    header: 'Mô tả',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('description')}</div>
  },
  {
    accessorKey: 'isActive',
    header: 'Kích hoạt',
    cell: ({ row }) => <div>{row.getValue<boolean>('isActive') ? 'Đang bật' : 'Đang tắt'}</div>
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setRoleIdEdit, setRoleDelete } = useContext(RoleTableContext)
      const openEdit = () => setRoleIdEdit(row.original.id)
      const openDelete = () => setRoleDelete(row.original)
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

function AlertDialogDeleteRole({
  roleDelete,
  setRoleDelete,
  onDeleteSuccess
}: {
  roleDelete: RoleItem | null
  setRoleDelete: (value: RoleItem | null) => void
  onDeleteSuccess: (roleId: number) => void
}) {
  const handleDelete = async () => {
    if (!roleDelete?.id) return
    try {
      await onDeleteSuccess(roleDelete.id)
      toast.success('Xóa vai trò thành công')
    } catch (error) {
      toast.error('Xóa vai trò thất bại')
    }
    setRoleDelete(null)
  }

  return (
    <AlertDialog
      open={Boolean(roleDelete)}
      onOpenChange={(value) => {
        if (!value) setRoleDelete(null)
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa vai trò?</AlertDialogTitle>
          <AlertDialogDescription>
            Vai trò <span className='bg-foreground text-primary-foreground rounded px-1'>{roleDelete?.name}</span> sẽ bị
            xóa vĩnh viễn
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
export default function RoleTable() {
  const dispatch = useDispatch<AppDispatch>()
  const { roles, page, limit, totalItems, totalPages } = useSelector((state: RootState) => state.role)

  const isRoleLoading = useSelector((state: RootState) => state.role.isLoading)
  const pageIndex = 0
  const [roleIdEdit, setRoleIdEdit] = useState<number | undefined>()
  const [roleDelete, setRoleDelete] = useState<RoleItem | null>(null)
  const data: RoleType[] = roles ?? []
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex,
    pageSize: PAGE_SIZE
  })

  useEffect(() => {
    // Chỉ fetch lần đầu khi component mount
    if (!isRoleLoading && (!roles || roles.length === 0)) {
      dispatch(getRole())
    }
  }, [dispatch, isRoleLoading, roles])

  const table = useReactTable({
    data,
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

  const handleDeleteRole = (roleId: number) => {
    dispatch(deleteRole(roleId))
  }

  return (
    <RoleTableContext.Provider value={{ roleIdEdit, setRoleIdEdit, roleDelete, setRoleDelete }}>
      <div className='w-full'>
        <EditRole id={roleIdEdit} setId={setRoleIdEdit} onSubmitSuccess={() => {}} />
        <AlertDialogDeleteRole
          roleDelete={roleDelete}
          setRoleDelete={setRoleDelete}
          onDeleteSuccess={handleDeleteRole}
        />
        <div className='flex items-center py-4'>
          <Input
            placeholder='Lọc theo tên vai trò...'
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
          <div className='ml-auto flex items-center gap-2'>
            <AddRole />
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
            Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong> trong <strong>{data.length}</strong>{' '}
            kết quả
          </div>
          <div>
            <AutoPagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              limit={limit}
              pathname='/manage/role'
            />
          </div>
        </div>
      </div>
    </RoleTableContext.Provider>
  )
}
