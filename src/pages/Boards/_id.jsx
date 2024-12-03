// Board details

import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'

// import { mockData } from '~/apis/mock-data'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI, updateBoardDetailsAPI } from '~/apis'
import { generatePlacehoderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // Tạm thời set cứng boardID sau sẽ dùng react-router-dom để lấy id từ params url
    const boardId = '6705fbb806fdeac7b973a59a'
    // Call api
    fetchBoardDetailsAPI(boardId).then((board) => {
      // Khi tải trang web thì nó sẽ chưa có card, thêm 1 card rỗng để xử lý vấn đề kéo thả vào column rỗng
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlacehoderCard(column)]
          column.cardOrderIds = [generatePlacehoderCard(column)._id]
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
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }
    setBoard(newBoard)
  }

  // Func này có nhiệm vụ gọi API khi xử lý kéo thả xong
  const moveColumns = async (dndOderedColumns) => {
    const dndOderedColumnsIds = dndOderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOderedColumns
    newBoard.columnOrderIds = dndOderedColumnsIds
    setBoard(newBoard)

    // Gọi api update
    await updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOderedColumnsIds })
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board}/>
      <BoardContent board={board} createNewColumn={createNewColumn} createNewCard={createNewCard} moveColumns={moveColumns}/>
    </Container>
  )
}

export default Board
