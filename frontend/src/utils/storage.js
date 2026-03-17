// Custom storage utility to handle same-tab updates
export const setItemWithEvent = (key, value) => {
  localStorage.setItem(key, value);
  
  // Dispatch a custom event for same-tab updates
  window.dispatchEvent(new CustomEvent('localStorageUpdated', {
    detail: { key, value }
  }));
};

export const removeItemWithEvent = (key) => {
  localStorage.removeItem(key);
  
  // Dispatch a custom event for same-tab updates
  window.dispatchEvent(new CustomEvent('localStorageUpdated', {
    detail: { key, removed: true }
  }));
};
