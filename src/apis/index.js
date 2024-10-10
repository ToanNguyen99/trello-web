import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

// Không cần bắt try-catch khi dùng axios ở phía FE vì sẽ dư thừa catch, dùng Interceptors để catch lỗi tập trung
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  return response.data
}
