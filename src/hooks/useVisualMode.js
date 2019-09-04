import { useState } from 'react'

export default function useVisualMode(initial){
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function (newMode) {
    setHistory(prev => [mode, ...prev]);
    setMode(newMode);
  }

  const back = function () {
    console.log("history[0]", history[0]);
    setMode(history[0]);
    setHistory(prev => prev.slice(1));
  }

  return {
    mode,
    transition,
    back
  };
}