import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Advocates from './pages/Advocates';
import AIDrafting from './pages/AIDrafting';
import Store from './pages/Store';

// Placeholder components for other routes
const Placeholder = ({ title }) => (
  <div className="flex items-center justify-center h-96">
    <h1 className="text-3xl font-bold text-gray-400">{title} Coming Soon</h1>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="advocates" element={<Advocates />} />
          <Route path="judgements" element={<Placeholder title="Judgements Database" />} />
          <Route path="bare-acts" element={<Placeholder title="Bare Acts" />} />
          <Route path="drafting" element={<Placeholder title="Drafting Templates" />} />
          <Route path="ai-drafting" element={<AIDrafting />} />
          <Route path="opportunities" element={<Placeholder title="Opportunities" />} />
          <Route path="education" element={<Placeholder title="Educational Resources" />} />
          <Route path="internships" element={<Placeholder title="Internship Opportunities" />} />
          <Route path="diary" element={<Placeholder title="Advocate Diary" />} />
          <Route path="store" element={<Store />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
