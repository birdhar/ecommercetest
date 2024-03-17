export const clientFunction = () => {
  const serializedState = localStorage.getItem("store");
  if (serializedState === null) {
    return undefined;
  }
  return JSON.parse(serializedState);
};
