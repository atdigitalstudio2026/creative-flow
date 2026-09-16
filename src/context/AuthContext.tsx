import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { INITIAL_USERS } from '../data/seedData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  currentUser: UserProfile;
  currentRole: UserRole;
  allUsers: UserProfile[];
  switchUser: (user: UserProfile) => void;
  updateUserProfile: (userId: string, updates: Partial<UserProfile>) => void;
  addUserProfile: (user: Partial<UserProfile>) => UserProfile;
  deleteUserProfile: (userId: string) => boolean;
  canCreateTask: boolean;
  canAssignTask: boolean;
  canHandover: boolean;
  canUploadVersion: boolean;
  canRequestRevision: boolean;
  canApproveTask: boolean;
  canAccessAuditLogs: boolean;
  canAccessAdminPanel: boolean;
  canManageUsers: boolean;
  canAccessReports: boolean;
  canManageTemplates: boolean;
  isCloudConnected: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usersList, setUsersList] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('ctf_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem('ctf_current_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        // fallback
      }
    }
    // Default to Manager for rich inspection of capabilities
    return INITIAL_USERS[1];
  });

  useEffect(() => {
    localStorage.setItem('ctf_users', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem('ctf_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const switchUser = (user: UserProfile) => {
    setCurrentUser(user);
  };

  const updateUserProfile = (userId: string, updates: Partial<UserProfile>) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
    );
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, ...updates }));
    }
  };

  const addUserProfile = (data: Partial<UserProfile>): UserProfile => {
    const newUser: UserProfile = {
      id: 'user-' + Date.now(),
      full_name: data.full_name || 'Anggota Tim Baru',
      email: data.email || `user.${Date.now()}@creativetaskflow.internal`,
      avatar_url: data.avatar_url || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      role: data.role || 'DESIGNER',
      department_id: data.department_id || 'dept-1',
      department_name: data.department_name || 'Creative & Graphic Design',
      position: data.position || 'Graphic Designer',
      is_active: true,
      created_at: new Date().toISOString()
    };
    setUsersList((prev) => [...prev, newUser]);
    return newUser;
  };

  const deleteUserProfile = (userId: string): boolean => {
    // Prevent deleting currently logged-in user
    if (userId === currentUser.id) {
      return false;
    }
    setUsersList((prev) => prev.filter((u) => u.id !== userId));
    return true;
  };

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    // Switch to Designer or reset
    setCurrentUser(INITIAL_USERS[2]);
  };

  const role = currentUser.role;

  const value: AuthContextType = {
    currentUser,
    currentRole: role,
    allUsers: usersList,
    switchUser,
    updateUserProfile,
    addUserProfile,
    deleteUserProfile,
    canCreateTask: ['SUPER_ADMIN', 'MANAGER', 'REQUESTER', 'DESIGNER', 'CONTENT_CREATOR'].includes(role),
    canAssignTask: ['SUPER_ADMIN', 'MANAGER', 'DESIGNER', 'CONTENT_CREATOR'].includes(role),
    canHandover: ['SUPER_ADMIN', 'MANAGER'].includes(role),
    canUploadVersion: ['SUPER_ADMIN', 'MANAGER', 'DESIGNER', 'CONTENT_CREATOR'].includes(role),
    canRequestRevision: ['SUPER_ADMIN', 'MANAGER'].includes(role),
    canApproveTask: ['SUPER_ADMIN', 'MANAGER'].includes(role),
    canAccessAuditLogs: ['SUPER_ADMIN', 'MANAGER'].includes(role),
    canAccessAdminPanel: ['SUPER_ADMIN', 'MANAGER'].includes(role),
    canManageUsers: ['SUPER_ADMIN', 'MANAGER'].includes(role),
    canAccessReports: ['SUPER_ADMIN', 'MANAGER'].includes(role),
    canManageTemplates: ['SUPER_ADMIN', 'MANAGER'].includes(role),
    isCloudConnected: isSupabaseConfigured,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
