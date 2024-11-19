import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import CloseIcon from '@mui/icons-material/Close'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import Columns from './Columns/Columns'
import { toast } from 'react-toastify'


function ListColumns({ columns }) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)
  const [newColumnTitle, setNewColumnTitle] = useState('')

  const addNewColumn = () => {
    if (!newColumnTitle) {
      toast.error('Please enter column title')
      return
    }

    /// Xử lý gọi api thêm column

    // Đóng trạng thái thêm column mới và clear input
    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }

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
        {!openNewColumnForm
          ? <Box onClick={toggleOpenNewColumnForm} sx={{
            borderRadius: '6px',
            mx: 2,
            maxWidth: '250px',
            minWidth: '250px',
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
          : <Box sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1

          }}>
            <TextField
              label="Enter column title..."
              type="text"
              size='small'
              variant='outlined'
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                onClick={addNewColumn}
                variant='contained' color='success' size='small'
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                }}
              >Add column</Button>
              <CloseIcon
                fontSize='small'
                sx={{ color: 'white', cursor: 'pointer' }}
                onClick={toggleOpenNewColumnForm}
              />
            </Box>
          </Box>
        }
      </Box>
    </SortableContext>
  )
}

export default ListColumns
