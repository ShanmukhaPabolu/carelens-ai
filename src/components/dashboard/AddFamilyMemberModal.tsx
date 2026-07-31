'use client';

import React, { useState } from 'react';
import { X, UserPlus, Heart, Shield, Check } from 'lucide-react';
import { useMedical } from '@/context/MedicalContext';
import { ParentProfile } from '@/types/medical';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AddFamilyMemberModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addParentProfile } = useMedical();

  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Mother');
  const [customRelationship, setCustomRelationship] = useState('');
  const [age, setAge] = useState<number>(60);
  const [gender, setGender] = useState('Female');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [city, setCity] = useState('Hyderabad');
  const [primaryCondition, setPrimaryCondition] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalRelationship = relationship === 'Other' ? (customRelationship.trim() || 'Family Member') : relationship;

    const newProfile: ParentProfile = {
      id: `member_${Date.now()}`,
      name: name.trim(),
      relationship: finalRelationship as any,
      age: Number(age) || 60,
      gender,
      bloodGroup,
      city: city.trim() || 'Hyderabad',
      allergies: [],
      primaryCondition: primaryCondition.trim() || 'General Health Monitoring',
      conditions: primaryCondition.trim() ? [primaryCondition.trim()] : [],
      primaryDoctor: 'Not assigned',
      hospital: 'Not specified',
      emergencyContactName: 'Primary Caregiver',
      emergencyContactPhone: '+91 98765 43210',
      photoUrl: gender === 'Female'
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    };

    addParentProfile(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">Add Family Member</h2>
              <p className="text-xs text-sky-100">Add parents, in-laws, grandparents, or spouse</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Grandma Sunita or Uncle Rajesh"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:border-sky-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Relationship *
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:border-sky-600 focus:outline-none"
              >
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Grandmother">Grandmother</option>
                <option value="Grandfather">Grandfather</option>
                <option value="Spouse">Spouse</option>
                <option value="Sibling">Sibling</option>
                <option value="In-law">Mother-in-Law / Father-in-Law</option>
                <option value="Other">Other / Custom</option>
              </select>
            </div>

            {relationship === 'Other' ? (
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Specify Relation *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aunt, Cousin"
                  value={customRelationship}
                  onChange={(e) => setCustomRelationship(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:border-sky-600 focus:outline-none"
                />
              </div>
            ) : (
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:border-sky-600 focus:outline-none"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:border-sky-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:border-sky-600 focus:outline-none"
              >
                <option value="O+">O+</option>
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="AB+">AB+</option>
                <option value="O-">O-</option>
                <option value="A-">A-</option>
                <option value="B-">B-</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:border-sky-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Primary Health Focus (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Hypertension, General Checkups"
              value={primaryCondition}
              onChange={(e) => setPrimaryCondition(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:border-sky-600 focus:outline-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Add Family Profile
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
