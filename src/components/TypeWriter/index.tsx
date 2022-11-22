import React, { FC, useState, useEffect, useMemo } from 'react';

const CONSTANTS = {
    DELETING_SPEED: 30,
    TYPING_SPEED: 50,
  }
  
export default function TypeWriter({ messages, style=undefined, end=undefined, callback }: {messages:any, style?:any, end:any, callback:any}) {
    const [state, setState] = useState({
      text: "",
      message: "",
      typingSpeed: CONSTANTS.TYPING_SPEED,
    });


    useEffect(() => {
      if(end) {
        setState(cs => ({
            ...cs,
            text: messages,
            typingSpeed: 0
        }));
        return;
      }
      let timer:any = "";
      const handleType = () => {
        setState(cs => ({
          ...cs,
          text: getCurrentText(cs),
          typingSpeed: CONSTANTS.TYPING_SPEED
        }));
        timer = setTimeout(handleType, state.typingSpeed);
      };
      handleType();
      return () => clearTimeout(timer);
    }, []);
  
    useEffect(() => {
        setState(cs => ({
            ...cs,
            isDeleting: false,
            message: messages
          }));
          
          if(state.text.length === messages.length){
            callback()
          }
    }, [state.text, state.message, messages]);
  
    function getCurrentText(currentState:any) {
      return currentState.message.substring(0, currentState.text.length + 1);
    }

  
  
    return (
      <div style={style}>
          <span>{state.text}</span>
          <span className="cursor" />
      </div>
    );
  }