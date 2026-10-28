'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import {
  Search,
  PackageCheck,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  ShieldCheck,
  MapPin,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { WHATSAPP_DISPLAY, WHATSAPP_PHONE } from '@/data/translations';

interface TrackOrderResponse {
  orderId: string;
  createdAt: string;
  updatedAt?: string;
  status: 'new' | 'reviewed' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customerCity: string;
  maskedCustomerName: string;
  maskedPhone: string;
  item: {
    productId: string;
    modelName: string;
    shoeTypeFr: string;
    shoeTypeAr: string;
    colorNameFr?: string;
    colorNameAr?: string;
    colorHex?: string;
    size: number;
    quantity: number;
    unitPriceMAD: number;
    totalMAD: number;
  };
  pricing: {
    totalMAD: number;
    deliveryFeeMAD: number;
  };
}

export default function TrackOrderPage() {
  const { language, direction, t, navigateTo, openProductDetail } = useShop();

  const [orderIdInput, setOrderIdInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<TrackOrderResponse | null>(null);

  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setOrderResult(null);

    const cleanOrderId = orderIdInput.trim();
    const cleanPhone = phoneInput.trim();

    if (!cleanOrderId || !cleanPhone) {
      setErrorMsg(
        language === 'fr'
          ? 'Veuillez saisir votre numéro de commande et votre numéro de téléphone.'
          : 'يرجى إدخال رقم الطلب ورقم الهاتف المرتبط به.'
      );
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: cleanOrderId,
          phone: cleanPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          language === 'fr'
            ? (data.errorFr || t.track.notFoundError)
            : (data.error || t.track.notFoundError)
        );
      }

      setOrderResult(data.order);
    } catch (err: any) {
      setErrorMsg(err.message || t.track.notFoundError);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine current timeline active step (1 to 4)
  const getStepProgress = (status: TrackOrderResponse['status']) => {
    switch (status) {
      case 'new':
      case 'reviewed':
        return 1;
      case 'confirmed':
      case 'processing':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      case 'cancelled':
        return -1;
      default:
        return 1;
    }
  };

  const getStatusBadge = (status: TrackOrderResponse['status']) => {
    switch (status) {
      case 'new':
      case 'reviewed':
        return {
          label: language === 'fr' ? 'Reçue · En attente de confirmation' : 'تم استلام الطلب · قيد المراجعة',
          colorClass: 'bg-amber-500/10 text-amber-900 border-amber-300',
          dotClass: 'bg-amber-600 animate-pulse',
        };
      case 'confirmed':
      case 'processing':
        return {
          label: language === 'fr' ? 'Confirmée · En préparation' : 'طلب مؤكد · قيد التجهيز في الورشة',
          colorClass: 'bg-emerald-500/10 text-emerald-900 border-emerald-300',
          dotClass: 'bg-emerald-600',
        };
      case 'shipped':
        return {
          label: language === 'fr' ? 'En cours de livraison' : 'قيد التوصيل مع الموزع',
          colorClass: 'bg-blue-500/10 text-blue-900 border-blue-300',
          dotClass: 'bg-blue-600 animate-pulse',
        };
      case 'delivered':
        return {
          label: language === 'fr' ? 'Livrée avec succès' : 'تم التسليم والاستلام بنجاح',
          colorClass: 'bg-[#2F6B4F]/10 text-[#2F6B4F] border-[#2F6B4F]/30',
          dotClass: 'bg-[#2F6B4F]',
        };
      case 'cancelled':
        return {
          label: language === 'fr' ? 'Commande annulée' : 'تم إلغاء الطلب',
          colorClass: 'bg-rose-500/10 text-rose-800 border-rose-300',
          dotClass: 'bg-rose-600',
        };
      default:
        return {
          label: language === 'fr' ? 'En cours' : 'قيد المعالجة',
          colorClass: 'bg-gray-100 text-gray-800 border-gray-300',
          dotClass: 'bg-gray-600',
        };
    }
  };

  const currentStep = orderResult ? getStepProgress(orderResult.status) : 1;
  const badgeInfo = orderResult ? getStatusBadge(orderResult.status) : null;

  return (
    <div className="bg-[#FAF8F5] min-h-[75vh] py-12 sm:py-16 text-[#1E1A17]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* 1. Header & Title */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9A5B2E]/10 border border-[#9A5B2E]/20 text-[#9A5B2E] text-xs font-bold uppercase tracking-wider">
            <Search className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Suivi en direct' : 'متابعة الطلبات المباشرة'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-heading-latin rtl:font-heading-arabic font-bold text-[#1E1A17] tracking-tight">
            {t.track.pageTitle}
          </h1>

          <p className="text-sm sm:text-base text-[#6B635B] leading-relaxed">
            {t.track.pageSubtitle}
          </p>
        </div>

        {/* 2. Tracking Lookup Form */}
        <div className="bg-white border border-[#E2DAD0] rounded-sm p-6 sm:p-8 shadow-xs max-w-2xl mx-auto text-start">
          <form onSubmit={handleTrackSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1A17] mb-1.5">
                {t.track.orderIdLabel} <span className="text-[#9A5B2E]">*</span>
              </label>
              <input
                type="text"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value.toUpperCase())}
                placeholder={t.track.orderIdPlaceholder}
                className="w-full text-sm font-mono px-3.5 py-2.5 rounded-xs border border-[#E2DAD0] bg-[#FAF8F5] focus:outline-none focus:border-[#9A5B2E] focus:bg-white transition-colors"
                autoComplete="off"
                required
              />
              <span className="text-[11px] text-[#6B635B] block mt-1">
                {language === 'fr'
                  ? 'Exemple : BZ-20261028-8798 (reçu lors de la confirmation de votre commande)'
                  : 'مثال: BZ-20261028-8798 (الرقم الممنوح لكم عند إكمال الطلب)'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1A17] mb-1.5">
                {t.track.phoneLabel} <span className="text-[#9A5B2E]">*</span>
              </label>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder={t.track.phonePlaceholder}
                className="w-full text-sm font-mono px-3.5 py-2.5 rounded-xs border border-[#E2DAD0] bg-[#FAF8F5] focus:outline-none focus:border-[#9A5B2E] focus:bg-white transition-colors"
                dir="ltr"
                required
              />
              <span className="text-[11px] text-[#6B635B] block mt-1">
                {language === 'fr'
                  ? 'Le numéro utilisé lors de la saisie de votre commande pour vous authentifier.'
                  : 'رقم الهاتف الذي سجلتم به الطلب لتأكيد هويتكم وحماية خصوصيتكم.'}
              </span>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xs text-xs text-rose-800 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[46px] bg-[#1E1A17] hover:bg-[#9A5B2E] disabled:bg-[#1E1A17]/60 text-white text-xs font-bold py-3 px-6 rounded-xs transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.track.submittingBtn}</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>{t.track.submitBtn}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* 3. Order Result Display */}
        {orderResult && (
          <div className="bg-white border border-[#E2DAD0] rounded-sm p-6 sm:p-8 shadow-sm space-y-8 animate-fadeIn text-start">
            
            {/* Header: Order ID & Live Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2DAD0]">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-[#6B635B] font-medium block">
                  {t.track.orderIdLabel}
                </span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-[#1E1A17] tracking-wider block">
                  {orderResult.orderId}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-[#6B635B]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(orderResult.createdAt).toLocaleDateString(
                      language === 'fr' ? 'fr-FR' : 'ar-MA',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </span>
                </div>
              </div>

              {badgeInfo && (
                <div className="flex items-center sm:self-center">
                  <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xs border text-xs font-bold ${badgeInfo.colorClass}`}>
                    <span className={`w-2 h-2 rounded-full ${badgeInfo.dotClass}`} />
                    <span>{badgeInfo.label}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Stepper Timeline (if not cancelled) */}
            {orderResult.status !== 'cancelled' ? (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#9A5B2E]">
                  {language === 'fr' ? 'Progression de la livraison' : 'مراحل ومسار التوصيل'}
                </h3>

                <div className="relative grid grid-cols-4 gap-2 pt-2 text-center text-xs">
                  {/* Step 1: Received */}
                  <div className="space-y-2">
                    <div
                      className={`w-9 h-9 rounded-full mx-auto flex items-center justify-center font-bold text-xs transition-colors ${
                        currentStep >= 1
                          ? 'bg-[#1E1A17] text-white shadow-xs'
                          : 'bg-[#F1ECE4] text-[#6B635B]'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                    </div>
                    <span className={`block font-semibold ${currentStep >= 1 ? 'text-[#1E1A17]' : 'text-[#6B635B]'}`}>
                      {t.track.step1}
                    </span>
                  </div>

                  {/* Step 2: Confirmed */}
                  <div className="space-y-2">
                    <div
                      className={`w-9 h-9 rounded-full mx-auto flex items-center justify-center font-bold text-xs transition-colors ${
                        currentStep >= 2
                          ? 'bg-[#1E1A17] text-white shadow-xs'
                          : 'bg-[#F1ECE4] text-[#6B635B]'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className={`block font-semibold ${currentStep >= 2 ? 'text-[#1E1A17]' : 'text-[#6B635B]'}`}>
                      {t.track.step2}
                    </span>
                  </div>

                  {/* Step 3: Shipped */}
                  <div className="space-y-2">
                    <div
                      className={`w-9 h-9 rounded-full mx-auto flex items-center justify-center font-bold text-xs transition-colors ${
                        currentStep >= 3
                          ? 'bg-[#1E1A17] text-white shadow-xs'
                          : 'bg-[#F1ECE4] text-[#6B635B]'
                      }`}
                    >
                      <Truck className="w-4 h-4" />
                    </div>
                    <span className={`block font-semibold ${currentStep >= 3 ? 'text-[#1E1A17]' : 'text-[#6B635B]'}`}>
                      {t.track.step4}
                    </span>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="space-y-2">
                    <div
                      className={`w-9 h-9 rounded-full mx-auto flex items-center justify-center font-bold text-xs transition-colors ${
                        currentStep >= 4
                          ? 'bg-[#2F6B4F] text-white shadow-xs'
                          : 'bg-[#F1ECE4] text-[#6B635B]'
                      }`}
                    >
                      <PackageCheck className="w-4 h-4" />
                    </div>
                    <span className={`block font-semibold ${currentStep >= 4 ? 'text-[#2F6B4F]' : 'text-[#6B635B]'}`}>
                      {t.track.step5}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xs text-xs text-rose-800 space-y-1">
                <span className="font-bold block">{t.track.stepCancelled}</span>
                <p>{language === 'fr' ? 'Cette commande a été annulée. Contactez-nous si vous souhaitez renouveler votre achat.' : 'تم إلغاء هذا الطلب. يسعدنا تواصلكم إذا رغبتم في تأكيد حذاء آخر أو إعادة تفعيل الطلب.'}</p>
              </div>
            )}

            {/* 4. Product & Delivery Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E2DAD0]">
              
              {/* Product Info */}
              <div className="p-4 bg-[#FAF8F5] rounded-xs border border-[#E2DAD0] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#9A5B2E]">
                  {t.track.itemTitle}
                </h4>

                <div className="space-y-1.5">
                  <p className="font-bold text-sm text-[#1E1A17]">{orderResult.item.modelName}</p>
                  <p className="text-xs text-[#6B635B]">
                    {language === 'fr' ? orderResult.item.shoeTypeFr : orderResult.item.shoeTypeAr}
                  </p>

                  {/* Color details */}
                  {(orderResult.item.colorNameAr || orderResult.item.colorNameFr) && (
                    <div className="flex items-center gap-1.5 text-xs text-[#1E1A17] pt-1">
                      <span className="text-[#6B635B]">{t.track.colorLabel}:</span>
                      {orderResult.item.colorHex && (
                        <span
                          className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                          style={{ backgroundColor: orderResult.item.colorHex }}
                        />
                      )}
                      <strong>
                        {language === 'fr' ? orderResult.item.colorNameFr : orderResult.item.colorNameAr}
                      </strong>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-1 text-xs">
                    <span className="bg-[#1E1A17] text-white px-2 py-0.5 rounded-xs font-bold">
                      {t.track.sizeLabel} {orderResult.item.size}
                    </span>
                    <span className="text-[#6B635B]">
                      {t.track.qtyLabel}: <strong>{orderResult.item.quantity}</strong>
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2DAD0]/60 space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#6B635B]">
                    <span>{t.track.freeDeliveryBadge}</span>
                    <span className="font-bold text-[#2F6B4F]">0 د.م.</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-1 border-t border-[#1E1A17]/10 text-sm">
                    <span className="font-bold text-[#1E1A17]">{t.track.totalLabel}</span>
                    <span className="font-bold font-mono text-[#9A5B2E] text-base">
                      {orderResult.pricing.totalMAD.toLocaleString()} {t.products.mad}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Info (Privacy Protected / Masked) */}
              <div className="p-4 bg-[#FAF8F5] rounded-xs border border-[#E2DAD0] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#9A5B2E]">
                  {language === 'fr' ? 'Informations de livraison' : 'بيانات التوصيل المحمية'}
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#6B635B] shrink-0" />
                    <span className="text-[#6B635B]">{t.track.customerLabel}:</span>
                    <strong className="text-[#1E1A17]">{orderResult.maskedCustomerName}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#6B635B] shrink-0" />
                    <span className="text-[#6B635B]">{t.track.phoneLabel}:</span>
                    <strong className="text-[#1E1A17] font-mono" dir="ltr">{orderResult.maskedPhone}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#6B635B] shrink-0" />
                    <span className="text-[#6B635B]">{t.track.cityLabel}:</span>
                    <strong className="text-[#1E1A17]">{orderResult.customerCity}</strong>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xs border border-[#E2DAD0] text-[11px] text-[#6B635B] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#1E1A17]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2F6B4F]" />
                    <span>{language === 'fr' ? 'Essayage & Règlement' : 'المعاينة والدفع:'}</span>
                  </div>
                  <p className="leading-relaxed">
                    {language === 'fr'
                      ? 'Le paiement s’effectue en espèces auprès du livreur après avoir essayé votre paire.'
                      : 'الأداء نقدًا عند استلام الحذاء بعد تجربته والتأكد التام من ملائمة المقاس.'}
                  </p>
                </div>
              </div>

            </div>

            {/* Customer Service notice */}
            <div className="p-3.5 bg-[#F1ECE4]/60 border border-[#E2DAD0] rounded-xs text-xs text-[#6B635B] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="leading-relaxed">{t.track.helpText}</p>
              <a
                href={`tel:${WHATSAPP_PHONE}`}
                className="inline-flex items-center gap-1.5 font-bold text-[#1E1A17] hover:text-[#9A5B2E] transition-colors shrink-0"
              >
                <Phone className="w-3.5 h-3.5" />
                <span dir="ltr">{WHATSAPP_DISPLAY}</span>
              </a>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => navigateTo('products')}
                className="w-full sm:w-auto min-h-[44px] bg-[#1E1A17] hover:bg-[#9A5B2E] text-white text-xs font-bold py-2.5 px-6 rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.track.exploreMore}</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="w-full sm:w-auto min-h-[44px] bg-white hover:bg-[#FAF8F5] text-[#1E1A17] border border-[#E2DAD0] text-xs font-bold py-2.5 px-6 rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.track.backHome}</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
