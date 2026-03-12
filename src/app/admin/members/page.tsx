'use client';

import { useState, useEffect } from 'react';
import { getMembers, deleteMember } from '@/services/members';
import { Member } from '@/types/member';
import MembersTable from './components/MembersTable';
import MemberForm from './components/MemberForm';
import Modal from '@/components/Modal';

export default function MembersAdmin() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const members = await getMembers();
    setMembers(members);
  };

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteMember(id);
    fetchMembers();
  };

  const handleFormSave = () => {
    fetchMembers();
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Members</h1>
        <button
          onClick={() => {
            setSelectedMember(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Member
        </button>
      </div>
      <MembersTable members={members} onEdit={handleEdit} onDelete={handleDelete} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedMember ? 'Edit Member' : 'Add Member'}>
        <MemberForm member={selectedMember} onSave={handleFormSave} />
      </Modal>
    </div>
  );
}
