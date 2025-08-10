'use client';
import React, { useState, useEffect } from 'react'

export default function SignupPage() {
  const[form , setForm] = useState({
    name:'',
    email:'',
    password:'',
  })
  const [isDarkMode, setIsDarkMode] = useState(false);
  const[isSubmitting , setIsSubmitting]=useState(false);
  const [errors , setErrors]= useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
   if (errors[name]){
    setErrors(prev => ({
      ...prev,
      [name]:''
    }));
   }
  };

  const handleSubmit = async(e)=>{
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    
    try{
      const response = await fetch('/api/auth/signup',{ 
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(form)
      });
      
      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server error - please try again later");
      }
      
      const data = await response.json();

      if(response.ok){
        alert('Account created successfully!');
        setForm({
          name:'',
          email:'',
          password:'',
        });
        window.location.href = '/Login';
      }else{
        if(data.error){
          alert(data.error);
        } else {
          alert('Signup failed. Please try again.');
        }
      }
    }catch(error){
      console.error('Signup error:', error);
      if (error.message === "Failed to fetch") {
        alert('Network error. Please check your connection and try again.');
      } else {
        alert('An error occurred. Please try again later.');
      }
    }finally{
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedMode !== null) {
      setIsDarkMode(JSON.parse(savedMode));
    } else {
      setIsDarkMode(systemPrefersDark);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`relative min-h-screen w-full ${isDarkMode ? 'dark' : ''}`}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-transparent bg-center bg-no-repeat blur-sm"
        style={{
          backgroundImage: "url('/img/desk1.png')",
          minHeight: '100vh'
        }}
      >
      </div>
      
      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleDarkMode}
          className={`p-3 rounded-full transition-all duration-300 ${
            isDarkMode 
              ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
              : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
          } shadow-lg`}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            // Sun icon for light mode
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            // Moon icon for dark mode
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Overlapping Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className={`${
            isDarkMode 
              ? 'bg-gray-800 bg-opacity-95 border border-gray-600' 
              : 'bg-white bg-opacity-90'
          } backdrop-blur-sm rounded-lg shadow-2xl p-8 transition-all duration-300`}>
            <h1 className={`text-3xl font-bold text-center mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>Signup</h1>
            <p className={`text-center mb-4 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}> Signup Here For Your New Account </p>
          <form onSubmit={handleSubmit} className="space-y-4">
             <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Name</label>
              <input 
                type="text" 
                name='name'
                value={form.name}
                onChange={handleInputChange}
                autoComplete="name"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Email</label>
              <input 
                type="email" 
                name='email'
                value={form.email}
                onChange={handleInputChange}
                autoComplete="email"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Password</label>
              <input 
                type="password" 
                name='password'
                value={form.password}
                onChange={handleInputChange}
                autoComplete="new-password"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                placeholder="Enter your password"
              />
            </div>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                isDarkMode
                  ? 'bg-pink-600 hover:bg-pink-700 text-white'
                  : 'bg-pink-700 hover:bg-pink-800 text-white'
              }`}
            >
              Signup
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
                Already have an account? 
              <a href="/Login" className={`font-medium ml-1 ${
                isDarkMode 
                  ? 'text-pink-400 hover:text-pink-300' 
                  : 'text-pink-700 hover:text-pink-800'
              }`}>
                Login here
              </a>
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}