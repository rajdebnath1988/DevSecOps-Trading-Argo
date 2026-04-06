import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useEffect, useRef, useState } from 'react';

interface StockUpdate {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

export const useMarketHub = () => {
  const [updates, setUpdates] = useState<Record<string, StockUpdate>>({});
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const wsUrl = process.env.REACT_APP_WS_URL || 'http://localhost:8080';

    const conn = new HubConnectionBuilder()
      .withUrl(`${wsUrl}/hubs/market`, { accessTokenFactory: () => token || '' })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(LogLevel.Warning)
      .build();

    conn.on('StockPriceUpdated', (update: StockUpdate) => {
      setUpdates(prev => ({ ...prev, [update.symbol]: update }));
    });

    conn.start().catch(console.error);
    connectionRef.current = conn;

    return () => { conn.stop(); };
  }, []);

  return { updates };
};
