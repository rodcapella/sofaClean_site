'use client';
import { X } from 'lucide-react';
import './modal.css';
export function LegalModal({ path, title, onClose }: { path: string; title: string; onClose: () => void }) {
  return <div className={"contactOverlay"} role="presentation" onMouseDown={onClose}><section className={"legalModal"} role="dialog" aria-modal="true" aria-labelledby="legal-modal-title" onMouseDown={e => e.stopPropagation()}><button className={"contactClose"} onClick={onClose} aria-label="Fechar"><X size={20}/></button><h2 id="legal-modal-title">{title}</h2><iframe className={"legalFrame"} src={path} title={title}/></section></div>;
}

