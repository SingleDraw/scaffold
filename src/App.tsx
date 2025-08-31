import { useState } from 'react';
import './global.css';
import styles from './App.module.scss';

interface CounterButtonProps {
  count: number;
  onClick: () => void;
}

const CounterButton = ({ count, onClick }: CounterButtonProps) => (
  <button 
    onClick={onClick}
    className={styles.button}
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
      <h1>React Scaffold</h1>
      <h2>Esbuild + TypeScript + HMR + SCSS Modules</h2>
      <div style={{ margin: '20px 0' }}>
        <CounterButton count={count} onClick={handleIncrement} />
      </div>
      <p>Edit <code>src/App.tsx</code> and save to test HMR with TypeScript!</p>
      <p>Try changing the button color or adding new features.</p>
    </div>
  );
}

export default App;