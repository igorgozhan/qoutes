import './App.css';
import Socket from './Socket';
import Pinger from './Pinger';

function App() {
  return (
    <div className="App">
      <div className="task1">
        <h2>Эмулятор котировок</h2>
        <Socket di="1000"/>
      </div>
      <div className="task2">
        <h2>Пингователь</h2>
        <Pinger/>
      </div>
    </div>
  );
}

export default App;
