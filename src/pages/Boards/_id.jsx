// Board details

import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mapOrder } from '~/utils/sorts'
import { toast } from 'react-toastify'

// import { mockData } from '~/apis/mock-data'
import {
  fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI,
  deleteColumnDetailsAPI
} from '~/apis'
import { generatePlacehoderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // Tạm thời set cứng boardID sau sẽ dùng react-router-dom để lấy id từ params url
    const boardId = '6705fbb806fdeac7b973a59a'
    // Call api
    fetchBoardDetailsAPI(boardId).then((board) => {
      // vd71. Sắp xếp thứ tự các column ở đây luôn trước khi đưa dữ liệu xuống component con. fix bug quan trọng ở vd 71
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
      // Khi tải trang web thì nó sẽ chưa có card, thêm 1 card rỗng để xử lý vấn đề kéo thả vào column rỗng
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlacehoderCard(column)]
          column.cardOrderIds = [generatePlacehoderCard(column)._id]
        } else {
          //Sắp xếp thứ tự các cards ở đây luôn trước khi đưa dữ liệu xuống component con.
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })
      setBoard(board)
    })
  }, [])

  // Tạm thời sẽ call API add column và card ở đây, sau này dùng redux sẽ sửa lại
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    createdColumn.cards = [generatePlacehoderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlacehoderCard(createdColumn)._id]
    // Cập nhật state board
    // Phía FE phải tự làm đúng lại state data board (thay vì phải gọi lại api fetchBoardDetailsAPI). Lưu ý phụ thuộc vào đặt thù dự án, có nơi BE sẽ trả luôn cho FE nhàn
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(col => col._id === createdCard.columnId)
    if (columnToUpdate) {
      if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
        // Nếu column rỗng: bản chất là đang chứa 1 cái flaceholder-card, thì gán trực tiếp bằng 1 mảng mới
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {
        // Ngược lại nếu đã có dữ liệu thì push vào cuối mảng
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }
    setBoard(newBoard)
  }

  // Func này có nhiệm vụ gọi API khi xử lý kéo thả xong
  // Chỉ cần gọi API để cập nhật mảng columnOrderIds của Board chứa nó (thay đổi vị trí trong board)
  const moveColumns = (dndOderedColumns) => {
    const dndOderedColumnsIds = dndOderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOderedColumns
    newBoard.columnOrderIds = dndOderedColumnsIds
    setBoard(newBoard)

    // Gọi api update
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOderedColumnsIds })
  }

  // Khi di chuyển card trong cùng 1 column
  // Chỉ cần gọi API để cập nhật mảng cardOrderIds của Column chứa nó (thay đổi vị trí trong mảng)
  const moveCardInTheSameColumn = (dndOderedCards, dndOderedCardsIds, columnId) => {
    // Update cho chuẩn dữ liệu state Board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(col => col._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOderedCards
      columnToUpdate.cardOrderIds = dndOderedCardsIds
    }
    setBoard(newBoard)
    // Gọi api update board
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOderedCardsIds })
  }

  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOderedColumns) => {
    const dndOderedColumnsIds = dndOderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOderedColumns
    newBoard.columnOrderIds = dndOderedColumnsIds
    setBoard(newBoard)

    // Call api update board
    let prevCardOrderIds = dndOderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    // Xử lý vấn đề khi kéo thả card cuối cùng ra khỏi column, column rỗng sẽ có placeholder-card, cần xóa nó đi trước khi gửi dữ liệu lên cho phía BE
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }

  // Xử lý xóa 1 column và cards bên trong nó
  const deleteColumnDetails = (columnId) => {
    // Update cho chuẩn dữ liệu state Board
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter(c => c._id !== columnId)
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== columnId)
    setBoard(newBoard)

    // Call API
    deleteColumnDetailsAPI(columnId).then(res => {
      toast.success(res?.deleteResult)
    })
  }

  if (!board) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vw',
        height: '100vh'
      }}>
        <CircularProgress />
        <Typography >Loading Board...</Typography>
      </Box>
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board}/>
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        deleteColumnDetails={deleteColumnDetails}
      />
    </Container>
  )
}

export default Board
