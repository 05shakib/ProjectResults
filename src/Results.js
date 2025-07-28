import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'; // Correct way to import for React app

// Supabase Configuration (These will be set as Environment Variables in Vercel)
// These variables are injected by Vercel during the build process.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase = null; // Will be initialized once

// HomePage component defined at the top level
function HomePage() {
    return (
        <section className="bg-white p-8 rounded-lg shadow-md text-gray-800 text-center animate-fade-in-up">
            <h2 className="text-4xl font-extrabold mb-6 text-blue-700">Welcome to My Personal Page!</h2>
            <p className="text-lg mb-4 leading-relaxed">
                Hello! I am a 4th-year BBA Marketing student with a passion for understanding consumer behavior and developing innovative strategies. My academic background also includes a solid foundation in science, which has equipped me with strong analytical and problem-solving skills.
            </p>
            <p className="text-lg mb-6 leading-relaxed">
                I am proficient in Microsoft Office Suite, Canva, Python, and R, constantly seeking to expand my technical toolkit to better address complex business challenges.
            </p>
            <div className="mt-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-700">My Top Skills</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left mx-auto max-w-2xl">
                    <li className="flex items-center bg-blue-50 p-3 rounded-lg shadow-sm">
                        <svg className="w-6 h-6 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                        Sales Management
                    </li>
                    <li className="flex items-center bg-blue-50 p-3 rounded-lg shadow-sm">
                        <svg className="w-6 h-6 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                        Business Analysis
                    </li>
                    <li className="flex items-center bg-blue-50 p-3 rounded-lg shadow-sm">
                        <svg className="w-6 h-6 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                        Business Mathematics
                    </li>
                    <li className="flex items-center bg-blue-50 p-3 rounded-lg shadow-sm">
                        <svg className="w-6 h-6 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                        Competitive Analysis
                    </li>
                    <li className="flex items-center bg-blue-50 p-3 rounded-lg shadow-sm">
                        <svg className="w-6 h-6 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                        Cost Management
                    </li>
                    <li className="flex items-center bg-blue-50 p-3 rounded-lg shadow-sm">
                        <svg className="w-6 h-6 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                        Python & R
                    </li>
                    <li className="flex items-center bg-blue-50 p-3 rounded-lg shadow-sm">
                        <svg className="w-6 h-6 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                        Microsoft Office Suite
                    </li>
                    <li className="flex items-center bg-blue-50 p-3 rounded-lg shadow-sm">
                        <svg className="w-6 h-6 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                        Canva
                    </li>
                </ul>
            </div>
        </section>
    );
}

// StudentResultsPage component defined at the top level
function StudentResultsPage({ supabaseReady, supabaseError }) {
    const [studentIdInput, setStudentIdInput] = useState('');
    const [courseCodeInput, setCourseCodeInput] = useState('');
    const [semesterInput, setSemesterInput] = useState('');
    const [resultTypeInput, setResultTypeInput] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (supabaseReady) {
            addSampleData();
        }
    }, [supabaseReady]);

    const addSampleData = async () => {
        if (!supabase) {
            console.error("Supabase client is not initialized.");
            return;
        }
        try {
            // Check if data already exists to avoid duplication
            const { count, error: countError } = await supabase
                .from('student_results')
                .select('*', { count: 'exact', head: true });

            if (countError) {
                console.error("Error checking existing data:", countError.message);
                return;
            }

            if (count === 0) {
                const sampleData = [
                    { student_id: 'S001', student_name: 'Alice Smith', course_code: 'CS101', course_name: 'Intro to Programming', semester: 'Fall 2023', result_type: 'Midterm', score: 85, grade: 'B' },
                    { student_id: 'S001', student_name: 'Alice Smith', course_code: 'MA101', course_name: 'Calculus I', semester: 'Fall 2023', result_type: 'Final', score: 92, grade: 'A' },
                    { student_id: 'S002', student_name: 'Bob Johnson', course_code: 'CS101', course_name: 'Intro to Programming', semester: 'Fall 2023', result_type: 'Final', score: 78, grade: 'C' },
                    { student_id: 'S003', student_name: 'Charlie Brown', course_code: 'PH101', course_name: 'Physics I', semester: 'Spring 2024', result_type: 'Midterm', score: 95, grade: 'A' },
                    { student_id: 'S001', student_name: 'Alice Smith', course_code: 'CS101', course_name: 'Intro to Programming', semester: 'Fall 2023', result_type: 'Quiz 1', score: 80, grade: 'B' },
                    { student_id: 'S001', student_name: 'Alice Smith', course_code: 'MA101', course_name: 'Calculus I', semester: 'Fall 2023', result_type: 'Midterm', score: 88, grade: 'B+' }
                ];

                const { error } = await supabase
                    .from('student_results')
                    .insert(sampleData);

                if (error) {
                    console.error("Error inserting sample data:", error.message);
                } else {
                    console.log("Sample data added successfully.");
                }
            } else {
                console.log("Sample data already exists. Skipping insertion.");
            }
        } catch (error) {
            console.error("Supabase operation failed:", error.message);
        }
    };

    const fetchResults = async () => {
        if (!supabaseReady || !supabase) {
            setMessage('Supabase client not ready. Please check environment variables.');
            return;
        }

        setLoading(true);
        setMessage('');
        setResults([]);

        try {
            let query = supabase.from('student_results').select('*');

            if (studentIdInput) {
                query = query.ilike('student_id', `%${studentIdInput}%`);
            }
            if (courseCodeInput) {
                query = query.ilike('course_code', `%${courseCodeInput}%`);
            }
            if (semesterInput) {
                query = query.ilike('semester', `%${semesterInput}%`);
            }
            if (resultTypeInput) {
                query = query.ilike('result_type', `%${resultTypeInput}%`);
            }

            const { data, error } = await query;

            if (error) {
                setMessage(`Error fetching results: ${error.message}`);
                setResults([]);
            } else {
                setResults(data);
                if (data.length === 0) {
                    setMessage('No results found for the given criteria.');
                }
            }
        } catch (error) {
            setMessage(`An unexpected error occurred: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-white p-8 rounded-lg shadow-md text-gray-800 animate-fade-in-up">
            <h2 className="text-4xl font-extrabold mb-6 text-green-700 text-center">Student Results Dashboard</h2>

            {supabaseError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {supabaseError}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by Student ID (e.g., S001)"
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={studentIdInput}
                    onChange={(e) => setStudentIdInput(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Search by Course Code (e.g., CS101)"
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={courseCodeInput}
                    onChange={(e) => setCourseCodeInput(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Search by Semester (e.g., Fall 2023)"
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={semesterInput}
                    onChange={(e) => setSemesterInput(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Search by Result Type (e.g., Final)"
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={resultTypeInput}
                    onChange={(e) => setResultTypeInput(e.target.value)}
                />
            </div>

            <button
                onClick={fetchResults}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300 mb-6 shadow-md"
                disabled={loading}
            >
                {loading ? 'Searching...' : 'Search Results'}
            </button>

            {message && <p className="text-center text-gray-600 mb-4">{message}</p>}

            {results.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-300">
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Student ID</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Student Name</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Course Code</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Course Name</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Semester</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Result Type</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Score</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result, index) => (
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                                    <td className="py-3 px-4 text-sm text-gray-800">{result.student_id}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{result.student_name}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{result.course_code}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{result.course_name}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{result.semester}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{result.result_type}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{result.score}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{result.grade}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

// Main App component
function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [supabaseReady, setSupabaseReady] = useState(false);
    const [supabaseError, setSupabaseError] = useState(null);

    useEffect(() => {
        console.log("Vercel Environment Variables Check:");
        console.log("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl);
        console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "****** (present)" : "MISSING");

        if (!supabase && supabaseUrl && supabaseAnonKey) {
            try {
                supabase = createClient(supabaseUrl, supabaseAnonKey);
                setSupabaseReady(true);
                console.log("Supabase client initialized successfully.");
            } catch (e) {
                console.error("Failed to initialize Supabase client:", e.message);
                setSupabaseError(`Failed to connect to Supabase. Ensure environment variables are set correctly: ${e.message}`);
            }
        } else if (!supabaseUrl || !supabaseAnonKey) {
            const missingVars = [];
            if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
            if (!supabaseAnonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
            setSupabaseError(`Missing Supabase environment variables: ${missingVars.join(', ')}. Please configure them in Vercel.`);
            console.error("Missing Supabase environment variables. Cannot initialize client.");
        }
    }, []); // Empty dependency array to run only once

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            <style jsx global>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
                .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
            `}</style>

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