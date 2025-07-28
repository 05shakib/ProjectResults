import React, { useState, useEffect } from 'react';
// import { createClient } from '@supabase/supabase-js'; // Removed: Will load from CDN

// Supabase Configuration (These will be set as Environment Variables in Vercel)
// For local development, you can hardcode them here temporarily, but REMOVE for production!
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase Client
// Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your Vercel project environment variables.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase = null; // Will be initialized once

function App() {
    const [currentPage, setCurrentPage] = useState('home'); // 'home' or 'results'
    const [supabaseReady, setSupabaseReady] = useState(false);
    const [supabaseError, setSupabaseError] = useState(null);

    useEffect(() => {
        // Initialize Supabase only once after the script has loaded
        // Check if window.supabase exists (meaning the CDN script has loaded)
        if (!supabase && supabaseUrl && supabaseAnonKey && window.supabase) {
            try {
                supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
                setSupabaseReady(true);
                console.log("Supabase client initialized successfully.");
            } catch (error) {
                console.error("Error initializing Supabase client:", error);
                setSupabaseError("Failed to initialize Supabase. Please check your environment variables.");
            }
        } else if (!supabaseUrl || !supabaseAnonKey) {
            setSupabaseError("Supabase URL or Anon Key is missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.");
        }
    }, [supabaseReady]); // Depend on supabaseReady to re-check after script loads

    // Component for the personal homepage
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
                    <p className="text-gray-600">
                        I'm passionate about web development and creating useful applications.
                        I enjoy learning new technologies and solving problems through code.
                        In my free time, I love exploring new frameworks and contributing to open-source projects.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-2xl font-semibold text-purple-700 mb-3">My Skills</h3>
                    <ul className="list-disc list-inside text-gray-600">
                        <li>React.js & JavaScript</li>
                        <li>HTML5 & CSS3 (Tailwind CSS)</li>
                        <li>Supabase (PostgreSQL, APIs)</li>
                        <li>Git & Vercel Deployment</li>
                        <li>Problem Solving & Debugging</li>
                    </ul>
                </div>
            </div>
            <p className="text-center text-gray-600 mt-8 text-sm">
                Feel free to explore my projects, especially the "Student Results" section!
            </p>
        </div>
    );

    // Component for the student results project page
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
        const resultTypes = ['regular', 'improvement'];

        // Function to add sample data (for demonstration) - REMOVE OR COMMENT OUT IN PRODUCTION
        const addSampleData = async () => {
            if (!supabaseReady || !supabase) {
                setError("Supabase not ready.");
                return;
            }
            setLoading(true);
            setError(null);
            setMessage('');
            try {
                const sampleData = [
                    { studentId: 'S001', studentName: 'Alice Smith', batch: 'Batch2023', semester: 'Semester 1', resultType: 'regular', courseCode: '101', courseName: 'Intro to Programming', grade: 'A', analysis: 'Excellent understanding of algorithms.', hall: 'Hall A', semesterGPA: '3.8' },
                    { studentId: 'S001', studentName: 'Alice Smith', batch: 'Batch2023', semester: 'Semester 1', resultType: 'regular', courseCode: '102', courseName: 'Data Structures', grade: 'B+', analysis: 'Good grasp of concepts.', hall: 'Hall A', semesterGPA: '3.8' },
                    { studentId: 'S002', studentName: 'Bob Johnson', batch: 'Batch2023', semester: 'Semester 1', resultType: 'regular', courseCode: '101', courseName: 'Intro to Programming', grade: 'B', analysis: 'Needs more coding practice.', hall: 'Hall B', semesterGPA: '3.2' },
                    { studentId: 'S003', studentName: 'Charlie Brown', batch: 'Batch2022', semester: 'Semester 3', resultType: 'improvement', courseCode: '101', courseName: 'Intro to Programming', grade: 'B+', analysis: 'Much better grasp of concepts.', hall: 'Hall C', semesterGPA: '2.9' },
                    { studentId: 'S003', studentName: 'Charlie Brown', batch: 'Batch2022', semester: 'Semester 3', resultType: 'improvement', courseCode: '102', courseName: 'Data Structures', grade: 'A-', analysis: 'Strong problem-solving.', hall: 'Hall C', semesterGPA: '2.9' },
                    { studentId: 'S004', studentName: 'Diana Prince', batch: 'Batch2023', semester: 'Semester 2', resultType: 'regular', courseCode: '201', courseName: 'Algorithms', grade: 'A+', analysis: 'Exceptional problem-solving skills.', hall: 'Hall D', semesterGPA: '3.9' },
                ];

                // Check if data already exists to prevent duplicates on every load
                const { data: existingData, error: checkError } = await supabase
                    .from('student_results')
                    .select('studentId')
                    .eq('studentId', 'S001')
                    .limit(1);

                if (checkError) throw checkError;

                if (existingData.length === 0) {
                    const { error: insertError } = await supabase
                        .from('student_results')
                        .insert(sampleData);

                    if (insertError) throw insertError;
                    setMessage('Sample data added successfully to the "student_results" table!');
                } else {
                    setMessage('Sample data already exists in "student_results" table. Skipping insertion.');
                }
            } catch (e) {
                console.error("Error adding sample data: ", e);
                setError(`Failed to add sample data: ${e.message}`);
            } finally {
                setLoading(false);
            }
        };

        // Add sample data when component mounts and Supabase is ready
        useEffect(() => {
            if (supabaseReady && supabase) {
                addSampleData();
            }
        }, [supabaseReady]); // Depend on supabaseReady

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

                if (studentIdInput) {
                    queryBuilder = queryBuilder.eq('studentId', studentIdInput.toUpperCase());
                    hasFilter = true;
                }
                if (courseCodeInput) {
                    queryBuilder = queryBuilder.eq('courseCode', courseCodeInput.toUpperCase());
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
                    setError("Please enter at least one search criterion (Student ID, Course Code, Semester, or Result Type).");
                    setLoading(false);
                    return;
                }

                const { data, error: fetchError } = await queryBuilder;

                if (fetchError) throw fetchError;

                const fetchedResults = data || [];

                // Sort results for consistent display (e.g., by studentId, then semester, then courseCode)
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
                console.error("Error fetching documents: ", e);
                setError(`Failed to fetch results: ${e.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (supabaseError) {
            return (
                <div className="text-center p-6 bg-red-100 text-red-700 rounded-lg shadow-md">
                    <p className="text-xl font-semibold mb-2">Supabase Error:</p>
                    <p>{supabaseError}</p>
                    <p className="text-sm mt-4">Please ensure your Supabase URL and Anon Key are correctly set as environment variables.</p>
                </div>
            );
        }

        if (!supabaseReady) {
            return (
                <div className="text-center p-6 bg-blue-100 text-blue-700 rounded-lg shadow-md animate-pulse">
                    <p className="text-xl font-semibold">Initializing Supabase...</p>
                    <p className="text-sm mt-2">This might take a moment.</p>
                </div>
            );
        }

        return (
            <div className="p-6 bg-gradient-to-br from-green-100 to-teal-100 rounded-lg shadow-xl animate-fade-in">
                <h2 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">Student Results & Analysis</h2>
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <p className="text-sm text-gray-600 mb-4">
                        <span className="font-semibold">Note:</span> This app connects to your Supabase database.
                        Ensure your `student_results` table is set up and populated.
                    </p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label htmlFor="studentId" className="block text-gray-700 text-sm font-bold mb-2">
                                Student ID (e.g., S001)
                            </label>
                            <input
                                type="text"
                                id="studentId"
                                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={studentIdInput}
                                onChange={(e) => setStudentIdInput(e.target.value)}
                                placeholder="Enter Student ID"
                            />
                        </div>
                        <div>
                            <label htmlFor="courseCode" className="block text-gray-700 text-sm font-bold mb-2">
                                Course Code (e.g., 101)
                            </label>
                            <input
                                type="text"
                                id="courseCode"
                                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={courseCodeInput}
                                onChange={(e) => setCourseCodeInput(e.target.value)}
                                placeholder="Enter Course Code"
                            />
                        </div>
                        <div>
                            <label htmlFor="semester" className="block text-gray-700 text-sm font-bold mb-2">
                                Semester
                            </label>
                            <select
                                id="semester"
                                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={semesterInput}
                                onChange={(e) => setSemesterInput(e.target.value)}
                            >
                                <option value="">Select Semester</option>
                                {semesters.map(sem => (
                                    <option key={sem} value={sem}>{sem}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="resultType" className="block text-gray-700 text-sm font-bold mb-2">
                                Result Type
                            </label>
                            <select
                                id="resultType"
                                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
                                value={resultTypeInput}
                                onChange={(e) => setResultTypeInput(e.target.value)}
                            >
                                <option value="">Select Type</option>
                                {resultTypes.map(type => (
                                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={handleSearch}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                        disabled={loading}
                    >
                        {loading ? 'Searching...' : 'Search Results'}
                    </button>
                    {error && (
                        <p className="text-red-500 text-center mt-4 p-2 bg-red-100 border border-red-400 rounded-lg">{error}</p>
                    )}
                    {message && !error && (
                        <p className="text-green-600 text-center mt-4 p-2 bg-green-100 border border-green-400 rounded-lg">{message}</p>
                    )}
                </div>

                {results.length > 0 && (
                    <div className="bg-white p-6 rounded-lg shadow-md mt-6 animate-fade-in-up">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Search Results:</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-inner">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider rounded-tl-lg">Student ID</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Student Name</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Batch</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Semester</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Result Type</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Course Code</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Course Name</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Grade</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Hall</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider rounded-tr-lg">Semester GPA</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Analysis</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((result, index) => (
                                        <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors duration-200`}>
                                            <td className="py-3 px-4 border-b border-gray-200 text-gray-800">{result.studentId}</td>
                                            <td className="py-3 px-4 border-b border-gray-200 text-gray-800">{result.studentName}</td>
                                            <td className="py-3 px-4 border-b border-gray-200 text-gray-800">{result.batch}</td>
                                            <td className="py-3 px-4 border-b border-gray-200 text-gray-800">{result.semester}</td>
                                            <td className="py-3 px-4 border-b border-gray-200 text-gray-800">{result.resultType}</td>
                                            <td className="py-3 px-4 border-b border-gray-200 text-gray-800">{result.courseCode}</td>
                                            <td className="py-3 px-4 border-b border-gray-200 text-gray-800">{result.courseName}</td>
                                            <td className="py-3 px-4 border-b border-gray-200 text-gray-800 font-bold">{result.grade}</td>
                                            <td className="py-3 px-4 border-b border-gray-200 text-gray-800">{result.hall}</td>
                                            <td className="py-3 px-4 border-b border-gray-200 text-gray-800">{result.semesterGPA}</td>
                                            <td className="py-3 px-4 border-b border-gray-200 text-gray-700 text-sm">{result.analysis}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 font-inter p-4 sm:p-6 flex flex-col items-center">
            {/* Tailwind CSS CDN */}
            <script src="https://cdn.tailwindcss.com"></script>
            {/* Google Font - Inter */}
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
            {/* Supabase JS Client CDN */}
            <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

            <style>
                {`
                body {
                    font-family: 'Inter', sans-serif;
                }
                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out forwards;
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.8s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                `}
            </style>

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
