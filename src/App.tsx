/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StudentProject } from './types';
import { subscribeToStudents, getAllStudents } from './firebase';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StudentSearch } from './components/StudentSearch';
import { StudentModal } from './components/StudentModal';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';

export default function App() {
  const [students, setStudents] = useState<StudentProject[]>([]);
  const [isLiveFirebase, setIsLiveFirebase] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [selectedStudent, setSelectedStudent] = useState<StudentProject | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Real-time synchronization with Firebase Firestore
  useEffect(() => {
    setIsLoading(true);

    // Subscribe to Firestore collection('students') in real time
    const unsubscribe = subscribeToStudents((updatedStudents, isLive) => {
      setStudents(updatedStudents);
      setIsLiveFirebase(isLive);
      setIsLoading(false);
    });

    // Check if ?admin=true is in URL for quick admin access
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true' || urlParams.get('p') === 'admin') {
      setIsAdminOpen(true);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF5] text-slate-900 bg-dot-pattern selection:bg-[#FFE066] selection:text-black">
      {/* Navbar with School branding & Admin Portal Button */}
      <Navbar
        onOpenAdmin={() => setIsAdminOpen(true)}
        isLiveFirebase={isLiveFirebase}
        totalStudents={students.length}
      />

      <main className="flex-1 pb-10">
        {/* Minimal Hero Section */}
        <Hero />

        {/* Student Search & Real-time Grid of All Registered Students */}
        <StudentSearch
          students={students}
          onSelectStudent={(student) => setSelectedStudent(student)}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      </main>

      {/* Streamlined Student Project Dashboard Modal (Direct Embeds) */}
      <StudentModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />

      {/* Admin Management Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        students={students}
        onRefreshStudents={async () => {
          const { students: s } = await getAllStudents();
          setStudents(s);
        }}
        onPreviewStudent={(s) => {
          setIsAdminOpen(false);
          setSelectedStudent(s);
        }}
        isLiveFirebase={isLiveFirebase}
      />

      {/* Mandatory Footer: @copyright Pak GuruAI */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />
    </div>
  );
}
