import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import { ToastContainer } from './components/ui/ToastContainer';

// Layout components
import { Layout } from './components/layout/Layout';

// Page components
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { TasksPage } from './pages/TasksPage';
import { KanbanPage } from './pages/KanbanPage';

function App() {
  return (
    <QueryProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Protected routes with Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="kanban" element={<KanbanPage />} />
              {/* Redirect old routes */}
              <Route
                path="projects/:projectId/kanban"
                element={<Navigate to="/kanban" replace />}
              />
            </Route>

            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <ToastContainer />
      </Router>
    </QueryProvider>
  );
}

export default App;
