import Box from '@mui/material/Box'
import Columns from './Columns/Columns'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'

function ListColumns({ columns }) {
  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        display: 'flex',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 },
        overflowX: 'auto',
        width: '100%',
        height: '100%'
      }}>
        {/* Box Column */}
        {columns?.map((column) => <Columns column={column} key={column._id}/>)}

        {/* Button add new Column */}
        <Box sx={{
          borderRadius: '6px',
          mx: 2,
          maxWidth: '200px',
          minWidth: '200px',
          height: 'fit-content',
          bgcolor: '#ffffff3d'
        }}>
          <Button sx={{
            width: '100%',
            color: 'white',
            pl: 2,
            py: 1,
            display: 'flex',
            justifyContent: 'flex-start'
          }}
          startIcon={<NoteAddIcon/>}
          >
            Add new column
          </Button>
        </Box>
      </Box>
    </SortableContext>
  )
}

export default ListColumns
