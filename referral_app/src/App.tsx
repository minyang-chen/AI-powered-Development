import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import GeneratorPage from './pages/GeneratorPage';
import RecordsView from './components/RecordsView'; // Assuming RecordsView is in components

function App() {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${
      isActive
        ? 'bg-indigo-600 text-white shadow-md'
        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
    }`;

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col pt-8 px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <nav className="mb-8 flex justify-center gap-x-6"> {/* Use gap for spacing */}
          <NavLink to="/" className={navLinkClasses} end>
           | Generate Code |
          </NavLink>
          {/* Separator span removed */}
          <NavLink to="/records" className={navLinkClasses}>
            | View Records |
          </NavLink>
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<GeneratorPage />} />
            <Route path="/records" element={<RecordsView />} />
            {/* Add other routes here if needed */}
          </Routes>
        </main>

        {/* Optional Footer */}
        <footer className="text-center py-4 text-gray-500 text-sm mt-8">
          Referral App &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </Router>
  );
}

export default App;
