import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client only once
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [supabaseReady, setSupabaseReady] = useState(false);
  const [supabaseError, setSupabaseError] = useState(null);

  useEffect(() => {
    if (!supabase) {
      setSupabaseError("Failed to initialize Supabase. Check configuration.");
    } else {
      setSupabaseReady(true);
    }
  }, []);

  const HomePage = () => (
    <div className="p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg shadow-xl animate-fade-in">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-4 text-center">Welcome to My Personal Page!</h2>
      <p className="text-lg text-gray-700 leading-relaxed mb-6 text-center">
        Hello there! I'm excited to share a bit about myself and my projects.
        This page serves as a central hub for my work.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-2xl font-semibold text-blue-700 mb-3">About Me</h3>
          <p className="text-gray-600 mb-4">
            As a 4th-year BBA Marketing student, I bring a strong analytical foundation, honed through my science background, to understanding market dynamics. My passion lies at the intersection of technology and data, driving effective marketing strategies and solutions.
          </p>
          <p className="text-gray-600 mb-4">
            I am proficient in key marketing analytics and presentation tools, including Microsoft Office Suite (Excel, PowerPoint, Word, Access) and Canva. Furthermore, I possess primary to intermediary knowledge and skills in Python and R, which I'm keen to leverage for data manipulation, analysis, and visualization.
          </p>
          <p className="text-gray-600">
            I pride myself on being a self-starter and a quick learner, capable of taking initiative on individual projects while also contributing effectively within a responsible group environment. I'm actively seeking opportunities to apply my data-driven marketing insights and analytical skills in dynamic roles that leverage digital marketing, business intelligence, and advanced data tools to achieve strategic goals.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-2xl font-semibold text-purple-700 mb-3">Top Skills</h3>
          <ul className="list-disc list-inside text-gray-600">
            <li>Sales Management</li>
            <li>Business Analysis</li>
            <li>Business Mathematics</li>
            <li>Competitive Analysis</li>
            <li>Cost Management</li>
            <li>Python & R (Data Manipulation, Analysis, Visualization)</li>
            <li>Microsoft Office Suite (Excel, PowerPoint, Word, Access)</li>
            <li>Canva</li>
          </ul>
        </div>
      </div>
      <p className="text-center text-gray-600 mt-8 text-sm">
        Feel free to explore my projects, especially the "Student Results" section!
      </p>
    </div>
  );

  const StudentResultsPage = ({ supabaseReady, supabaseError }) => {
    const [studentIdInput, setStudentIdInput] = useState('');
    const [courseCodeInput, setCourseCodeInput] = useState('');
    const [semesterInput, setSemesterInput] = useState('');
    const [resultTypeInput, setResultTypeInput] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    const semesters = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5'];

    const handleSearch = async () => {
      if (!supabaseReady || !supabase) {
        setError("Supabase not ready.");
        return;
      }
      setLoading(true);
      setError(null);
      setResults([]);
      setMessage('');

      try {
        let queryBuilder = supabase.from('student_results').select('*');
        let hasFilter = false;

        if (studentIdInput.trim()) {
          queryBuilder = queryBuilder.eq('studentId', studentIdInput.trim().toUpperCase());
          hasFilter = true;
        }
        if (courseCodeInput.trim()) {
          queryBuilder = queryBuilder.eq('courseCode', courseCodeInput.trim().toUpperCase());
          hasFilter = true;
        }
        if (semesterInput) {
          queryBuilder = queryBuilder.eq('semester', semesterInput);
          hasFilter = true;
        }
        if (resultTypeInput) {
          queryBuilder = queryBuilder.eq('resultType', resultTypeInput);
          hasFilter = true;
        }

        if (!hasFilter) {
          setError("Please enter at least one search criterion.");
          setLoading(false);
          return;
        }

        const { data, error: fetchError } = await queryBuilder;
        if (fetchError) throw fetchError;

        const fetchedResults = data || [];
        fetchedResults.sort((a, b) => {
          if (a.studentId !== b.studentId) return a.studentId.localeCompare(b.studentId);
          const semAIndex = semesters.indexOf(a.semester);
          const semBIndex = semesters.indexOf(b.semester);
          if (semAIndex !== semBIndex) return semAIndex - semBIndex;
          return a.courseCode.localeCompare(b.courseCode);
        });

        if (fetchedResults.length > 0) {
          setResults(fetchedResults);
          setMessage('Results found!');
        } else {
          setMessage('No results found for the given criteria.');
        }
      } catch (e) {
        console.error("Error fetching results: ", e);
        setError(`Failed to fetch results: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (supabaseError) {
      return <div className="text-red-700 bg-red-100 p-4 rounded">{supabaseError}</div>;
    }
    if (!supabaseReady) {
      return <div className="text-blue-700 bg-blue-100 p-4 rounded animate-pulse">Initializing Supabase...</div>;
    }

    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Search Student Results</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input className="p-2 border rounded" placeholder="Student ID" value={studentIdInput} onChange={(e) => setStudentIdInput(e.target.value)} />
          <input className="p-2 border rounded" placeholder="Course Code" value={courseCodeInput} onChange={(e) => setCourseCodeInput(e.target.value)} />
          <select className="p-2 border rounded" value={semesterInput} onChange={(e) => setSemesterInput(e.target.value)}>
            <option value="">Select Semester</option>
            {semesters.map((sem) => <option key={sem} value={sem}>{sem}</option>)}
          </select>
          <select className="p-2 border rounded" value={resultTypeInput} onChange={(e) => setResultTypeInput(e.target.value)}>
            <option value="">Select Result Type</option>
            <option value="regular">Regular</option>
            <option value="improvement">Improvement</option>
          </select>
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className={`px-4 py-2 bg-green-600 text-white rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>

        {error && <p className="text-red-600 mt-4">{error}</p>}
        {message && <p className="text-green-600 mt-4">{message}</p>}

        {results.length > 0 && (
          <table className="mt-6 w-full text-left border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Student ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Course</th>
                <th className="p-2">Grade</th>
                <th className="p-2">Semester</th>
                <th className="p-2">GPA</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{result.studentId}</td>
                  <td className="p-2">{result.studentName}</td>
                  <td className="p-2">{result.courseName}</td>
                  <td className="p-2">{result.grade}</td>
                  <td className="p-2">{result.semester}</td>
                  <td className="p-2">{result.semesterGPA}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter p-4 sm:p-6 flex flex-col items-center">
      <header className="w-full max-w-4xl bg-white p-4 rounded-lg shadow-md mb-6 flex justify-center space-x-4">
        <button
          onClick={() => setCurrentPage('home')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            currentPage === 'home' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          My Personal Page
        </button>
        <button
          onClick={() => setCurrentPage('results')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            currentPage === 'results' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Student Results Project
        </button>
      </header>

      <main className="w-full max-w-4xl">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'results' && <StudentResultsPage supabaseReady={supabaseReady} supabaseError={supabaseError} />}
      </main>
    </div>
  );
}

export default App;
