import React, {createContext} from "react";
import useMobile from "./use-mobile";

export const context = createContext<{ isMobile: boolean }>({isMobile: false}); //创建一个上下文context
const {Provider} = context; // Provider叫做数据提供器

function MobileProvider(props: { children: React.ReactNode }) {
  const {isMobile} = useMobile();
  //   把方法和属性都传过去，使用的地方可以通过方法修改context的值
  return <Provider value={{isMobile: isMobile}}>{props.children}</Provider>;
}

export default MobileProvider;
