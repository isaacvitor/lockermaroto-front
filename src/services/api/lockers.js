import { http } from './index';

export const listLockers = async () => {
  return await http.get(`locker`);
};

export const updateRemoteUsers = async (lockerID, remoteUsers) => {
  return await http.put(`locker/${lockerID}/updateremoteusers`, remoteUsers);
};

export const updateEKeyUsers = async (lockerID, eKeyUsers) => {
  return await http.put(`locker/${lockerID}/updateekeyusers`, eKeyUsers);
};
