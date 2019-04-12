import { Lockers } from './Lockers/Lockers';
import { Users } from './Users/Users';

export default [
  { exact: true, path: '/', component: Lockers },
  { exact: true, path: '/config/users', component: Users }
];
