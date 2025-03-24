import React from 'react';
import { useAtom } from 'jotai';
import { countAtom, doubleCountAtom } from '../../store/atoms';
import { Button } from '../shared/Button';

export const CounterExample: React.FC = () => {
  const [count, setCount] = useAtom(countAtom);
  const [doubleCount] = useAtom(doubleCountAtom);

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Counter Example with Jotai</h2>
      <div className="space-y-4">
        <p>Count: {count}</p>
        <p>Double Count: {doubleCount}</p>
        <div className="space-x-2">
          <Button onClick={() => setCount(c => c + 1)}>
            Increment
          </Button>
          <Button onClick={() => setCount(c => c - 1)}>
            Decrement
          </Button>
          <Button onClick={() => setCount(0)}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}; 