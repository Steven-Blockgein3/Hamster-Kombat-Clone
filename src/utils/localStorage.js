const LOCAL_STORAGE_KEY = 'telegramWebAppData';

export const getLocalStorageData = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

export const setLocalStorageData = (data) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
};

export const updateLocalStorageData = (updatedData) => {
  const currentData = getLocalStorageData() || {};
  const newData = { ...currentData, ...updatedData };
  setLocalStorageData(newData);
  return newData;
};

export const getUser = () => {
  return getLocalStorageData()?.user || null;
};

export const setUser = (userData) => {
  const currentData = getLocalStorageData() || {};
  const newData = { ...currentData, user: userData };
  setLocalStorageData(newData);
};

export const updateUser = (updatedUserData) => {
  const currentUser = getUser() || {};
  const newUser = { ...currentUser, ...updatedUserData };
  setUser(newUser);
  return newUser;
};

export const getTasks = () => {
  return getLocalStorageData()?.tasks || [];
};

export const setTasks = (tasks) => {
  const currentData = getLocalStorageData() || {};
  const newData = { ...currentData, tasks };
  setLocalStorageData(newData);
};

export const getLeaderboard = () => {
  return getLocalStorageData()?.leaderboard || [];
};

export const setLeaderboard = (leaderboard) => {
  const currentData = getLocalStorageData() || {};
  const newData = { ...currentData, leaderboard };
  setLocalStorageData(newData);
};
