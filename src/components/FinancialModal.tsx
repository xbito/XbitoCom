import React, { useState } from 'react';
import { DollarSign, X, TrendingUp, TrendingDown, Calendar, Filter, ArrowDown, ArrowUp, BarChart4 } from 'lucide-react';
import type { GameState, TransactionCategory } from '../types';

interface FinancialModalProps {
  onClose: () => void;
  gameState: GameState;
}

const FinancialModal: React.FC<FinancialModalProps> = ({ onClose, gameState }) => {
  // Simple runtime validation
  if (!gameState) throw new Error('GameState must be provided');
  if (typeof onClose !== 'function') throw new Error('onClose must be a function');

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
    try {
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
    } catch (error) {
      console.error("Error in getFilteredTransactions:", error);
      return [];
    }
  };

  const calculateBalance = () => {
    try {
      const transactions = getFilteredTransactions();
      return transactions.reduce((acc, t) => 
        acc + (t.type === 'income' ? t.amount : -t.amount), 0
      );
    } catch (error) {
      console.error("Error in calculateBalance:", error);
      return 0;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg p-6 w-[1000px] max-h-[80vh] overflow-y-auto border border-slate-700 shadow-xl">
        <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-green-700 to-green-500 p-2 rounded-lg">
              <DollarSign className="text-slate-100" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">Financial Overview</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-green-400 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-lg border border-slate-700 shadow-md">
            <h3 className="text-sm text-slate-400 mb-1 flex items-center">
              <BarChart4 size={14} className="mr-1" /> Current Balance
            </h3>
            <p className="text-2xl font-bold text-slate-100">{formatCurrency(gameState?.funds ?? 0)}</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-lg border border-slate-700 shadow-md">
            <h3 className="text-sm text-slate-400 mb-1 flex items-center">
              <TrendingUp size={14} className="mr-1" /> Monthly Income
            </h3>
            <p className="text-2xl font-bold text-green-400">
              {formatCurrency(gameState?.financials?.monthlyIncome ?? 0)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-lg border border-slate-700 shadow-md">
            <h3 className="text-sm text-slate-400 mb-1 flex items-center">
              <TrendingDown size={14} className="mr-1" /> Monthly Expenses
            </h3>
            <p className="text-2xl font-bold text-red-400">
              {formatCurrency(
                Object.values(gameState?.financials?.monthlyExpenses ?? {}).reduce((a, b) => a + b, 0)
              )}
            </p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-lg border border-slate-700 shadow-md">
            <h3 className="text-sm text-slate-400 mb-1 flex items-center">
              <Calendar size={14} className="mr-1" /> Projected Balance
            </h3>
            <p className="text-2xl font-bold text-slate-100">{formatCurrency(gameState?.financials?.projectedBalance ?? 0)}</p>
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-lg mb-6 border border-slate-700 shadow-md">
          <h3 className="font-semibold mb-4 text-slate-100">Monthly Expenses Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(gameState?.financials?.monthlyExpenses ?? {}).map(([category, amount]) => (
              <div key={category} className="flex items-center">
                <div className="flex-1">
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-700 to-green-500"
                      style={{
                        width: `${((amount / (gameState?.financials?.monthlyIncome ?? 1)) * 100)}%`
                      }}
                    />
                  </div>
                </div>
                <div className="ml-4 flex items-center justify-between" style={{ width: '200px' }}>
                  <span className="capitalize text-slate-300">{category}</span>
                  <span className="font-medium text-slate-100">{formatCurrency(amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-100">Transaction History</h3>
            <div className="flex gap-2">
              <div className="flex items-center rounded-lg overflow-hidden">
                <button
                  onClick={() => setTimeRange('month')}
                  className={`px-3 py-1 transition-colors ${
                    timeRange === 'month' 
                      ? 'bg-gradient-to-br from-green-700 to-green-600 text-white' 
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setTimeRange('year')}
                  className={`px-3 py-1 transition-colors ${
                    timeRange === 'year' 
                      ? 'bg-gradient-to-br from-green-700 to-green-600 text-white' 
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  Year
                </button>
              </div>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as TransactionCategory | 'all')}
                  className="bg-slate-800 rounded-lg px-3 py-1 border border-slate-700 text-slate-300 appearance-none pr-8 focus:border-green-500 focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <Filter size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-md">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800">
                  <th className="text-left p-3 text-slate-300 font-medium">Date</th>
                  <th className="text-left p-3 text-slate-300 font-medium">Description</th>
                  <th className="text-left p-3 text-slate-300 font-medium">Category</th>
                  <th className="text-right p-3 text-slate-300 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredTransactions().map(transaction => (
                  <tr key={transaction.id} className="border-t border-slate-700 hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 text-slate-300">
                      {transaction.date.toLocaleDateString()}
                    </td>
                    <td className="p-3 text-slate-300">{transaction.description}</td>
                    <td className="p-3 capitalize text-slate-300">{transaction.category}</td>
                    <td className={`p-3 text-right flex justify-end items-center ${
                      transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.type === 'income' 
                        ? <ArrowUp size={16} className="mr-1" /> 
                        : <ArrowDown size={16} className="mr-1" />
                      }
                      {formatCurrency(Math.abs(transaction.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-800 font-semibold">
                  <td colSpan={3} className="p-3 text-slate-100">Balance for selected period</td>
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