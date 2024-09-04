import './App.css';
import { Route, Routes } from 'react-router-dom';
import Payment from './components/Payment/Payment';
import HomePage from './components/homePage/HomePage';
import LoginForm from './components/authComponents/loginComponent/LoginForm';

function App() {
  return (
    <>
   <Routes>
   <Route exact path='/' element={<HomePage/>}/>
   <Route exact path='/login' element={<LoginForm/>}/>
      <Route exact path='/policy-payment' element={<Payment/>}/>
   </Routes>
    </>
  );
}

export default App;
