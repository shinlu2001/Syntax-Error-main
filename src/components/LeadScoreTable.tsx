// src/components/LeadScoreTable.tsx
import React from 'react';
import { Lead } from '../types';
import LeadRow from './LeadRow';

interface LeadScoreTableProps {
  leads: Lead[];
}

const LeadScoreTable: React.FC<LeadScoreTableProps> = ({ leads }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Industry</th>
          <th>Score</th>
          <th>Status</th>
          <th>Conversion Probability</th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <LeadRow key={lead.id} lead={lead} />
        ))}
      </tbody>
    </table>
  );
};

export default LeadScoreTable;
