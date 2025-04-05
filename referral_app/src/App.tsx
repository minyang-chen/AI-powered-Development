import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import GeneratorPage from './pages/GeneratorPage';
import RecordsView from './components/RecordsView'; // Assuming RecordsView is in components
import ApiUsagePage from './pages/ApiUsagePage'; // Import the new page component
import StatisticsPage from './pages/StatisticsPage'; // Import the Statistics page component
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
        {/* Global Title and Logo Container */}
        <div className="flex justify-center items-center gap-x-3 mb-4"> {/* Centered flex container */}
          {/* Logo */}
          <img src="/vite.svg" alt="App Logo" className="h-10" /> {/* Adjusted height slightly */}
          {/* Title */}
          <h1 className="text-3xl font-extrabold text-gray-900"> {/* Removed text-center and mb-4 */}
            Referral Code Generator
          </h1>
        </div>
        {/* Navigation Tabs */}
        <nav className="mb-8 flex justify-center gap-x-6"> {/* Added justify-center back */}
          <NavLink to="/" className={navLinkClasses} end>
          | Generate Code |
          </NavLink>
          {/* Separator span removed */}
          <NavLink to="/records" className={navLinkClasses}>
            View Records | 
          </NavLink>
          {/* Added API Usage Link */}
          <NavLink to="/apiusage" className={navLinkClasses}>
            APIs |
          </NavLink>
          {/* Added Statistics Link */}
          <NavLink to="/statistics" className={navLinkClasses}>
            Statistics |
          </NavLink>
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<GeneratorPage />} />
            <Route path="/records" element={<RecordsView />} />
            <Route path="/apiusage" element={<ApiUsagePage />} /> {/* Add route for the new page */}
            <Route path="/statistics" element={<StatisticsPage />} /> {/* Route for Statistics page */}
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
