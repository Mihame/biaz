import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center text-[#1E1A17]">
      <h2 className="text-2xl font-bold font-heading mb-2">404 - Page Non Trouvée / الصفحة غير موجودة</h2>
      <p className="text-sm text-[#6B635B] mb-6">
        La page que vous recherchez n’existe pas ou a été déplacée. / الصفحة المطلوبة غير متوفرة.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-[#1E1A17] text-white text-xs font-bold rounded-xs hover:bg-[#9A5B2E] transition-colors"
      >
        العودة إلى المتجر · Retour à l’accueil
      </Link>
    </div>
  );
}
