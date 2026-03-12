'use client';

import { Member } from '@/types/member';

interface MembersTableProps {
  members: Member[];
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
}

export default function MembersTable({ members, onEdit, onDelete }: MembersTableProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {members.map((member) => (
            <tr key={member.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.role}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.team}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={() => onEdit(member)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                <button onClick={() => onDelete(member.id)} className="text-red-600 hover:text-red-900 ml-4">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
