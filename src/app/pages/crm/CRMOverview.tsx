import { Heart } from 'lucide-react';
import { PageHeader, DataStructure } from '../../components/DataStructure';

export function CRMOverview() {
  return (
    <div className="p-6">
      <PageHeader 
        title="CRM Module" 
        description="Customer relationship management including leads, opportunities, and marketing campaigns"
        icon={<Heart className="w-8 h-8" />}
      />

      <div className="grid gap-6">
        <DataStructure
          title="Lead"
          description="Potential customers and sales prospects"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'leadNumber', type: 'string', description: 'Lead number' },
            { name: 'companyName', type: 'string', description: 'Company name' },
            { name: 'contactPerson', type: 'string', description: 'Contact person' },
            { name: 'email', type: 'string', description: 'Email address' },
            { name: 'phone', type: 'string', description: 'Phone number' },
            { name: 'status', type: 'enum', description: 'New | Contacted | Qualified | Lost' },
          ]}
        />

        <DataStructure
          title="Opportunity"
          description="Sales opportunities and pipeline management"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'opportunityNumber', type: 'string', description: 'Opportunity number' },
            { name: 'customerId', type: 'string', description: 'Customer or lead reference' },
            { name: 'opportunityName', type: 'string', description: 'Opportunity name' },
            { name: 'estimatedValue', type: 'number', description: 'Estimated deal value' },
            { name: 'probability', type: 'number', description: 'Win probability %' },
            { name: 'stage', type: 'enum', description: 'Prospecting | Proposal | Negotiation | Closed Won | Closed Lost' },
          ]}
        />

        <DataStructure
          title="Activity"
          description="Customer interactions and touch points"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'activityType', type: 'enum', description: 'Call | Email | Meeting | Task' },
            { name: 'subject', type: 'string', description: 'Activity subject' },
            { name: 'relatedTo', type: 'string', description: 'Lead/Customer/Opportunity ID' },
            { name: 'scheduledDate', type: 'Date', description: 'Scheduled date' },
            { name: 'status', type: 'enum', description: 'Scheduled | Completed | Cancelled' },
          ]}
        />

        <DataStructure
          title="Campaign"
          description="Marketing campaigns and promotions"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'campaignName', type: 'string', description: 'Campaign name' },
            { name: 'campaignType', type: 'enum', description: 'Email | Social | Event | Other' },
            { name: 'startDate', type: 'Date', description: 'Campaign start date' },
            { name: 'endDate', type: 'Date', description: 'Campaign end date' },
            { name: 'budget', type: 'number', description: 'Campaign budget' },
            { name: 'status', type: 'enum', description: 'Planning | Active | Completed' },
          ]}
        />
      </div>
    </div>
  );
}
