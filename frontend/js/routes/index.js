import HomeView from '../views/HomeView';
import CommitsListView from '../views/CommitsListView';

const routes = [
  {
    id: 0,
    path: '/',
    component: HomeView,
    title: 'Monitorar novo repositório',
    exact: true,
  },
  {
    id: 1,
    path: '/commits',
    component: CommitsListView,
    title: 'Lista de commits',
  },
];

export default routes;
