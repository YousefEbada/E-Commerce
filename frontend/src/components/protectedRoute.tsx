import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isConfirmed: boolean;
  role: string;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Verify token and get user data
        const response = await axios.get("http://localhost:5000/users/verify-token", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUserData(response.data.user);
        setIsLoading(false);
      } catch (err: any) {
        console.error("Auth check error:", err);
        
        if (err.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("token");
          setError("Session expired. Please login again.");
        } else if (err.response?.status === 403) {
          // Email not verified
          setError("Please verify your email before accessing this page.");
        } else {
          setError("Authentication error. Please login again.");
        }
        
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Show loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="text-gray-700">Verifying authentication...</span>
          </div>
        </div>
      </div>
    );
  }

  // No token - redirect to login
  if (!localStorage.getItem("token")) {
    return <Navigate to="/" replace />;
  }

  // Show error message if there's an authentication issue
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (userData && userData.isConfirmed) {
    return children;
  }

  // User is authenticated but email is not verified
  if (userData && !userData.isConfirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-yellow-500 text-6xl mb-4">📧</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Email Verification Required</h2>
            <p className="text-gray-600 mb-6">
              Please check your email and click the verification link before accessing this page.
            </p>
            <div className="space-y-3">
              <button
                onClick={async () => {
                  try {
                    await axios.post("http://localhost:5000/users/resend-verification", {
                      email: userData.email
                    });
                    alert("Verification email sent! Please check your inbox.");
                  } catch (err) {
                    alert("Failed to resend verification email. Please try again.");
                  }
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
              >
                Resend Verification Email
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors w-full"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback - redirect to login
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
