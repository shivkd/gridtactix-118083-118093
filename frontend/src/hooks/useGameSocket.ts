import { useEffect, useRef, useState, useCallback } from 'react';
import { BackendEvent, GameState, WsAction } from '../types';

type UseGameSocketResult = {
  state: GameState | null;
  error: string | null;
  sendAction: (action: WsAction) => void;
};

// PUBLIC_INTERFACE
export function useGameSocket(gameId: string): UseGameSocketResult {
  const [state, setState] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl =
      (window.location.protocol === 'https:' ? 'wss://' : 'ws://') +
      window.location.hostname +
      ':3001/ws/games/' +
      encodeURIComponent(gameId);
    let ws: WebSocket;
    try {
      ws = new window.WebSocket(wsUrl);
      wsRef.current = ws;
    } catch (e) {
      setError('WebSocket connection failed.');
      return;
    }

    ws.onopen = () => setError(null);
    ws.onclose = () => setError('Lost connection to server.');
    ws.onerror = () => setError('WebSocket error occurred.');

    ws.onmessage = (ev: MessageEvent) => {
      let msg: BackendEvent;
      try {
        msg = JSON.parse(ev.data);
      } catch {
        setError('Malformed server message.');
        return;
      }
      if (msg.event === 'update') {
        setState(msg.state);
      } else if (msg.event === 'error') {
        setError(msg.message);
      }
      // Gameover handled by UI via state.winner
    };

    return () => {
      ws?.close();
    };
  }, [gameId]);

  // PUBLIC_INTERFACE
  const sendAction = useCallback(
    (_action: WsAction) => {
      const ws = wsRef.current;
      if (ws && ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(_action));
      }
    },
    [wsRef]
  );

  return { state, error, sendAction };
}
