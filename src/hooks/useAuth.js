'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Since the token is stored as HttpOnly cookie, we need to call the API
      // The API will automatically use the cookie
      const response = await fetch('/api/auth/me', {
        credentials: 'include' // Include cookies in the request
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };



  const login = async (credentials, type) => {
    try {
      const endpoint = type === 'admin' ? '/api/owner/login' : '/api/student/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Handle different response structures
        let userData;
        if (type === 'admin') {
          // Owner login returns { success: true, admin: {...}, token: "..." }
          userData = {
            ...data.admin,
            type: 'admin',
            token: data.token
          };
        } else {
          // Student login returns { success: true, student: {...}, token: "..." }
          userData = {
            ...data.student,
            type: 'student',
            token: data.token
          };
        }
        
        // Token is automatically stored in cookies by the server
        // No need to store in localStorage
        
        setUser(userData);
        return { success: true, data: userData };
      } else {
        return { success: false, error: data.error || data.message };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const clearLocalStorageTokens = () => {
    if (typeof window === 'undefined') return;
    
    // Clear all possible authentication tokens from localStorage
    const tokensToRemove = [
      'auth_token',
      'adminToken',
      'studentToken',
      'adminData',
      'studentData',
      'userToken',
      'userData',
      'superAdminToken',
      'superAdminUser',
      'admin_data'
    ];
    
    tokensToRemove.forEach(token => {
      localStorage.removeItem(token);
    });
    
    // Also clear sessionStorage if any tokens are stored there
    const sessionTokensToRemove = [
      'auth_token',
      'adminToken',
      'studentToken',
      'adminData',
      'studentData',
      'userToken',
      'userData',
      'superAdminToken',
      'superAdminUser',
      'admin_data'
    ];
    
    sessionTokensToRemove.forEach(token => {
      sessionStorage.removeItem(token);
    });
    
    // Clear any authentication-related cookies that might be set
    const cookiesToClear = [
      'auth_token',
      'adminToken',
      'studentToken',
      'superAdminToken',
      'adminData',
      'studentData',
      'userData'
    ];
    
    // Clear cookies with different path and domain combinations
    cookiesToClear.forEach(cookieName => {
      // Clear with default settings
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      // Clear with root domain
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      // Clear with subdomain support
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname.split('.').slice(-2).join('.')};`;
      // Clear with SameSite attributes
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict;`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax;`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure;`;
    });
    
    // Additional comprehensive cookie clearing - clear ALL cookies
    try {
      // Get all cookies and clear them one by one
      const cookies = document.cookie.split(";");
      
      for (let cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        
        if (name) {
          // Clear with multiple combinations to ensure removal
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
          
          // Try with different paths
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname.split('.').slice(-2).join('.')};`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        }
      }
    } catch (error) {
      console.warn('Error clearing all cookies:', error);
    }
    
    console.log('All local storage tokens and cookies cleared during logout');
  };

  const logout = async () => {
    try {
      // Clear all local storage tokens first
      clearLocalStorageTokens();
      
      // Call the logout API with credentials to ensure cookies are handled
      await fetch('/api/logout', { 
        method: 'POST',
        credentials: 'include' // Include cookies in the request for server-side clearing
      });
      
      // Clear user state and redirect
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local data and tokens
      clearLocalStorageTokens();
      setUser(null);
      router.push('/');
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    checkAuth
  };
} 