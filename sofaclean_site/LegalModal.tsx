'use client';
import { useEffect } from 'react';
import { X } from 'lucide-react';
type LegalKind = 'terms' | 'returns' | 'privacy';
const routes: Record<LegalKind,string> = { terms:'/sofaclean/termos-e-condicoes', returns:'/sofaclean/politica-de-devolucoes', privacy:'/sofaclean/privacidade' };
const titles: Record<LegalKind,string> = { terms:'Termos e Condições', returns:'Política de Devoluções', privacy:'Política de Privacidade' };
export function LegalModal({ kind, onClose }: { kind: LegalKind; onClose: () => void }) {
  useEffect(() => { const key=(e:KeyboardEvent)=>e.key==='Escape'&&onClose(); document.addEventListener('keydown',key); const old=document.body.style.overflow; document.body.style.overflow='hidden'; return()=>{document.removeEventListener('keydown',key);document.body.style.overflow=old}; },[onClose]);
  return <div className="legal-modal-backdrop" role="presentation" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><section className="legal-modal" role="dialog" aria-modal="true" aria-labelledby="legal-modal-title"><button className="legal-modal-close" type="button" onClick={onClose} aria-label="Fechar"><X size={22}/></button><h2 id="legal-modal-title" className="legal-modal-heading">{titles[kind]}</h2><iframe className="legal-modal-frame" title={titles[kind]} src={routes[kind]} /></section></div>;
}
