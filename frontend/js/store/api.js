import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000/api';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const api = {
  addRepository: (data) => axios.post(`/repositories/`, data),
};

export default api;
