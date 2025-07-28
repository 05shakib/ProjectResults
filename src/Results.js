import React, { useState, useEffect } from 'react'; // Corrected: changed '=>' to 'from'
import { createClient } from '@supabase/supabase-js'; // Correct way to import for React app

// Supabase Configuration (These will be set as Environment Variables in Vercel)
// These variables are injected by Vercel during the build process.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase = null; // Will be initialized once

// Standard function definition for the main App component (which is Results.js)
function App() {
    const [currentPage, setCurrentPage] = useState('home'); // 'home' or 'results'
    const [supabaseReady, setSupabaseReady] = useState(false);
    const [supabaseError, setSupabaseError] = useState(null);

    useEffect(() => {
        // Log environment variables for debugging
        console.log("Vercel Environment Variables Check:");
        console.log("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl);
        console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "****** (present)" : "MISSING"); // Mask key for security

        // Initialize Supabase only once when URL and Key are available
        if (!supabase && supabaseUrl && supabaseAnonKey) {
            try {
                supabase = createClient(supabaseUrl, supabaseAnonKey); // Use createClient from the import
                setSupabaseReady(true);
                console.log("Supabase client initialized successfully.");
            } catch (error) {
                console.error("Error initializing Supabase client:", error);
                setSupabaseError("Failed to initialize Supabase. Please check your environment variables.");
            }
        } else if (!supabaseUrl || !supabaseAnonKey) {
            setSupabaseError("Supabase URL or Anon Key is missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.");
        }
    }, [supabaseReady, supabaseUrl, supabaseAnonKey]); // Depend on these to re-check if they become available

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

        // Function to add sample data (for demonstration)
        // IMPORTANT: For production, once your data is imported via CSV,
        // you should REMOVE or COMMENT OUT this entire addSampleData function
        // and its useEffect call to prevent unnecessary database writes on every load.
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
            <div className="min-h-screen bg-gray-50 font-inter p-4 sm:p-6 flex flex-col items-center">
                {/* Tailwind CSS CDN */}
                <script src="https://cdn.tailwindcss.com"></script>
                {/* Google Font - Inter */}
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />

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
    };