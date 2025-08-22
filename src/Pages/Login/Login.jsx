import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../provider/AuthProvider';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {getAuth, GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
const auth = getAuth();
const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const GoogleProvider= new GoogleAuthProvider();
    const GithubProvider = new GithubAuthProvider();
    const from = location.state?.from?.pathname || '/';

    const handleGoogleSignIn = () => {
        signInWithPopup(auth, GoogleProvider)
            .then((result) => { 
                const user = result.user;
                console.log('Google Sign In Success:', user);
                console.log('User email:', user.email);
                console.log('User name:', user.displayName);
                
                toast.success(`Successfully signed in with Google!`, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                
                setTimeout(() => navigate(from, { replace: true }), 2000);
            })
            .catch((error) => {
                console.error('Google Sign In Error:', error);
                console.error('Error code:', error.code);
                console.error('Error message:', error.message);
            });
    };

    const handleGithubSignIn = () => {
       signInWithPopup(auth, GithubProvider)
            .then((result) => { 
                const user = result.user;
                console.log('Github Sign In Success:', user);
                console.log('User email:', user.email);
                console.log('User name:', user.displayName);
                
                toast.success(`Successfully signed in with Github!`, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                
                setTimeout(() => navigate(from, { replace: true }), 2000);
            })
            .catch((error) => {
                console.error('Github Sign In Error:', error);
                console.error('Error code:', error.code);
                console.error('Error message:', error.message);
            });
    };
    return (
        <>
            <ToastContainer />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="mt-14 bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full flex">
                    {/* Left side - Welcome */}
                    <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
                        <div className="text-center">
                            <div className="mx-auto h-32 w-32 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                                <svg className="h-16 w-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Fluentask</h3>
                            <p className="text-gray-600 text-lg">Streamline your workflow with professional task management</p>
                        </div>
                    </div>
                    
                    {/* Right side - Login */}
                    <div className="w-full lg:w-1/2 p-8 lg:p-12">
                        <div className="max-w-md mx-auto">
                            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                                Sign In
                            </h2>
                            
                            <div className="mb-8 space-y-4">
                                <p className="text-center text-gray-600 mb-6">
                                    Choose your preferred sign-in method
                                </p>
                                
                                {/* Google Sign In */}
                                <button
                                    onClick={handleGoogleSignIn}
                                    className="w-full flex items-center justify-center px-6 py-4 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                >
                                    <FcGoogle className="h-6 w-6 mr-3" />
                                    Continue with Google
                                </button>

                                {/* GitHub Sign In */}
                                <button
                                    onClick={handleGithubSignIn}
                                    className="w-full flex items-center justify-center px-6 py-4 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                >
                                    <FaGithub className="h-6 w-6 text-gray-800 mr-3" />
                                    Continue with GitHub
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <p className="text-center text-sm text-gray-500 mb-4">
                                    Secure authentication powered by Firebase
                                </p>
                            </div>

                            {/* Features */}
                            <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <div className="h-8 w-8 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                                        <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <p className="text-xs text-gray-600 font-medium">Secure Login</p>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <div className="h-8 w-8 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                                        <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <p className="text-xs text-gray-600 font-medium">Fast Access</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;