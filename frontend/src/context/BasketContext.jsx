import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'sonner';

const BasketContext = createContext(null);

export const BasketProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const add = useCallback((stone) => {
    let added = false;
    setItems(prev => {
      if (prev.find(s => s.id === stone.id)) return prev;
      added = true;
      return [...prev, stone];
    });
    if (added) toast.success(`${stone.stock_id} added to enquiry`);
    else toast.info(`${stone.stock_id} already in basket`);
  }, []);
  const remove = useCallback((id) => setItems(prev => prev.filter(s => s.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);
  const has = useCallback((id) => items.some(s => s.id === id), [items]);

  return <BasketContext.Provider value={{ items, add, remove, clear, has }}>{children}</BasketContext.Provider>;
};

export const useBasket = () => useContext(BasketContext);
