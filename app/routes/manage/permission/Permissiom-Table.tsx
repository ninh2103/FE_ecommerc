'use client'

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
import type { PermissionType } from '~/validateSchema/permission.schema'
import AddPermission from './Add-Permission'
import EditPermission from './Edit-Permission'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '~/store'
import { deletePermission, getPermission } from '~/features/permissionSlice'
import { toast } from 'sonner'

type PermissionItem = PermissionType

const PermissionTableContext = createContext<{
  setPermissionIdEdit: (value: number | undefined) => void
  permissionIdEdit: number | undefined
  permissionDelete: PermissionItem | null
  setPermissionDelete: (value: PermissionItem | null) => void
}>({
  setPermissionIdEdit: () => {},
  permissionIdEdit: undefined,
  permissionDelete: null,
  setPermissionDelete: () => {}
})

export const columns: ColumnDef<PermissionType>[] = [
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
    accessorKey: 'path',
    header: 'Đường dẫn',
    cell: ({ row }) => <div className='font-mono text-sm'>{row.getValue('path')}</div>
  },
  {
    accessorKey: 'method',
    header: 'Phương thức',
    cell: ({ row }) => (
      <div className='rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800'>{row.getValue('method')}</div>
    )
  },
  {
    accessorKey: 'module',
    header: 'Module',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('module') || 'N/A'}</div>
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setPermissionIdEdit, setPermissionDelete } = useContext(PermissionTableContext)
      const openEdit = () => setPermissionIdEdit(row.original.id)
      const openDelete = () => setPermissionDelete(row.original)
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

function AlertDialogDeletePermission({
  permissionDelete,
  setPermissionDelete,
  onDeleteSuccess
}: {
  permissionDelete: PermissionItem | null
  setPermissionDelete: (value: PermissionItem | null) => void
  onDeleteSuccess: (permissionId: number) => void
}) {
  const handleDelete = async () => {
    if (!permissionDelete?.id) return
    try {
      await onDeleteSuccess(permissionDelete.id)
      toast.success('Xóa quyền thành công')
    } catch (error) {
      toast.error('Xóa quyền thất bại')
    }
    setPermissionDelete(null)
  }

  return (
    <AlertDialog
      open={Boolean(permissionDelete)}
      onOpenChange={(value) => {
        if (!value) setPermissionDelete(null)
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa quyền?</AlertDialogTitle>
          <AlertDialogDescription>
            Quyền <span className='bg-foreground text-primary-foreground rounded px-1'>{permissionDelete?.name}</span>{' '}
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
export default function PermissionTable() {
  const dispatch = useDispatch<AppDispatch>()
  const { data } = useSelector((state: RootState) => state.permission)

  const isPermissionLoading = useSelector((state: RootState) => state.permission.isLoading)
  const pageIndex = 0
  const [permissionIdEdit, setPermissionIdEdit] = useState<number | undefined>()
  const [permissionDelete, setPermissionDelete] = useState<PermissionItem | null>(null)
  const permission: PermissionType[] = data ?? []
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
    dispatch(getPermission())
  }, [dispatch])

  const table = useReactTable({
    data: permission,
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

  const handleDeletePermission = async (permissionId: number) => {
    try {
      await dispatch(deletePermission(permissionId)).unwrap()
      dispatch(getPermission())
    } catch (error) {
      toast.error('Xóa quyền thất bại')
    }
  }

  return (
    <PermissionTableContext.Provider
      value={{ permissionIdEdit, setPermissionIdEdit, permissionDelete, setPermissionDelete }}
    >
      <div className='w-full'>
        <EditPermission id={permissionIdEdit} setId={setPermissionIdEdit} onSubmitSuccess={() => {}} />
        <AlertDialogDeletePermission
          permissionDelete={permissionDelete}
          setPermissionDelete={setPermissionDelete}
          onDeleteSuccess={handleDeletePermission}
        />
        <div className='flex items-center py-4'>
          <Input
            placeholder='Lọc theo tên quyền...'
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
          <div className='ml-auto flex items-center gap-2'>
            <AddPermission />
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
            <strong>{permission.length}</strong> kết quả
          </div>
          <div>
            <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname='/manage/permission'
            />
          </div>
        </div>
      </div>
    </PermissionTableContext.Provider>
  )
}
