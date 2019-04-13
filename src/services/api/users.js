import { http } from './index';

export const listUsers = async () => {
  return await http.get(`user`);
};

export const createUser = async user => {
  return await http.post(`user`, user);
};

export const removeUser = async user => {
  return await http.delete(`user/${user._id}`, user);
};

export const updateUser = async user => {
  return await http.put(`user/${user._id}`, user);
};
