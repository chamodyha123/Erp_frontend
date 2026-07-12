import { Folder } from 'lucide-react';
import { PageHeader, DataStructure } from '../../components/DataStructure';

export function ProjectsOverview() {
  return (
    <div className="p-6">
      <PageHeader 
        title="Project Management Module" 
        description="Complete project lifecycle management including planning, execution, and tracking"
        icon={<Folder className="w-8 h-8" />}
      />

      <div className="grid gap-6">
        <DataStructure
          title="Project"
          description="Project master data and planning information"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'projectCode', type: 'string', description: 'Project code' },
            { name: 'projectName', type: 'string', description: 'Project name' },
            { name: 'description', type: 'string', description: 'Project description' },
            { name: 'projectManager', type: 'string', description: 'Project manager ID' },
            { name: 'startDate', type: 'Date', description: 'Project start date' },
            { name: 'endDate', type: 'Date', description: 'Project end date' },
            { name: 'status', type: 'enum', description: 'Planning | Active | On Hold | Completed' },
            { name: 'budget', type: 'number', description: 'Project budget' },
          ]}
        />

        <DataStructure
          title="Task"
          description="Project tasks and work items"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'projectId', type: 'string', description: 'Project reference' },
            { name: 'taskName', type: 'string', description: 'Task name' },
            { name: 'assignedTo', type: 'string', description: 'Assigned user ID' },
            { name: 'priority', type: 'enum', description: 'Low | Medium | High | Critical' },
            { name: 'status', type: 'enum', description: 'To Do | In Progress | Review | Done' },
            { name: 'dueDate', type: 'Date', description: 'Due date' },
            { name: 'estimatedHours', type: 'number', description: 'Estimated hours' },
          ]}
        />

        <DataStructure
          title="Time Entry"
          description="Time tracking for tasks and projects"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'projectId', type: 'string', description: 'Project reference' },
            { name: 'taskId', type: 'string', description: 'Task reference' },
            { name: 'userId', type: 'string', description: 'User who logged time' },
            { name: 'date', type: 'Date', description: 'Date of work' },
            { name: 'hours', type: 'number', description: 'Hours worked' },
            { name: 'description', type: 'string', description: 'Work description' },
          ]}
        />

        <DataStructure
          title="Milestone"
          description="Project milestones and key deliverables"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'projectId', type: 'string', description: 'Project reference' },
            { name: 'milestoneName', type: 'string', description: 'Milestone name' },
            { name: 'description', type: 'string', description: 'Milestone description' },
            { name: 'targetDate', type: 'Date', description: 'Target completion date' },
            { name: 'status', type: 'enum', description: 'Pending | Achieved | Delayed' },
          ]}
        />
      </div>
    </div>
  );
}
