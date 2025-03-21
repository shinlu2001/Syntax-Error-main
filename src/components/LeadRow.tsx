// src/components/LeadRow.tsx
import React from 'react';
import { Lead } from '../types';

interface LeadRowProps {
  lead: Lead;
}

const LeadRow: React.FC<LeadRowProps> = ({ lead }) => {
  return (
    <tr>
      <td>{lead.name}</td>
      <td>{lead.industry}</td>
      <td>{Math.round(lead.score)}%</td>
      <td>{lead.status}</td>
      <td>{lead.conversionProbability}%</td>
    </tr>
  );
};

export default LeadRow;
