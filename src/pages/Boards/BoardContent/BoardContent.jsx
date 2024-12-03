import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  // PointerSensor,
  useSensor,
  useSensors,
  // MouseSensor,
  // TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  pointerWithin,
  // rectIntersection,
  closestCorners,
  getFirstCollision
  // closestCenter
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customLibs/DndKitSensors'
import { arrayMove } from '@dnd-kit/sortable'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlacehoderCard } from '~/utils/formatters'
import Column from './ListColumns/Columns/Columns'
import Card from './ListColumns/Columns/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board, createNewColumn, createNewCard }) {
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  // Yêu cầu chuột di chuyển 10px mới kích hoạt event, fix trường hợp click bị gọi event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  // chi keo 1 phan tu trong 1 thoi diem
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  // Điểm va chạm cuối cùng (xử lý thuật toán phát hiện va chạm video 37)
  const lastOverId = useRef(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  // Tìm 1 column theo card id
  const findColumnByCardId = (cardId) => {
    // Lưu ý nên dùng c.cards thay vì c.cardOrderIds bởi vì bước handleDragOver chúng ta sẽ làm dữ liệu cho card hoàn chỉnh trước rồi mới tạo ra cardOrderIds mới.
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  // Function chung xử lý việc cập nhật lại state trong trường hợp di chuyển card qua lại các column khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns(prevColumns => {
      // Tìm vị trí index của cái overCard trong column đích (nơi card sắp được thả)
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

      // Login này lấy chuẩn ra từ thư viện
      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height

      const modifier = isBelowOverItem ? 1 : 0

      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards.length + 1

      // Clone mảng orderedColumns cũ ra một cái mới để xử lý data rồi return - cập nhật lại orderedColumns mới
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

      // Column cũ
      if (nextActiveColumn) {
        //Cập nhật xoá card ở column active (xoá ở column cũ để đưa qua column mới)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
        // Thêm placeholder card nếu column rỗng khi bị kéo hết card đi (video 37.2)
        if (isEmpty(nextActiveColumn.cards)) {
          // console.log('Card cuoi cung bi keo di')
          nextActiveColumn.cards = [generatePlacehoderCard(nextActiveColumn)]
        }
        // Cập nhật lại mảng cardOrderIds
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      // Column mới
      if (nextOverColumn) {
        // Kiểm tra xem card đang kéo có tồn tại ở overColumn chưa, nếu có cần xoá nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
        // Đối với trường hợp dragEnd thì phải cập nhật lại chuẩn dữ liệu columnId trong card sau khi kéo card giữa 2 columns khác nhau
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        // Thêm card đang kéo vào overColumn theo vị trí index đang kéo
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        // Xoá placeholder card đi nếu nó đang tồn tại
        nextOverColumn.cards = nextOverColumn.cards.filter((card) => !card.FE_PlaceholderCard)

        // Cập nhật lại mảng cardOrderIds
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      return nextColumns
    })
  }

  const handleDragStart = (event) => {
    // console.log('handleDragStart: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    // Nếu là card thì mới thực hiện set giá trị oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId((event?.active?.id)))
    }
  }

  // Trigger trong quá trình kéo (drag) 1 phần tử
  const handleDragOver = (event) => {

    // Không làm gì nếu kéo columns
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // Còn nếu kéo card thì xử lý thêm kéo card qua lại các columns
    // console.log('handleDragOver', event)
    const { active, over } = event

    // Cần đảm bảo nếu không tồn tại active hoặc over (khi kéo ra ngoài phạm vi container) thì không làm gì cả (Tránh crash trang)
    if (!active || !over) return

    // activeDraggingCardId: Là cái card đang được kéo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // overCardId: Là cái card đang được tương tác trên hoặc dưới so với cái card được kéo ở trên
    const { id: overCardId } = over

    // Tìm 2 cái columns theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // Nếu không tồn tại 1 trong 2 column thì k làm gì hết
    if (!activeColumn || !overColumn) return

    // Xử lý logic ở đây chỉ khi kéo card qua 2 column khác nhau, còn nếu kéo card trong column ban đầu thì không làm gì
    // Vì đây đang là đoạn xử lý lúc kéo (handleDragOver), còn xử lý xong làm gì thì vấn đề của (handleDragEnd)
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  const handleDragEnd = (event) => {
    // console.log('handleDragEnd', event)
    const { active, over } = event

    // Cần đảm bảo nếu không tồn tại active hoặc over (khi kéo ra ngoài phạm vi container) thì không làm gì cả (Tránh crash trang)
    if (!active || !over) return

    // Xử lý kéo thả cards
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // activeDraggingCardId: Là cái card đang được kéo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      // overCardId: Là cái card đang được tương tác trên hoặc dưới so với cái card được kéo ở trên
      const { id: overCardId } = over

      // Tìm 2 cái columns theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      // Nếu không tồn tại 1 trong 2 column thì k làm gì hết
      if (!activeColumn || !overColumn) return

      // Xử lý kéo thả trong 2 columns khác nhau
      // Phải dùng tới activeDragItemData hoặc oldColumnWhenDraggingCard (state mới đc set vào data từ bước handleDragStart)
      // chứ không phải activeData trong scope handleDragEnd này vì sau khi đi qua onDragOver tới đây state của card đã được cập nhật một lần rồi
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // Lấy vị trí cũ từ thằng oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        // Lấy vị trí mới
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)
        // Dùng ArrayMove để sắp xếp lại mảng ban đầu
        // kéo trong 1 card thì tương tự như kéo 1 column trong 1 board content
        const dndOderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)

        setOrderedColumns(prevColumns => {
        // Clone mảng orderedColumns cũ ra một cái mới để xử lý data rồi return - cập nhật lại orderedColumns mới

          const nextColumns = cloneDeep(prevColumns)
          // Tìm tới column đang thả
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)

          // Cập nhật lại 2 giá trị mới là card và cardOrderIds trong targetColumn
          // Khi set lại các giá trị trong targetColumn thì giá trị trong nextColumns cũng được cập nhật
          targetColumn.cards = dndOderedCards
          targetColumn.cardOrderIds = dndOderedCards.map(card => card._id)

          // Trả về giá trị state mới
          return nextColumns
        })
      }
    }

    // Xử lý kéo thả columns
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // Kiểm tra sau khi kéo thả có khác vị trí ban đầu không
      if (active.id !== over.id) {
        // Lấy vị trí cũ
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        // Lấy vị trí mới
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)

        // Dùng ArrayMove để sắp xếp lại mảng ban đầu
        const dndOderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        // 2 cái dưới để dùng xử lý gọi API
        // const dndOderedColumnsIds = dndOderedColumns.map(c => c._id)
        // console.log('dndOderedColumns::', dndOderedColumns);
        // console.log('dndOderedColumnsIds::', dndOderedColumnsIds);

        // Set lại comlumn sau khi đã kéo thả
        setOrderedColumns(dndOderedColumns)
      }
    }

    // luôn phải set lại state sau khi thả
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }

  // Custom lại chiến lược/ thuật toán phát hiện va chạm tối ưu cho việc kéo thả giữa nhiều columns khác nhau
  // args = arguments = các đối số, tham số
  const collisionDetectionStrategy = useCallback((args) => {
    // Trường hợp kéo column thì dùng thuật toán closestCorners
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }

    // Tìm các điểm va chạm với con trỏ trả về một mảng các va chạm - intersections với con trỏ
    const pointIntersections = pointerWithin(args)

    // Nếu poiterIntersections là mảng rỗng, return luôn không làm gì hết
    // fixx triệt để bug kéo ra ngoài phía trên bị flickering khi card có img
    if (!pointIntersections?.length) return

    // Thuật toán phát hiện va chạm sẽ trả về 1 mảng các va chạm ở đây
    // const intersections = pointIntersections.length > 0 ? pointIntersections : rectIntersection(args)

    // Tìm overId đầu tiên trong đống intersections
    let overId = getFirstCollision(pointIntersections, 'id')

    if (overId) {
      // Nếu cái over nó là column thì sẽ tìm tới cái cardId gần nhất bên trong khu vực va chạm đó dựa vào thuật toán phát hiện va chạm
      // closestCenter hoặc closestConners điều được. Tuy nhiên dùng closestConners cảm giác mượt hơn
      const checkColumn = orderedColumns.find((column) => column._id === overId)
      if (checkColumn) {
        // console.log('overId before:', overId)
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
        // console.log('overId after:', overId)

      }

      lastOverId.current = overId
      return [{ id: overId }]
    }

    // Nếu overId là null thì trả về mảng rỗng - tránh bug crash trang
    return lastOverId.current ? [{ id: lastOverId.current }] : []

  }, [activeDragItemType, orderedColumns])

  return (
    <DndContext
      // Cảm biến
      sensors={sensors}
      // Thuật toán phát hiện va chạm (nếu không có thì card với cover lớn sẽ không kéo qua column
      // được vì lúc này nó đang bị conflict giữa card và column), chúng ta sẽ dùng closestConners thay vì closestCenter
      // Nếu chỉ dùng closestCorners sẽ có bug flickering + sai lệch dữ liệu (xem video 37)
      // collisionDetection={closestCorners}
      // Tự custom nâng cao thuật toán phát hiện va chạm
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}>
      <Box
        sx={{
          width: '100%',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
          height: (theme) => theme.trello.boardContentHeight,
          display: 'flex',
          p: '10px 0'
        }}
      >
        <ListColumns columns={orderedColumns} createNewColumn={createNewColumn} createNewCard={createNewCard}/>
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
