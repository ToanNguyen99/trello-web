import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

// Không cần bắt try-catch khi dùng axios ở phía FE vì sẽ dư thừa catch, dùng Interceptors để catch lỗi tập trung
// Hiểu đơn giản Interceptors là cách mà chúng ta sẽ đánh chặn vào giữa request và response để xử lý logic mà chúng ta muốn
// For Boards
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  return response.data
}
// Column
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}
// Cards
export const createNewCardAPI = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
  return response.data
}