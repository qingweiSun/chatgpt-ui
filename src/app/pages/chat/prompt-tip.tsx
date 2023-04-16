import React, { useEffect, useRef, useState } from 'react';
import BotChatTextView from '@/view/chat/view/bot-chat-text-view';

export default function PromptTip(props: { children: string }) {
  const [text, setText] = useState('');
  const textRef = useRef('');
  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (textRef.current.length < props.children.length) {
        const nextChar = props.children[textRef.current.length];
        setText((prevText) => {
          textRef.current = prevText + nextChar;
          return prevText + nextChar;
        });
      } else {
        clearInterval(intervalId);
      }
    }, 50);

    return () => {
      clearInterval(intervalId);
    };
  }, [props.children]);
  return <BotChatTextView>{text}</BotChatTextView>;
}
