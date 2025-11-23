import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Advocates from './pages/Advocates';
import Judgements from './pages/Judgements';
import AIDrafting from './pages/AIDrafting';
import Store from './pages/Store';
import Profile from './pages/Profile';
import Quizzes from './pages/Quizzes';
import TakeQuiz from './pages/TakeQuiz';
import QuizResults from './pages/QuizResults';
import More from './pages/More';
import BareActs from './pages/BareActs';
import DraftingTemplates from './pages/DraftingTemplates';
import Education from './pages/Education';
import AdvocateDiary from './pages/AdvocateDiary';
import MootCourts from './pages/MootCourts';
import Internships from './pages/Internships';
import Jobs from './pages/Jobs';
import Scholarships from './pages/Scholarships';
import SearchResults from './pages/SearchResults';

// Placeholder components for other routes
const Placeholder = ({ title }) => (
  <div className="flex items-center justify-center h-96">
    <h1 className="text-3xl font-bold text-gray-400">{title} Coming Soon</h1>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="advocates" element={<Advocates />} />
              <Route path="judgements" element={<Judgements />} />
              <Route path="bare-acts" element={<BareActs />} />
              <Route path="drafting" element={<DraftingTemplates />} />
              <Route path="ai-drafting" element={<AIDrafting />} />
              <Route path="opportunities" element={<Placeholder title="Opportunities" />} />
              <Route path="education" element={<Education />} />
              <Route path="internships" element={<Internships />} />
              <Route path="jobs" element={<Jobs />} />
              <Route path="scholarships" element={<Scholarships />} />
              <Route path="diary" element={<AdvocateDiary />} />
              <Route path="more" element={<More />} />
              <Route path="competitions" element={<MootCourts />} />
              <Route path="quizzes" element={<Quizzes />} />
              <Route path="quizzes/:id" element={<TakeQuiz />} />
              <Route path="quizzes/:id/results" element={<QuizResults />} />
              <Route path="store" element={<Store />} />
              <Route path="profile" element={<Profile />} />
              <Route path="search" element={<SearchResults />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
