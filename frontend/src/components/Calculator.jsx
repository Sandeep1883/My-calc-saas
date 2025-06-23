import React, { useState } from 'react';
import { useAuth, api } from '../App.tsx';
import { Calculator as CalcIcon, Delete, Equal } from 'lucide-react';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [expression, setExpression] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  const inputNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
    
    if (waitingForOperand) {
      setExpression(expression + num);
    } else {
      setExpression(expression === '0' ? String(num) : expression + num);
    }
  };

  const inputOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
    setExpression(expression + ` ${nextOperation} `);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = async () => {
    if (!expression.trim()) return;

    setLoading(true);
    setError('');

    try {
      const result = await api.calculate(expression);
      setDisplay(result.result);
      setExpression('');
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    } catch (error) {
      setError(error.message);
      setDisplay('Error');
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setExpression('');
    setError('');
  };

  const clearEntry = () => {
    setDisplay('0');
    setError('');
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      setExpression(expression + '0.');
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
      setExpression(expression + '.');
    }
  };

  const Button = ({ onClick, className = '', children, disabled = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        h-14 rounded-lg font-semibold text-lg transition-all duration-150
        active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CalcIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Calculator SaaS</h1>
        </div>
        {user ? (
          <p className="text-gray-600">Welcome back, {user.username}!</p>
        ) : (
          <p className="text-gray-600">
            <span className="text-blue-600">Sign in</span> to save your calculation history
          </p>
        )}
      </div>

      {/* Calculator */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        {/* Display */}
        <div className="mb-4">
          {/* Expression */}
          <div className="text-sm text-gray-500 h-6 text-right">
            {expression || ' '}
          </div>
          
          {/* Main Display */}
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-100">
            <div className="text-right text-3xl font-mono font-bold text-gray-800 min-h-[2.5rem] flex items-center justify-end">
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              ) : (
                display
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="text-red-500 text-sm mt-2 text-center">
              {error}
            </div>
          )}
        </div>

        {/* Button Grid */}
        <div className="grid grid-cols-4 gap-3">
          {/* First Row */}
          <Button
            onClick={clear}
            className="bg-red-500 hover:bg-red-600 text-white col-span-2"
          >
            Clear
          </Button>
          <Button
            onClick={clearEntry}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Delete className="w-5 h-5 mx-auto" />
          </Button>
          <Button
            onClick={() => inputOperation('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            ÷
          </Button>

          {/* Second Row */}
          <Button
            onClick={() => inputNumber(7)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            7
          </Button>
          <Button
            onClick={() => inputNumber(8)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            8
          </Button>
          <Button
            onClick={() => inputNumber(9)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            9
          </Button>
          <Button
            onClick={() => inputOperation('*')}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            ×
          </Button>

          {/* Third Row */}
          <Button
            onClick={() => inputNumber(4)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            4
          </Button>
          <Button
            onClick={() => inputNumber(5)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            5
          </Button>
          <Button
            onClick={() => inputNumber(6)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            6
          </Button>
          <Button
            onClick={() => inputOperation('-')}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            -
          </Button>

          {/* Fourth Row */}
          <Button
            onClick={() => inputNumber(1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            1
          </Button>
          <Button
            onClick={() => inputNumber(2)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            2
          </Button>
          <Button
            onClick={() => inputNumber(3)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            3
          </Button>
          <Button
            onClick={() => inputOperation('+')}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            +
          </Button>

          {/* Fifth Row */}
          <Button
            onClick={() => inputNumber(0)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 col-span-2"
          >
            0
          </Button>
          <Button
            onClick={inputDecimal}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            .
          </Button>
          <Button
            onClick={performCalculation}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Equal className="w-5 h-5 mx-auto" />
          </Button>
        </div>

        {/* Features Info */}
        <div className="mt-6 text-center">
          <div className="text-xs text-gray-500 space-y-1">
            <p>✨ Real-time calculations</p>
            {user ? (
              <p>📚 History saved automatically</p>
            ) : (
              <p>🔐 Sign up to save calculation history</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;