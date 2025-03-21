import React, { useState } from 'react';
import { DollarSign, X } from 'lucide-react';
import type { GameState, TransactionCategory } from '../types';

interface FinancialModalProps {
  onClose: () => void;
  gameState: GameState;
}

const FinancialModal: React.FC<FinancialModalProps> = ({ onClose, gameState }) => {
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory | 'all'>('all');
  const [timeRange, setTimeRange] = useState<'month' | 'year'>('month');

  const categories: TransactionCategory[] = [
    'funding',
    'personnel',
    'facilities',
    'research',
    'equipment',
    'maintenance',
    'other'
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getFilteredTransactions = () => {
    if (!gameState?.financials?.transactions) return [];
    
    let filtered = gameState.financials.transactions;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }
    
    const now = new Date();
    const timeLimit = new Date();
    
    switch (timeRange) {
      case 'month':
        timeLimit.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        timeLimit.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return filtered.filter(t => t.date >= timeLimit);
  };

  const calculateBalance = () => {
    const transactions = getFilteredTransactions();
    return transactions.reduce((acc, t) => 
      acc + (t.type === 'income' ? t.amount : -t.amount), 0
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-[1000px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <DollarSign className="text-green-400" size={24} />
            <h2 className="text-2xl font-bold">Financial Overview</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-700 p-4 rounded-lg">
            <h3 className="text-sm text-slate-400 mb-1">Current Balance</h3>
            <p className="text-2xl font-bold">{formatCurrency(gameState?.funds ?? 0)}</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <h3 className="text-sm text-slate-400 mb-1">Monthly Income</h3>
            <p className="text-2xl font-bold text-green-400">
              {formatCurrency(gameState?.financials?.monthlyIncome ?? 0)}
            </p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <h3 className="text-sm text-slate-400 mb-1">Monthly Expenses</h3>
            <p className="text-2xl font-bold text-red-400">
              {formatCurrency(
                Object.values(gameState?.financials?.monthlyExpenses ?? {}).reduce((a, b) => a + b, 0)
              )}
            </p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <h3 className="text-sm text-slate-400 mb-1">Projected Balance</h3>
            <p className="text-2xl font-bold">{formatCurrency(gameState?.financials?.projectedBalance ?? 0)}</p>
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div className="bg-slate-700 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-4">Monthly Expenses Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(gameState?.financials?.monthlyExpenses ?? {}).map(([category, amount]) => (
              <div key={category} className="flex items-center">
                <div className="flex-1">
                  <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{
                        width: `${((amount / (gameState?.financials?.monthlyIncome ?? 1)) * 100)}%`
                      }}
                    />
                  </div>
                </div>
                <div className="ml-4 flex items-center justify-between" style={{ width: '200px' }}>
                  <span className="capitalize">{category}</span>
                  <span className="font-medium">{formatCurrency(amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Transaction History</h3>
            <div className="flex gap-2">
              <div className="flex items-center bg-slate-700 rounded-lg">
                <button
                  onClick={() => setTimeRange('month')}
                  className={`px-3 py-1 rounded-l-lg ${
                    timeRange === 'month' ? 'bg-blue-500' : 'hover:bg-slate-600'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setTimeRange('year')}
                  className={`px-3 py-1 rounded-r-lg ${
                    timeRange === 'year' ? 'bg-blue-500' : 'hover:bg-slate-600'
                  }`}
                >
                  Year
                </button>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as TransactionCategory | 'all')}
                className="bg-slate-700 rounded-lg px-3 py-1 border-none"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-slate-700 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-600">
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Description</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-right p-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredTransactions().map(transaction => (
                  <tr key={transaction.id} className="border-t border-slate-600">
                    <td className="p-3">
                      {transaction.date.toLocaleDateString()}
                    </td>
                    <td className="p-3">{transaction.description}</td>
                    <td className="p-3 capitalize">{transaction.category}</td>
                    <td className={`p-3 text-right ${
                      transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-600 font-semibold">
                  <td colSpan={3} className="p-3">Balance for selected period</td>
                  <td className={`p-3 text-right ${
                    calculateBalance() >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatCurrency(calculateBalance())}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialModal;