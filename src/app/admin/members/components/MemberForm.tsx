'use client';

import { useState, useEffect } from 'react';
import { createMember, updateMember } from '@/services/members';
import { Member } from '@/types/member';

interface MemberFormProps {
  member: Member | null;
  onSave: () => void;
}

export default function MemberForm({ member, onSave }: MemberFormProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [team, setTeam] = useState('');
  const [bio, setBio] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (member) {
      setName(member.name);
      setRole(member.role);
      setTeam(member.team);
      setBio(member.bio || '');
      setGithub(member.github || '');
      setLinkedin(member.linkedin || '');
      setImage(member.image || '');
    }
  }, [member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const memberData = { name, role, team, bio, github, linkedin, image };

    if (member) {
      await updateMember(member.id, memberData);
    } else {
      await createMember(memberData);
    }
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Team</label>
        <input
          type="text"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
        <input
          type="url"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
        <input
          type="url"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
}
