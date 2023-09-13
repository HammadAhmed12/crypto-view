import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/login';
import Signup from './pages/signup';
import OrderBook from './pages/orderBook';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/dashboard" element={<OrderBook/>}/>
        <Route path="/" element={<Signup/>}/>
      </Routes>
    </Router>
  );
}

export default App;
