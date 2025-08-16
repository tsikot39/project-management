import { Card, Button } from '@/components/ui/quickui';

export function ProjectsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button>New Project</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card
            key={i}
            className="hover:shadow-lg transition-shadow cursor-pointer"
          >
            <h3 className="text-lg font-semibold mb-2">Project {i}</h3>
            <p className="text-gray-600 mb-4">
              Project description goes here...
            </p>
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Active</span>
              <span className="text-gray-500">5 tasks</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ProjectDetailPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Project Details</h1>
      <Card>
        <h2 className="text-xl font-semibold mb-4">Website Redesign</h2>
        <p className="mb-4">Complete redesign of the company website...</p>
        <div className="flex gap-4">
          <Button>Edit Project</Button>
          <Button className="bg-green-600 hover:bg-green-700">
            View Kanban
          </Button>
        </div>
      </Card>
    </div>
  );
}

export function KanbanPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Kanban Board</h1>
      <div className="flex gap-6 overflow-x-auto">
        {['To Do', 'In Progress', 'Review', 'Done'].map((status) => (
          <div key={status} className="bg-gray-100 rounded-lg p-4 min-w-80">
            <h3 className="font-semibold mb-4">{status}</h3>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Card key={i} className="cursor-pointer hover:shadow-md">
                  <h4 className="font-medium">Task {i}</h4>
                  <p className="text-sm text-gray-600">Task description</p>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="bg-blue-100 px-2 py-1 rounded">
                      Medium
                    </span>
                    <span>Due: 2 days</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfilePage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            JD
          </div>
          <div>
            <h2 className="text-xl font-semibold">John Doe</h2>
            <p className="text-gray-600">john.doe@example.com</p>
          </div>
        </div>
        <Button>Edit Profile</Button>
      </Card>
    </div>
  );
}
