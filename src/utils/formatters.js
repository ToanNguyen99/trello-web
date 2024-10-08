// Capitalize the first letter of a string

export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

/**
 * Video 37.2: xử lý thư viện khi data column rỗng
 * Phía FE sẽ tự tạo ra một card đặt biệt: PlacerholderCard không liên quan tới BackEnd
 * Card đặt biệt này sẽ được ẩn ở giao diện UI người dùng
 * Cấu trúc Id của cái card này để unique rất đơn giản, không cần phải làm random phức tạp
 * "columnId-Placerholder-Card" mỗi column chỉ chứa tối đa 1 cái placeholder card
 * quan trọng khi tạo phải có đầy đủ _id, boardId, columnId, FE_PlaceholderCard
 */
export const generatePlacehoderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}