import React, { useState, useMemo } from 'react'
import Grid from '@mui/material/Grid2'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Button,
} from '@mui/material'
import {
  Visibility,
  ThumbUp,
  Comment,
  Timeline,
  YouTube,
} from '@mui/icons-material'
import VideoComparisonChart from '../charts/VideoComparisonChart'

interface TopVideo {
  id: number
  videoId: string
  title: string
  views: number
  likes: number
  comments: number
  shares: number
  watchTime: string
}

interface PerformanceTabProps {
  topVideosData: TopVideo[]
  isLoading: boolean
  formatNumber: (num: number) => string
}

// Type for sort direction
type Order = 'asc' | 'desc'

// Sort function for different data types
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (typeof a[orderBy] === 'string' && typeof b[orderBy] === 'string') {
    return (b[orderBy] as string).localeCompare(a[orderBy] as string)
  }

  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator<Key extends keyof TopVideo>(
  order: Order,
  orderBy: Key
): (a: TopVideo, b: TopVideo) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

// Stable sort function
function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

// Column interface
interface Column {
  id: keyof TopVideo
  label: string
  minWidth?: number
  align?: 'right' | 'left' | 'center'
  format?: (value: any) => React.ReactNode
  sortable?: boolean
}

const PerformanceTab: React.FC<PerformanceTabProps> = ({
  topVideosData,
  isLoading,
  formatNumber,
}) => {
  // State for pagination and sorting
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [order, setOrder] = useState<Order>('desc')
  const [orderBy, setOrderBy] = useState<keyof TopVideo>('views')

  // Define columns configuration
  const columns: Column[] = [
    {
      id: 'title',
      label: 'Video Title',
      minWidth: 200,
      sortable: true,
    },
    {
      id: 'views',
      label: 'Views',
      align: 'right',
      minWidth: 100,
      sortable: true,
      format: (value) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            justifyContent: 'flex-end',
          }}
        >
          <Visibility fontSize="small" color="action" />
          {formatNumber(value as number)}
        </Box>
      ),
    },
    {
      id: 'likes',
      label: 'Likes',
      align: 'right',
      minWidth: 100,
      sortable: true,
      format: (value) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            justifyContent: 'flex-end',
          }}
        >
          <ThumbUp fontSize="small" color="action" />
          {formatNumber(value as number)}
        </Box>
      ),
    },
    {
      id: 'comments',
      label: 'Comments',
      align: 'right',
      minWidth: 120,
      sortable: true,
      format: (value) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            justifyContent: 'flex-end',
          }}
        >
          <Comment fontSize="small" color="action" />
          {formatNumber(value as number)}
        </Box>
      ),
    },
    {
      id: 'watchTime',
      label: 'Watch Time (min)',
      align: 'right',
      minWidth: 150,
      sortable: true,
      format: (value) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            justifyContent: 'flex-end',
          }}
        >
          <Timeline fontSize="small" color="action" />
          {value}
        </Box>
      ),
    },
    {
      id: 'videoId',
      label: 'Actions',
      align: 'center',
      minWidth: 120,
      sortable: false,
      format: (value) => (
        <Button
          size="small"
          variant="outlined"
          href={`https://www.youtube.com/watch?v=${value}`}
          target="_blank"
          startIcon={<YouTube />}
          sx={{ minWidth: '80px' }}
        >
          View
        </Button>
      ),
    },
  ]

  // Handle sorting
  const handleRequestSort = (property: keyof TopVideo) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  // Handle pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Compute the sorted and paginated rows
  const sortedRows = useMemo(() => {
    return stableSort(topVideosData, getComparator(order, orderBy)).slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    )
  }, [topVideosData, order, orderBy, page, rowsPerPage])

  // Render functions
  const renderTableHeader = () => (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.id}
            align={column.align || 'left'}
            style={{ minWidth: column.minWidth }}
            sortDirection={orderBy === column.id ? order : false}
          >
            {column.sortable ? (
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : 'asc'}
                onClick={() => handleRequestSort(column.id)}
              >
                {column.label}
              </TableSortLabel>
            ) : (
              column.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )

  return (
    <Grid container spacing={3}>
      {/* Top Videos Table */}
      <Grid size={{ xs: 12 }}>
        <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <CardHeader
            title="Top Performing Videos"
            subheader="Based on views in the selected date range"
          />
          <CardContent>
            {isLoading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="400px"
              >
                <CircularProgress />
              </Box>
            ) : topVideosData.length > 0 ? (
              <Box sx={{ height: 'auto', width: '100%' }}>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                  <TableContainer sx={{ maxHeight: 400 }}>
                    <Table stickyHeader aria-label="top videos table">
                      {renderTableHeader()}

                      <TableBody>
                        {sortedRows.map((row) => (
                          <TableRow hover key={row.id}>
                            {columns.map((column) => {
                              const value = row[column.id]
                              return (
                                <TableCell
                                  key={column.id}
                                  align={column.align || 'left'}
                                >
                                  {column.format ? column.format(value) : value}
                                </TableCell>
                              )
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={topVideosData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>
              </Box>
            ) : (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="400px"
              >
                <Typography color="text.secondary">
                  No video performance data available for this period
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Video comparison chart */}
      <Grid size={{ xs: 12 }}>
        <VideoComparisonChart data={topVideosData} isLoading={isLoading} />
      </Grid>
    </Grid>
  )
}

export default PerformanceTab
