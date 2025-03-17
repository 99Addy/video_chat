import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './index.scss';
import './noteWidget.scss';
import './popup.scss';
import NotesWidget from './app';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<NotesWidget />} />
        {/* <Route path="/popup" element={<PopupWindow />} /> */}
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
