import React, { useState, useEffect } from 'react';
import { useAuth, api } from '../App.tsx';
import { History as HistoryIcon, Trash2, RefreshCw } from 'lucide-react';

const History = () => {
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState('');

  const { user } = useAuth();

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const history = await api.getHistory();
      setCalculations(history);
    } catch (error) {
      setError('Failed to load calculation history');
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear all calculation history?')) {
      return;
    }

    try {
      setClearing(true);
      await api.clearHistory();
      setCalculations([]);
    } catch (error) {
      setError('Failed to clear history');
    } finally {
      setClearing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <HistoryIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please sign in to view your calculation history.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HistoryIcon className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Calculation History</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={fetchHistory}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-300"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              {calculations.length > 0 && (
                <button
                  onClick={clearHistory}
                  disabled={clearing}
                  className="flex items-center space-x-2 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{clearing ? 'Clearing...' : 'Clear All'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading history...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">{error}</div>
              <button
                onClick={fetchHistory}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : calculations.length === 0 ? (
            <div className="text-center py-12">
              <HistoryIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No calculations yet</h3>
              <p className="text-gray-500">Start using the calculator to see your history here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {calculations.map((calc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <span className="font-mono text-lg text-gray-800">
                        {calc.expression} = {calc.result}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(calc.created_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;