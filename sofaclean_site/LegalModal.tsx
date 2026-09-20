'use client';
import { X } from 'lucide-react';
import styles from './general-services.module.css';
export function LegalModal({ path, title, onClose }: { path: string; title: string; onClose: () => void }) {
  return <div className={styles.contactOverlay} role="presentation" onMouseDown={onClose}><section className={styles.legalModal} role="dialog" aria-modal="true" aria-labelledby="legal-modal-title" onMouseDown={e => e.stopPropagation()}><button className={styles.contactClose} onClick={onClose} aria-label="Fechar"><X size={20}/></button><h2 id="legal-modal-title">{title}</h2><iframe className={styles.legalFrame} src={path} title={title}/></section></div>;
}
