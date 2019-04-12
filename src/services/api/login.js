import { http } from './index';

export const doLogin = async formLogin => {
  return await http.post(`login`, formLogin);
};
