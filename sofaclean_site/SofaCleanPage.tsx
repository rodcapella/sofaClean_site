'use client';
import { useState } from 'react';
import { GeneralServicesLandingPage } from './GeneralServicesLandingPage';
import { generalServicesContent } from './content';
import { ContactModal } from './ContactModal';
export function SofaCleanPage() {
  const [contactOpen, setContactOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const openContact = (nextTopic = '') => { setTopic(nextTopic); setContactOpen(true); };
  return <><GeneralServicesLandingPage content={generalServicesContent} demo={false} onOpenContact={openContact} /><ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} initialTopic={topic} /></>;
}
