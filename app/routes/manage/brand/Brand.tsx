import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import BrandTable from './Brand-Table'

export default function Brand() {
  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='space-y-2'>
        <Card x-chunk='dashboard-06-chunk-0'>
          <CardHeader>
            <CardTitle>Thương hiệu</CardTitle>
            <CardDescription>Quản lý thương hiệu</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              <BrandTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
