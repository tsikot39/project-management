import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewWorkingLandingPage from './components/saas/NewWorkingLandingPage';
import { WorkingLoginPage } from './components/saas/WorkingLoginPage';
import { SignUpPage } from './components/saas/SignUpPage';
import { WorkingDashboard } from './components/saas/WorkingDashboard';
import { SaasProjectsPage } from './components/saas/SaasProjectsPage';
import { ProjectKanbanPage } from './components/saas/ProjectKanbanPage';
import { TeamMembersPage } from './components/saas/TeamMembersPage';
import { SettingsPage } from './components/saas/SettingsPage';
import { ReportsPage } from './components/saas/ReportsPage';
import { DashboardLayout } from './components/layout/DashboardLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NewWorkingLandingPage />} />
        <Route path="/login" element={<WorkingLoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Dashboard routes with layout */}
        <Route
          path="/:orgSlug/dashboard"
          element={
            <DashboardLayout>
              <WorkingDashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/:orgSlug/projects"
          element={
            <DashboardLayout>
              <SaasProjectsPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/:orgSlug/projects/:projectId/kanban"
          element={
            <DashboardLayout>
              <ProjectKanbanPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/:orgSlug/team"
          element={
            <DashboardLayout>
              <TeamMembersPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/:orgSlug/settings"
          element={
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/:orgSlug/reports"
          element={
            <DashboardLayout>
              <ReportsPage />
            </DashboardLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
