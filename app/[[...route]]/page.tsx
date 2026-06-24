'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import StudentDashboard from '@/components/StudentDashboard';
import MyCourses from '@/components/MyCourses';
import CourseLearning from '@/components/CourseLearning';
import LiveClasses from '@/components/LiveClasses';
import CreatorDashboard from '@/components/CreatorDashboard';
import CreatorMyCourses from '@/components/CreatorMyCourses';
import CreatorStudents from '@/components/CreatorStudents';
import CreatorAnalytics from '@/components/CreatorAnalytics';
import CreatorLiveSessions from '@/components/CreatorLiveSessions';
import LiveStudio from '@/components/LiveStudio';
import CourseBuilder from '@/components/CourseBuilder';
import AdminDashboard from '@/components/AdminDashboard';
import RoleSwitcher from '@/components/RoleSwitcher';
import Community from '@/components/Community';
import Settings from '@/components/Settings';
import { ShieldAlert } from 'lucide-react';

import { Role, View } from '@/types';

export default function App() {
  const params = useParams();
  const router = useRouter();

  const [userRole, setUserRole] = useState<Role | null>(null);

  useEffect(() => {
    // Read user identity from local storage
    requestAnimationFrame(() => {
      const savedRole = (localStorage.getItem('userRole') as Role) || 'student';
      setUserRole(savedRole);
    });
  }, []);

  const routeParams = params.route as string[] | undefined;
  
  let currentRouteRole: Role = 'student';
  let currentView: View = 'dashboard';
  
  if (routeParams && routeParams.length >= 2) {
    const parsedRole = routeParams[0];
    if (parsedRole === 'student' || parsedRole === 'creator' || parsedRole === 'admin') {
      currentRouteRole = parsedRole;
    }
    currentView = routeParams.slice(1).join('/');
  } else if (routeParams && routeParams.length === 1) {
    const parsedRole = routeParams[0];
    if (parsedRole === 'student' || parsedRole === 'creator' || parsedRole === 'admin') {
      currentRouteRole = parsedRole;
    }
  }

  // Effect to handle default redirect if the URL doesn't have a valid role/view
  useEffect(() => {
    if (userRole) {
      if (!routeParams || routeParams.length === 0) {
        router.replace(`/${userRole}/dashboard`);
      } else if (routeParams.length === 1) {
        router.replace(`/${currentRouteRole}/dashboard`);
      }
    }
  }, [routeParams, currentRouteRole, router, userRole]);

  const setRole = (newRole: Role) => {
    localStorage.setItem('userRole', newRole);
    setUserRole(newRole);
    router.push(`/${newRole}/dashboard`);
  };

  const setActiveView = (newView: View) => {
    router.push(`/${currentRouteRole}/${newView}`);
  };

  // Prevent rendering before hydration
  if (!userRole) return null;

  // Authorization Check
  let isAuthorized = true;
  if (currentRouteRole === 'admin' && userRole !== 'admin') {
    isAuthorized = false;
  }
  if (currentRouteRole === 'creator' && userRole !== 'creator' && userRole !== 'admin') {
    isAuthorized = false;
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-text-primary p-8">
        <ShieldAlert size={64} className="text-danger mb-6" />
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-text-secondary mb-8 text-center max-w-md">
          You do not have permission to view this {currentRouteRole} panel. Please switch to an authorized role.
        </p>
        <button 
          onClick={() => router.push(`/${userRole}/dashboard`)}
          className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors"
        >
          Return to My Dashboard
        </button>
        <RoleSwitcher currentRole={userRole} setRole={setRole} setActiveView={setActiveView} />
      </div>
    );
  }

  const renderContent = () => {
    if (currentRouteRole === 'student') {
      switch (currentView) {
        case 'dashboard': return <StudentDashboard setView={setActiveView} />;
        case 'my-courses': return <MyCourses setView={setActiveView} />;
        case 'course-learning': return <CourseLearning setView={setActiveView} />;
        case 'live-classes': return <LiveClasses setView={setActiveView} />;
        case 'schedule': return <div className="p-8 flex items-center justify-center text-text-secondary h-full text-lg">Schedule module coming soon.</div>;
        case 'assignments': return <div className="p-8 flex items-center justify-center text-text-secondary h-full text-lg">Assignments module coming soon.</div>;
        case 'community': return <Community setView={setActiveView} />;
        case 'settings': return <Settings setView={setActiveView} />;
        default: return <div className="p-8 flex items-center justify-center text-text-secondary h-full text-lg">Page not found in Student Panel.</div>;
      }
    } else if (currentRouteRole === 'creator') {
      switch (currentView) {
        case 'dashboard': return <CreatorDashboard setView={setActiveView} />;
        case 'my-courses': return <CreatorMyCourses setView={setActiveView} />;
        case 'course-builder': return <CourseBuilder setView={setActiveView} />;
        case 'students': return <CreatorStudents setView={setActiveView} />;
        case 'analytics': return <CreatorAnalytics setView={setActiveView} />;
        case 'live-sessions': return <CreatorLiveSessions setView={setActiveView} />;
        case 'live-studio': return <LiveStudio setView={setActiveView} />;
        case 'revenue': return <div className="p-8 flex items-center justify-center text-text-secondary h-full text-lg">Revenue module coming soon.</div>;
        case 'settings': return <Settings setView={setActiveView} />;
        default: return <div className="p-8 flex items-center justify-center text-text-secondary h-full text-lg">Page not found in Creator Panel.</div>;
      }
    } else if (currentRouteRole === 'admin') {
      switch (currentView) {
        case 'dashboard': return <AdminDashboard setView={setActiveView} />;
        case 'users': return <div className="p-8 flex items-center justify-center text-text-secondary h-full text-lg">Users management module coming soon.</div>;
        case 'creators': return <div className="p-8 flex items-center justify-center text-text-secondary h-full text-lg">Creators management module coming soon.</div>;
        case 'courses': return <div className="p-8 flex items-center justify-center text-text-secondary h-full text-lg">Platform Courses module coming soon.</div>;
        case 'payments': return <div className="p-8 flex items-center justify-center text-text-secondary h-full text-lg">Payments module coming soon.</div>;
        case 'analytics': return <div className="p-8 flex items-center justify-center text-text-secondary h-full text-lg">Platform Analytics coming soon.</div>;
        case 'reports': return <div className="p-8 flex items-center justify-center text-text-secondary h-full text-lg">Reports module coming soon.</div>;
        case 'settings': return <Settings setView={setActiveView} />;
        default: return <div className="p-8 flex items-center justify-center text-text-secondary h-full text-lg">Page not found in Admin Panel.</div>;
      }
    }
    return <StudentDashboard setView={setActiveView} />;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar role={currentRouteRole} activeView={currentView} setActiveView={setActiveView} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header role={currentRouteRole} setRole={setRole} activeView={currentView} />
        
        <main className={`flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth ${currentView === 'live-studio' ? 'p-0 md:p-0' : ''}`}>
          <div className={`max-w-[1600px] mx-auto h-full ${currentView === 'live-studio' ? 'max-w-none' : ''}`}>
            {renderContent()}
          </div>
        </main>

        <RoleSwitcher currentRole={userRole} setRole={setRole} setActiveView={setActiveView} />
      </div>
    </div>
  );
}
