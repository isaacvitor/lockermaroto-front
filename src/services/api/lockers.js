import { http } from './index';

export const listLockers = async () => {
  return await http.get(`locker`);
};

export const setKeyWith = async (id, keyWith) => {
  return await http.put(`locker/${id}`, keyWith);
};
