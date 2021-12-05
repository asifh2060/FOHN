import { useEffect, useState } from 'react';
import { useDarkMode } from 'react-native-dynamic'

export function useScreenWidth(): number {
  const [width, setWidth] = useState(useDarkMode());

  useEffect(() => {
   
  }, []);

  return width;
}