import axios from 'axios';

axios.defaults.baseURL = '/api';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const api = {
  addRepository: (data) => axios.post('/repositories/', data),
  addRepositoryPastMonthCommits: ({ repositoryId }) => {
    return axios.post(`/repositories/${repositoryId}/repository-commits/`, { days: 30 });
  },
  fetchAll: (model) => (params = {}) => axios.get(`/${model}/`, { params }),
};

export default api;
