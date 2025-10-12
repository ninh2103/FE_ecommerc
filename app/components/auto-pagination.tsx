import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '~/components/ui/pagination'
import { cn } from '~/lib/utils'

interface Props {
  currentPage: number
  totalPages: number
  totalItems: number
  limit: number
  pathname: string
}

/**
Với range = 2 áp dụng cho khoảng cách đầu, cuối và xung quanh current_page

[1] 2 3 ... 19 20
1 [2] 3 4 ... 19 20 
1 2 [3] 4 5 ... 19 20
1 2 3 [4] 5 6 ... 19 20
1 2 3 4 [5] 6 7 ... 19 20

1 2 ... 4 5 [6] 8 9 ... 19 20

1 2 ...13 14 [15] 16 17 ... 19 20


1 2 ... 14 15 [16] 17 18 19 20
1 2 ... 15 16 [17] 18 19 20
1 2 ... 16 17 [18] 19 20
1 2 ... 17 18 [19] 20
1 2 ... 18 19 [20]
 */

const RANGE = 2
export default function AutoPagination({ currentPage, totalPages, totalItems, limit, pathname }: Props) {
  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <PaginationItem key={`dot-before-${index}`}>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
      return null
    }
    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <PaginationItem key={`dot-after-${index}`}>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
      return null
    }
    return Array(totalPages)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1

        // Điều kiện để return về ...
        if (currentPage <= RANGE * 2 + 1 && pageNumber > currentPage + RANGE && pageNumber < totalPages - RANGE + 1) {
          return renderDotAfter(index)
        } else if (currentPage > RANGE * 2 + 1 && currentPage < totalPages - RANGE * 2) {
          if (pageNumber < currentPage - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > currentPage + RANGE && pageNumber < totalPages - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (currentPage >= totalPages - RANGE * 2 && pageNumber > RANGE && pageNumber < currentPage - RANGE) {
          return renderDotBefore(index)
        }
        return (
          <PaginationItem key={pageNumber}>
            <PaginationLink href={`${pathname}?page=${pageNumber}`} isActive={pageNumber === currentPage}>
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        )
      })
  }
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`${pathname}?page=${currentPage - 1}`}
            className={cn({
              'cursor-not-allowed': currentPage === 1
            })}
            onClick={(e) => {
              if (currentPage === 1) {
                e.preventDefault()
              }
            }}
          />
        </PaginationItem>
        {renderPagination()}

        <PaginationItem>
          <PaginationNext
            href={`${pathname}?page=${currentPage + 1}`}
            className={cn({
              'cursor-not-allowed': currentPage === totalPages
            })}
            onClick={(e) => {
              if (currentPage === totalPages) {
                e.preventDefault()
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
