import { useEffect, useRef, useState } from 'react';

const useStateSync = <T>(
  initValue: T,
): [
  T,
  (newData: T, callF?: ((state: T) => void) | undefined) => Promise<T>,
] => {
  const ref = useRef<number>(0);
  const callFRef = useRef<((state: T) => void) | undefined>();
  const setFuncRef = useRef<
    | ((newData: T, callF?: ((state: T) => void) | undefined) => Promise<T>)
    | undefined
  >();
  const [state, setState] = useState<T>(initValue);
  if (!ref.current) {
    ref.current = 1;
    setFuncRef.current = (
      newData: T,
      callF?: ((state: T) => void) | undefined,
    ): Promise<T> => {
      callFRef.current = callF;
      setState(newData);
      return Promise.resolve(newData);
    };
  }
  useEffect(() => {
    callFRef.current?.(state);
  }, [state]);
  return [state, setFuncRef.current!];
};

export default useStateSync;

/**
 * demo
 * const [a, setA] = useStateSync(0);
 * setA(newA, (newState) => {
 *             console.log(newState);
 *           });
 * 或者
 * setTest(type).then((newState)=>{
 *     console.log("新值"+newState)
 * })
 *
 */
