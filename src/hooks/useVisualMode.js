import { useState } from 'react'

export default function useVisualMode(initial){
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function (mode, replace) {
    setMode(mode);
    if (replace) {
      setHistory(prev => [mode, ...(prev.slice(1))]);
    } else {
      setHistory(prev => [mode, ...prev]);
    }
  }

  const back = function () {
    if (history.length > 1) {
      setMode(history[1]);
      setHistory(prev => prev.slice(1));
    }
  }

  return {
    mode,
    transition,
    back
  };
}