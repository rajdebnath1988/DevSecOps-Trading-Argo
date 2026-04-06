import React, { useEffect, useState } from 'react';
import { stocksAPI, portfolioAPI, marketAPI } from '../services/api';
import { useMarketHub } from '../hooks/useMarketHub';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const [stocks, setStocks] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [overview, setOverview] = useState<any>(null);
  const { updates } = useMarketHub();

  useEffect(() => {
    Promise.all([
      stocksAPI.getAll().then(r => setStocks(r.data)),
      portfolioAPI.getSummary().then(r => setPortfolio(r.data)),
      marketAPI.getOverview().then(r => setOverview(r.data)),
    ]).catch(console.error);
  }, []);

  // Merge real-time updates into stocks
  const liveStocks = stocks.map(s => ({
    ...s, ...(updates[s.symbol] || {})
  }));

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Market Overview Bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPICard title="Total Stocks" value={overview?.totalStocks} />
        <KPICard title="Gainers" value={overview?.gainers} color="green" />
        <KPICard title="Losers" value={overview?.losers} color="red" />
        <KPICard title="Portfolio Value"
          value={`$${portfolio?.totalPortfolioValue?.toFixed(2)}`} color="blue" />
      </div>

      {/* Stock Table */}
      <div className="bg-gray-800 rounded-xl p-4">
        <h2 className="text-xl font-bold mb-4">📊 Live Market</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="text-left py-2">Symbol</th>
              <th className="text-left">Name</th>
              <th className="text-right">Price</th>
              <th className="text-right">Change</th>
              <th className="text-right">Change %</th>
              <th className="text-right">Volume</th>
            </tr>
          </thead>
          <tbody>
            {liveStocks.map(stock => (
              <tr key={stock.symbol}
                className="border-b border-gray-700 hover:bg-gray-700 cursor-pointer">
                <td className="py-2 font-bold text-blue-400">{stock.symbol}</td>
                <td className="text-gray-300">{stock.name}</td>
                <td className="text-right font-mono">${stock.currentPrice?.toFixed(2)}</td>
                <td className={`text-right font-mono ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change?.toFixed(2)}
                </td>
                <td className={`text-right font-mono ${stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stock.changePercent?.toFixed(2)}%
                </td>
                <td className="text-right text-gray-400">
                  {(stock.volume / 1_000_000).toFixed(1)}M
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const KPICard: React.FC<{title: string; value: any; color?: string}> = ({ title, value, color = 'white' }) => (
  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
    <p className="text-gray-400 text-sm">{title}</p>
    <p className={`text-2xl font-bold text-${color}-400 mt-1`}>{value ?? '—'}</p>
  </div>
);

export default Dashboard;
