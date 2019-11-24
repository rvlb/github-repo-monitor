import Home from '../pages/Home';
import CommitsList from '../pages/CommitsList';

const routes = [
  {
    id: 0,
    path: '/',
    component: Home,
    title: 'Monitorar novo repositório',
    exact: true,
  },
  {
    id: 1,
    path: '/commits',
    component: CommitsList,
    title: 'Lista de commits',
  },
];

export default routes;
