import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  // PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'

function BoardContent({ board }) {
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  // Yêu cầu chuột di chuyển 10px mới kích hoạt event, fix trường hợp click bị gọi event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragEnd = (event) => {
    const { active, over } = event

    // Kiểm tra k tồn tại over - kéo linh tinh ra ngoài thì return
    if (!over) return

    // Kiểm tra sau khi kéo thả có khác vị trí ban đầu không
    if ( active.id !== over.id ) {
      // Lấy vị trí cũ
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      // Lấy vị trí mới
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)

      // Dùng ArrayMove để sắp xếp lại mảng ban đầu
      const dndOderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      // 2 cái dưới để dùng xử lý gọi API
      // const dndOderedColumnsIds = dndOderedColumns.map(c => c._id)
      // console.log('dndOderedColumns::', dndOderedColumns);
      // console.log('dndOderedColumnsIds::', dndOderedColumnsIds);

      // Set lại comlumn sau khi đã kéo thả
      setOrderedColumns(dndOderedColumns)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box
        sx={{
          width: '100%',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
          height: (theme) => theme.trello.boardContentHeight,
          display: 'flex',
          p: '10px 0'
        }}
      >
        <ListColumns columns={orderedColumns}/>
      </Box>
    </DndContext>
  )
}

export default BoardContent
