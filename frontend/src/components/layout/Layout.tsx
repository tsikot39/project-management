import { Outlet } from 'react-router-dom';
import { AppNavigation, TopBar } from './AppNavigation';

export function Layout() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation */}
      <div className="w-64 flex-shrink-0 relative">
        <AppNavigation className="fixed inset-y-0 left-0 w-64" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <TopBar />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
