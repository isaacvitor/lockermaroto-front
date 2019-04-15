import { Lockers } from './Lockers/Lockers';
import { LockersConfig } from './Lockers/LockersConfig';
import { UsersConfig } from './Users/UsersConfig';

export default [
  { exact: true, path: '/', component: Lockers },
  { exact: true, path: '/config/lockers', component: LockersConfig },
  { exact: true, path: '/config/users', component: UsersConfig }
];
