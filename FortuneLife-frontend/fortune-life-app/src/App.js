import './App.css';
import { Route, Routes } from 'react-router-dom';
import Payment from './components/Payment/Payment';

function App() {
  return (
    <>
   <Routes>
      <Route exact path='/policy-payment' element={<Payment/>}/>
   </Routes>
    </>
  );
}

export default App;
