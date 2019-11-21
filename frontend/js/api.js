import axios from 'axios';

axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const ROOT_URL = 'http://localhost:8000/api';

export const repositoryAdd = (data) => axios.post(`${ROOT_URL}/repositories/`, data);
