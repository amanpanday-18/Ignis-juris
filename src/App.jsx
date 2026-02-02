import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import DocumentViewer from './pages/DocumentViewer';
import Store from './pages/Store';
import Profile from './pages/Profile';
import Quizzes from './pages/Quizzes';
import TakeQuiz from './pages/TakeQuiz';
import QuizResults from './pages/QuizResults';
import More from './pages/More';
import Education from './pages/Education';
import MootCourts from './pages/MootCourts';
import Internships from './pages/Internships';
import Jobs from './pages/Jobs';
import Scholarships from './pages/Scholarships';
import SearchResults from './pages/SearchResults';
import ProtectedRoute from './components/ProtectedRoute';
import UsageTracker from './components/UsageTracker';

import Opportunities from './pages/Opportunities';

// Placeholder component removed

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <UsageTracker />
        <Router>
          <Routes>

            <Route path="/documents/:id" element={<ProtectedRoute><DocumentViewer /></ProtectedRoute>} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />

              <Route path="opportunities" element={<ProtectedRoute><Opportunities /></ProtectedRoute>} />
              <Route path="education" element={<ProtectedRoute><Education /></ProtectedRoute>} />
              <Route path="internships" element={<ProtectedRoute><Internships /></ProtectedRoute>} />
              <Route path="jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
              <Route path="scholarships" element={<ProtectedRoute><Scholarships /></ProtectedRoute>} />

              <Route path="more" element={<ProtectedRoute><More /></ProtectedRoute>} />
              <Route path="competitions" element={<ProtectedRoute><MootCourts /></ProtectedRoute>} />
              <Route path="quizzes" element={<ProtectedRoute><Quizzes /></ProtectedRoute>} />
              <Route path="quizzes/:id" element={<ProtectedRoute><TakeQuiz /></ProtectedRoute>} />
              <Route path="quizzes/:id/results" element={<ProtectedRoute><QuizResults /></ProtectedRoute>} />
              <Route path="store" element={<ProtectedRoute><Store /></ProtectedRoute>} />
              <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="search" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
