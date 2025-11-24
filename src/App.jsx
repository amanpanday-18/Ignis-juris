import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './layouts/Layout';
import ProtectedRoute from './components/ProtectedRoute';
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
              {/* Public Routes */}
              <Route index element={<Home />} />

              {/* Protected Routes */}
              <Route path="advocates" element={<ProtectedRoute><Advocates /></ProtectedRoute>} />
              <Route path="judgements" element={<ProtectedRoute><Judgements /></ProtectedRoute>} />
              <Route path="bare-acts" element={<ProtectedRoute><BareActs /></ProtectedRoute>} />
              <Route path="drafting" element={<ProtectedRoute><DraftingTemplates /></ProtectedRoute>} />
              <Route path="ai-drafting" element={<ProtectedRoute><AIDrafting /></ProtectedRoute>} />
              <Route path="opportunities" element={<ProtectedRoute><Placeholder title="Opportunities" /></ProtectedRoute>} />
              <Route path="education" element={<ProtectedRoute><Education /></ProtectedRoute>} />
              <Route path="internships" element={<ProtectedRoute><Internships /></ProtectedRoute>} />
              <Route path="jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
              <Route path="scholarships" element={<ProtectedRoute><Scholarships /></ProtectedRoute>} />
              <Route path="diary" element={<ProtectedRoute><AdvocateDiary /></ProtectedRoute>} />
              <Route path="more" element={<ProtectedRoute><More /></ProtectedRoute>} />
              <Route path="competitions" element={<ProtectedRoute><MootCourts /></ProtectedRoute>} />
              <Route path="quizzes" element={<ProtectedRoute><Quizzes /></ProtectedRoute>} />
              <Route path="quizzes/:id" element={<ProtectedRoute><TakeQuiz /></ProtectedRoute>} />
              <Route path="quizzes/:id/results" element={<ProtectedRoute><QuizResults /></ProtectedRoute>} />
              <Route path="store" element={<ProtectedRoute><Store /></ProtectedRoute>} />
              <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="search" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
