import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = newToken ? `Bearer ${newToken}` : null
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (updatedObject) => {
  const { id, user, likes, author, title, url } = updatedObject
  const response = await axios
    .put(`${baseUrl}/${id}`, {
      user: user?.id || user?._id || user || null,
      likes,
      author,
      title,
      url,
    })
  return response.data
}

export default { getAll, setToken, create, update }
