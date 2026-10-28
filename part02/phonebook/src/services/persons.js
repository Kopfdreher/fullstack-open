import axios from "axios";
const baseURL = "/api/persons";

const getAll = () => {
  const request = axios.get(baseURL);
  return request.then((response) => response.data);
};

const create = (personObject) => {
  const request = axios.post(baseURL, personObject);
  return request.then((response) => response.data);
};

const remove = (id) => {
  const request = axios.delete(`${baseURL}/${id}`);
  return request.then((response) => response.data);
};

const update = (personObject) => {
  const request = axios.put(`${baseURL}/${personObject.id}`, personObject);
  return request.then((response) => response.data);
};

export default { getAll, create, remove, update };
