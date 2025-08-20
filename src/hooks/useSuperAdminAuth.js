'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export const useSuperAdminAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for existing token on mount
    console.log('Auth hook initialized');
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      console.log('checkAuth: Starting authentication check');
      
      // Get token from cookies
      const token = getCookie('superAdminToken');
      console.log('checkAuth: Token from cookie:', token ? 'exists' : 'not found');
      if (token) {
        console.log('checkAuth: Token length:', token.length);
        console.log('checkAuth: Token preview:', token.substring(0, 20) + '...');
      }
      
      if (!token) {
        console.log('checkAuth: No token found, setting not authenticated');
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      // Verify token with backend
      console.log('checkAuth: Making API call to /api/super-admin/me with token:', token.substring(0, 20) + '...');
      const response = await fetch('/api/super-admin/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('checkAuth: API response status:', response.status);
      console.log('checkAuth: API response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('checkAuth: API error response:', errorText);
      }

      if (response.ok) {
        const data = await response.json();
        console.log('checkAuth: Token valid, user authenticated:', data.user);
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.log('checkAuth: Token invalid, API error:', errorData);
        // Token is invalid, clear everything but don't redirect
        document.cookie = 'superAdminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax';
        localStorage.removeItem('superAdminUser');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('checkAuth: Auth check error:', error);
      // On error, clear auth state but don't redirect
      document.cookie = 'superAdminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax';
      localStorage.removeItem('superAdminUser');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      console.log('checkAuth: Setting loading to false');
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API
      await fetch('/api/super-admin/logout', {
        method: 'POST'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all auth data
      document.cookie = 'superAdminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax';
      localStorage.removeItem('superAdminUser');
      setUser(null);
      setIsAuthenticated(false);
      
      // Redirect to login
      router.push('/super-admin/login');
      toast.success('Logged out successfully');
    }
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const token = parts.pop().split(';').shift();
      console.log('Cookie search for', name, 'found:', token ? 'yes' : 'no');
      return token;
    }
    console.log('Cookie search for', name, 'found: no');
    console.log('All cookies:', document.cookie);
    return null;
  };

  return {
    user,
    loading,
    isAuthenticated,
    logout,
    checkAuth
  };
};
