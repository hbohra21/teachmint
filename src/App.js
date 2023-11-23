import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserList from './Views/UserList';
import UserDetails from './Views/UserDetails';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route index path="/" Component={UserList} />
          <Route path="/user/:id" Component={UserDetails} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
