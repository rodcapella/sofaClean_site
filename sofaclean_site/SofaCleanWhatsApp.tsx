'use client';

export function SofaCleanWhatsApp() {
  const label = 'Precisa de ajuda?';
  const message = 'Olá! Gostaria de pedir um orçamento à SofaClean.';
  const href = `https://wa.me/351920320174?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} WhatsApp`}
      className="group fixed bottom-4 right-4 z-[70] inline-flex items-center gap-2.5 sm:bottom-5 sm:right-5"
    >
      <span className="rounded-full border border-white/20 bg-[#07152f]/94 px-3.5 py-2 text-[12px] font-bold text-white shadow-[0_12px_30px_rgba(7,21,47,0.28)] backdrop-blur-md transition duration-300 group-hover:-translate-x-0.5 group-hover:border-[#25d366]/60">
        {label}
      </span>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_14px_32px_rgba(37,211,102,0.3)] transition duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:bg-[#20bd5a] sm:h-12 sm:w-12">
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-6 w-6 fill-current">
          <path d="M16.04 3.2A12.72 12.72 0 0 0 5.1 22.4L3.2 28.8l6.58-1.76A12.75 12.75 0 1 0 16.04 3.2Zm0 2.3a10.44 10.44 0 0 1 0 20.88c-1.82 0-3.6-.47-5.16-1.36l-.4-.23-3.9 1.04 1.08-3.79-.26-.4A10.43 10.43 0 0 1 16.04 5.5Zm-4.56 4.68c-.22 0-.58.08-.88.42-.3.33-1.16 1.13-1.16 2.76 0 1.63 1.19 3.2 1.35 3.42.17.22 2.33 3.56 5.65 5 2.8 1.22 3.37.98 3.98.92.6-.05 1.96-.8 2.24-1.58.28-.77.28-1.44.2-1.58-.09-.14-.31-.22-.66-.39-.36-.16-2.07-1.02-2.4-1.13-.31-.11-.55-.17-.77.17-.22.33-.86 1.08-1.05 1.3-.2.22-.39.25-.75.08-.35-.16-1.48-.54-2.82-1.74a10.6 10.6 0 0 1-1.95-2.43c-.2-.36-.02-.55.15-.72.15-.15.35-.39.52-.58.17-.2.22-.33.33-.55.11-.22.06-.41-.03-.58-.08-.17-.77-1.86-1.06-2.55-.28-.67-.57-.58-.78-.6h-.67Z" />
        </svg>
      </span>
    </a>
  );
}

