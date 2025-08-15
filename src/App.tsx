import { useState } from 'react';
import './global.css';

interface CounterButtonProps {
  count: number;
  onClick: () => void;
}

const CounterButton = ({ count, onClick }: CounterButtonProps) => (
  <button 
    onClick={onClick}
    style={{
      fontSize: '18px',
      padding: '10px 20px',
      backgroundColor: '#007acc',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    }}
  >
    Count: {count}
  </button>
);

function App(): JSX.Element {
  const [count, setCount] = useState<number>(0);

  const handleIncrement = (): void => {
    setCount(prev => prev + 1);
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>React + Esbuild + TypeScript + HMR</h1>
      <div style={{ margin: '20px 0' }}>
        <CounterButton count={count} onClick={handleIncrement} />
      </div>
      <p>Edit <code>src/App.tsx</code> and save to test HMR with TypeScript!</p>
      <p>Try changing the button color or adding new features.</p>
    </div>
  );
}

export default App;