'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { MessageCircle, Phone, MapPin, Send, Instagram, Facebook } from 'lucide-react';
import { WHATSAPP_PHONE, WHATSAPP_DISPLAY } from '@/data/translations';

export default function ContactPage() {
  const { t, language, openWhatsApp } = useShop();

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [formSentNotice, setFormSentNotice] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const formattedMessage = language === 'fr'
      ? `Bonjour BIAZ,\n\nJe m'appelle ${name.trim() || 'Client BIAZ'}.\n\nMessage : ${message.trim()}`
      : `مرحباً BIAZ،\n\nالاسم : ${name.trim() || 'عميل BIAZ'}\n\nنص الرسالة والاستفسار : ${message.trim()}`;

    openWhatsApp(formattedMessage);
    setFormSentNotice(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12 sm:space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest rtl:tracking-normal text-[#9A5B2E] font-semibold">
          {language === 'fr' ? 'À Votre Écoute' : 'تواصل مباشر'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-heading-latin rtl:font-heading-arabic font-bold text-[#1E1A17] rtl:tracking-normal">
          {t.contact.pageTitle}
        </h1>
        <p className="text-sm sm:text-base text-[#6B635B] pt-1">
          {t.contact.pageSubtitle}
        </p>
      </div>

      {/* Prominent Direct Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
        
        {/* 1. Large WhatsApp Card */}
        <div className="p-6 bg-white rounded-sm border-2 border-[#25D366]/40 hover:border-[#25D366] transition-colors flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-sm bg-[#25D366]/15 text-[#25D366] flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-[#1E1A17]">
              {t.contact.whatsappCard.title}
            </h2>
            <p className="text-xs text-[#6B635B]">
              {t.contact.whatsappCard.desc}
            </p>
            <p className="text-sm font-bold text-[#1E1A17]">
              <span dir="ltr" className="inline-block font-sans font-semibold">{WHATSAPP_DISPLAY}</span>
            </p>
          </div>

          <button
            onClick={() => openWhatsApp()}
            className="w-full min-h-[44px] bg-[#25D366] text-white hover:bg-[#20ba5a] text-xs font-semibold py-2.5 px-3 rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t.contact.whatsappCard.buttonText}</span>
          </button>
        </div>

        {/* 2. Direct Phone Card */}
        <div className="p-6 bg-white rounded-sm border border-[#E2DAD0] flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-sm bg-[#F1ECE4] text-[#1E1A17] flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-[#1E1A17]">
              {t.contact.phoneCard.title}
            </h2>
            <p className="text-xs text-[#6B635B]">
              {t.contact.phoneCard.hours}
            </p>
            <a
              href={`tel:${WHATSAPP_PHONE}`}
              className="text-sm font-bold text-[#1E1A17] hover:text-[#9A5B2E] transition-colors inline-block"
            >
              <span dir="ltr" className="inline-block font-sans font-semibold">{WHATSAPP_DISPLAY}</span>
            </a>
          </div>

          <a
            href={`tel:${WHATSAPP_PHONE}`}
            className="w-full min-h-[44px] border border-[#1E1A17] text-[#1E1A17] hover:bg-[#1E1A17] hover:text-white text-xs font-semibold py-2.5 px-3 rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>{t.contact.phoneCard.callNow}</span>
          </a>
        </div>

        {/* 3. Location / Service Card */}
        <div className="p-6 bg-white rounded-sm border border-[#E2DAD0] flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-sm bg-[#F1ECE4] text-[#9A5B2E] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-[#1E1A17]">
              {t.contact.locationCard.title}
            </h2>
            <p className="text-sm font-semibold text-[#1E1A17]">
              {t.contact.locationCard.city}
            </p>
            <p className="text-xs text-[#6B635B] leading-relaxed">
              {t.contact.locationCard.note}
            </p>
          </div>

          <div className="pt-2 border-t border-[#E2DAD0]/60 text-xs text-[#6B635B]">
            {t.contact.locationCard.serviceNotice}
          </div>
        </div>

      </div>

      {/* Brief Contact Form (Name + Message only) */}
      <div className="bg-white rounded-sm border border-[#E2DAD0] p-6 sm:p-10 max-w-2xl mx-auto space-y-6 text-start">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-heading-latin rtl:font-heading-arabic font-bold text-[#1E1A17] rtl:tracking-normal">
            {t.contact.form.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#6B635B]">
            {t.contact.form.subtitle}
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="client-name" className="block text-xs font-medium text-[#1E1A17] mb-1">
              {t.contact.form.nameLabel}
            </label>
            <input
              id="client-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.contact.form.namePlaceholder}
              className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-sm py-2.5 px-3.5 text-sm text-[#1E1A17] focus:outline-none focus:border-[#9A5B2E] transition-colors"
            />
          </div>

          <div>
            <label htmlFor="client-message" className="block text-xs font-medium text-[#1E1A17] mb-1">
              {t.contact.form.messageLabel} <span className="text-[#9A5B2E]">*</span>
            </label>
            <textarea
              id="client-message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.contact.form.messagePlaceholder}
              className="w-full bg-[#FAF8F5] border border-[#E2DAD0] rounded-sm py-2.5 px-3.5 text-sm text-[#1E1A17] focus:outline-none focus:border-[#9A5B2E] transition-colors resize-y"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full min-h-[48px] bg-[#25D366] text-white hover:bg-[#20ba5a] text-sm font-semibold py-3 px-4 rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4 rtl:rotate-180" />
              <span>{t.contact.form.submitWhatsApp}</span>
            </button>
            <p className="text-[11px] text-[#6B635B] text-center mt-2">
              {t.contact.form.directNotice}{' '}
              <span dir="ltr" className="inline-block font-sans font-semibold text-[#1E1A17]">{WHATSAPP_DISPLAY}</span>.
            </p>
          </div>

          {formSentNotice && (
            <div className="p-3 bg-[#25D366]/10 border border-[#25D366]/30 rounded-sm text-xs text-[#1E1A17] text-center">
              {t.contact.form.successNotice}
            </div>
          )}
        </form>
      </div>

      {/* Social Media Links */}
      <div className="text-center space-y-4 pt-4 border-t border-[#E2DAD0]">
        <h3 className="text-sm font-semibold text-[#1E1A17]">
          {t.contact.socials.title}
        </h3>
        <div className="flex items-center justify-center gap-6">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-[#6B635B] hover:text-[#9A5B2E] transition-colors"
          >
            <Instagram className="w-4 h-4" />
            <span dir="ltr">{t.contact.socials.instagram}</span>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-[#6B635B] hover:text-[#9A5B2E] transition-colors"
          >
            <Facebook className="w-4 h-4" />
            <span>{t.contact.socials.facebook}</span>
          </a>
        </div>
      </div>

    </div>
  );
}
