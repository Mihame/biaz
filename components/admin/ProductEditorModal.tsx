'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Product, ProductColorVariant, ShoeStyle, ShoeSize, ProductImageAngle } from '@/data/types';
import {
  X,
  Plus,
  Trash2,
  Upload,
  Check,
  Star,
  Layers,
  Palette,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowUp,
} from 'lucide-react';

interface ProductEditorModalProps {
  isOpen: boolean;
  product: Product | null; // null = Add New, object = Edit
  onClose: () => void;
  onSaved: (product: Product) => void;
  adminFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

// Preset library of authentic footwear images for quick selection
const PRESET_LIBRARY_IMAGES = [
  {
    title: 'أوكسفورد أسود (Vue principale)',
    url: '/images/hero_oxford_leather_1792953837188.jpg',
  },
  {
    title: 'أوكسفورد كونياك فاخر',
    url: '/images/biaz_oxford_cognac.jpg',
  },
  {
    title: 'أوكسفورد بني شوكولاتة',
    url: '/images/biaz_oxford_dark_brown.jpg',
  },
  {
    title: 'موكاسين أسود كلاسيكي',
    url: '/images/biaz_loafer_noir.jpg',
  },
  {
    title: 'موكاسين أزرق كحلي (3 زوايا أصلية)',
    url: '/public/assets/aistudio/Screenshot_2026-10-28_200149_5cf363ac.png',
  },
  {
    title: 'نعل جلد طبيعي أصلي',
    url: '/images/craft_leather_sole_1792953851868.jpg',
  },
  {
    title: 'خياطة متقنة للجلد',
    url: '/images/craft_welt_stitch_1792953850875.jpg',
  },
  {
    title: 'مسامية ونعومة الجلد الطبيعي',
    url: '/images/craft_leather_grain_1792953850533.jpg',
  },
];

// Quick color templates for luxury menswear
const COLOR_PRESETS = [
  { ar: 'أسود أبنوسي', fr: 'Noir Ébène', hex: '#181716' },
  { ar: 'بني داكن شوكولاتة', fr: 'Marron Chocolat', hex: '#3D281E' },
  { ar: 'بني فاتح كلاسيكي', fr: 'Marron Clair', hex: '#8B5A2B' },
  { ar: 'بني كونياك فاخر', fr: 'Cognac Patiné', hex: '#9A5B2E' },
  { ar: 'أزرق كحلي ملكي', fr: 'Bleu Marine', hex: '#1B263B' },
  { ar: 'عنابي بوردو', fr: 'Bordeaux', hex: '#4A1525' },
];

const STANDARD_SIZES_TEMPLATE: ShoeSize[] = [
  { eu: 39, cm: 25.5, status: 'in_stock', stock: 5 },
  { eu: 40, cm: 26.0, status: 'in_stock', stock: 8 },
  { eu: 41, cm: 26.5, status: 'in_stock', stock: 12 },
  { eu: 42, cm: 27.0, status: 'in_stock', stock: 10 },
  { eu: 43, cm: 27.5, status: 'in_stock', stock: 6 },
  { eu: 44, cm: 28.0, status: 'in_stock', stock: 4 },
  { eu: 45, cm: 28.5, status: 'in_stock', stock: 3 },
];

export default function ProductEditorModal({
  isOpen,
  product,
  onClose,
  onSaved,
  adminFetch,
}: ProductEditorModalProps) {
  // Form State
  const [modelName, setModelName] = useState('');
  const [shoeTypeAr, setShoeTypeAr] = useState('أوكسفورد كلاسيكي برأس مستقيم');
  const [shoeTypeFr, setShoeTypeFr] = useState('Richelieu Oxford à bout droit');
  const [style, setStyle] = useState<ShoeStyle>('oxford');
  const [priceMAD, setPriceMAD] = useState<number | string>(1850);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [descriptionAr, setDescriptionAr] = useState(
    'حذاء استثنائي مصنوع من أجود أنواع الجلود الطبيعية. خياطة وتجميع متقنان يضمنان راحة مشي تدوم طويلاً.'
  );
  const [descriptionFr, setDescriptionFr] = useState(
    'Soulier d’exception taillé dans les cuirs les plus nobles. Montage soigné garantissant souplesse et pérennité.'
  );

  // Color Variants State
  const [colors, setColors] = useState<ProductColorVariant[]>([]);
  const [expandedColorId, setExpandedColorId] = useState<string | null>(null);

  // Active color image URL input state
  const [customImageUrl, setCustomImageUrl] = useState<Record<string, string>>({});
  const [showImagePickerForColor, setShowImagePickerForColor] = useState<string | null>(null);

  // Submission State
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Reset or Populate form when product changes
  useEffect(() => {
    if (!isOpen) return;

    if (product) {
      setModelName(product.modelName);
      setShoeTypeAr(product.shoeTypeAr || 'أوكسفورد كلاسيكي برأس مستقيم');
      setShoeTypeFr(product.shoeTypeFr || 'Richelieu Oxford à bout droit');
      setStyle(product.style || 'oxford');
      setPriceMAD(product.priceMAD);
      setIsBestSeller(Boolean(product.isBestSeller));
      setIsActive(product.isActive !== false);
      setDescriptionAr(product.descriptionAr || '');
      setDescriptionFr(product.descriptionFr || '');

      const initialColors = (product.colors && product.colors.length > 0)
        ? JSON.parse(JSON.stringify(product.colors))
        : [
            {
              id: 'c-1',
              colorNameAr: product.colorNameAr || 'أسود أبنوسي',
              colorNameFr: product.colorNameFr || 'Noir Ébène',
              colorHex: product.colorHex || '#181716',
              inStock: true,
              images: product.images || [
                {
                  label: 'Vue principale',
                  angle: 'side' as const,
                  url: '/images/hero_oxford_leather_1792953837188.jpg',
                  alt: product.modelName,
                },
              ],
              availableSizes: product.availableSizes || STANDARD_SIZES_TEMPLATE,
            },
          ];
      setColors(initialColors);
      setExpandedColorId(initialColors[0]?.id || null);
    } else {
      // New Product Template
      setModelName('');
      setShoeTypeAr('أوكسفورد كلاسيكي برأس مستقيم');
      setShoeTypeFr('Richelieu Oxford à bout droit');
      setStyle('oxford');
      setPriceMAD(1850);
      setIsBestSeller(false);
      setIsActive(true);
      setDescriptionAr(
        'حذاء استثنائي مصنوع من أجود أنواع الجلود الطبيعية. خياطة وتجميع متقنان يضمنان راحة مشي تدوم طويلاً.'
      );
      setDescriptionFr(
        'Soulier d’exception taillé dans les cuirs les plus nobles. Montage soigné garantissant souplesse et pérennité.'
      );

      const defaultFirstColor: ProductColorVariant = {
        id: `c-${Date.now()}-1`,
        colorNameAr: 'أسود أبنوسي',
        colorNameFr: 'Noir Ébène',
        colorHex: '#181716',
        inStock: true,
        images: [
          {
            label: 'Vue principale',
            angle: 'side',
            url: '/images/hero_oxford_leather_1792953837188.jpg',
            alt: 'حذاء كلاسيكي أسود',
          },
          {
            label: 'Détail couture',
            angle: 'stitching',
            url: '/images/craft_welt_stitch_1792953850875.jpg',
            alt: 'تفاصيل الخياطة',
          },
          {
            label: 'Semelle cuir',
            angle: 'sole',
            url: '/images/craft_leather_sole_1792953851868.jpg',
            alt: 'نعل جلد طبيعي',
          },
        ],
        availableSizes: JSON.parse(JSON.stringify(STANDARD_SIZES_TEMPLATE)),
      };
      setColors([defaultFirstColor]);
      setExpandedColorId(defaultFirstColor.id);
    }

    setFormError(null);
    setSuccessNotice(null);
  }, [isOpen, product]);

  if (!isOpen) return null;

  // Add a new color variant
  const handleAddColor = (preset?: typeof COLOR_PRESETS[0]) => {
    const newColorId = `c-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newColor: ProductColorVariant = {
      id: newColorId,
      colorNameAr: preset ? preset.ar : 'بني داكن',
      colorNameFr: preset ? preset.fr : 'Marron Foncé',
      colorHex: preset ? preset.hex : '#3D281E',
      inStock: true,
      images: [
        {
          label: 'Vue principale',
          angle: 'side',
          url: preset?.hex === '#181716'
            ? '/images/hero_oxford_leather_1792953837188.jpg'
            : preset?.hex === '#9A5B2E'
            ? '/images/biaz_oxford_cognac.jpg'
            : '/images/biaz_oxford_dark_brown.jpg',
          alt: preset?.ar || 'حذاء جلدي',
        },
      ],
      availableSizes: JSON.parse(JSON.stringify(STANDARD_SIZES_TEMPLATE)),
    };

    setColors((prev) => [...prev, newColor]);
    setExpandedColorId(newColorId);
  };

  // Remove a color variant
  const handleRemoveColor = (colorId: string) => {
    if (colors.length <= 1) {
      alert('يجب أن يحتوي المنتج على لون واحد على الأقل.');
      return;
    }
    setColors((prev) => prev.filter((c) => c.id !== colorId));
    if (expandedColorId === colorId) {
      setExpandedColorId(colors.find((c) => c.id !== colorId)?.id || null);
    }
  };

  // Set as primary color (moves to index 0)
  const handleSetPrimaryColor = (colorId: string) => {
    setColors((prev) => {
      const target = prev.find((c) => c.id === colorId);
      if (!target) return prev;
      const rest = prev.filter((c) => c.id !== colorId);
      return [target, ...rest];
    });
  };

  // Update a field in a color variant
  const handleUpdateColor = (colorId: string, updates: Partial<ProductColorVariant>) => {
    setColors((prev) =>
      prev.map((c) => (c.id === colorId ? { ...c, ...updates } : c))
    );
  };

  // Add an image to a color (strictly max 3 images)
  const handleAddImage = (colorId: string, imageUrl: string) => {
    if (!imageUrl.trim()) return;

    setColors((prev) =>
      prev.map((c) => {
        if (c.id !== colorId) return c;
        if (c.images.length >= 3) {
          alert('الحد الأقصى لكل لون هو 3 صور لضمان العرض الفاخر والأنيق.');
          return c;
        }
        const newImg: ProductImageAngle = {
          label: `Vue ${c.images.length + 1}`,
          angle: 'side',
          url: imageUrl.trim(),
          alt: `${c.colorNameAr} - صورة ${c.images.length + 1}`,
        };
        return { ...c, images: [...c.images, newImg] };
      })
    );

    setCustomImageUrl((prev) => ({ ...prev, [colorId]: '' }));
    setShowImagePickerForColor(null);
  };

  // File upload reader for images
  const handleFileUpload = (colorId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleAddImage(colorId, reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Remove an image from a color
  const handleRemoveImage = (colorId: string, imageIndex: number) => {
    setColors((prev) =>
      prev.map((c) => {
        if (c.id !== colorId) return c;
        if (c.images.length <= 1) {
          alert('يجب أن تتوفر صورة واحدة على الأقل لكل لون.');
          return c;
        }
        const updated = c.images.filter((_, i) => i !== imageIndex);
        return { ...c, images: updated };
      })
    );
  };

  // Set an image as primary / first image for this color
  const handleSetFirstImage = (colorId: string, imageIndex: number) => {
    setColors((prev) =>
      prev.map((c) => {
        if (c.id !== colorId) return c;
        const targetImg = c.images[imageIndex];
        const rest = c.images.filter((_, i) => i !== imageIndex);
        return { ...c, images: [targetImg, ...rest] };
      })
    );
  };

  // Update Size stock or status
  const handleUpdateSize = (colorId: string, euSize: number, updates: Partial<ShoeSize>) => {
    setColors((prev) =>
      prev.map((c) => {
        if (c.id !== colorId) return c;
        const currentSizes = c.availableSizes || STANDARD_SIZES_TEMPLATE;
        const updated = currentSizes.map((s) => (s.eu === euSize ? { ...s, ...updates } : s));
        return { ...c, availableSizes: updated };
      })
    );
  };

  // Add custom size to a color
  const handleAddCustomSize = (colorId: string, sizeInput: number) => {
    if (!sizeInput || sizeInput < 35 || sizeInput > 50) {
      alert('يرجى إدخال رقم مقاس أوروبي صحيح (بين 35 و 50).');
      return;
    }

    setColors((prev) =>
      prev.map((c) => {
        if (c.id !== colorId) return c;
        const currentSizes = c.availableSizes || [];
        if (currentSizes.some((s) => s.eu === sizeInput)) {
          alert('هذا المقاس موجود مسبقاً.');
          return c;
        }
        const newSizeObj: ShoeSize = {
          eu: sizeInput,
          cm: 20 + (sizeInput - 30) * 0.65,
          status: 'in_stock',
          stock: 5,
        };
        const sorted = [...currentSizes, newSizeObj].sort((a, b) => a.eu - b.eu);
        return { ...c, availableSizes: sorted };
      })
    );
  };

  // Remove size from a color
  const handleRemoveSize = (colorId: string, euSize: number) => {
    setColors((prev) =>
      prev.map((c) => {
        if (c.id !== colorId) return c;
        const currentSizes = c.availableSizes || [];
        if (currentSizes.length <= 1) {
          alert('يجب الإبقاء على مقاس واحد على الأقل.');
          return c;
        }
        return { ...c, availableSizes: currentSizes.filter((s) => s.eu !== euSize) };
      })
    );
  };

  // Populate standard sizes (39-45)
  const handlePopulateStandardSizes = (colorId: string) => {
    setColors((prev) =>
      prev.map((c) => {
        if (c.id !== colorId) return c;
        return { ...c, availableSizes: JSON.parse(JSON.stringify(STANDARD_SIZES_TEMPLATE)) };
      })
    );
  };

  // Save Product to Backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessNotice(null);

    if (!modelName.trim()) {
      setFormError('يرجى كتابة اسم المنتج بالعربية أو الفرنسية.');
      return;
    }

    const price = Number(priceMAD);
    if (isNaN(price) || price <= 0) {
      setFormError('يرجى إدخال سعر صحيح بالدرهم المغربي.');
      return;
    }

    if (colors.length === 0) {
      setFormError('يجب إضافة لون واحد على الأقل للمنتج.');
      return;
    }

    // Verify all colors have at least 1 image and valid names
    for (const c of colors) {
      if (!c.colorNameAr.trim() || !c.colorNameFr.trim()) {
        setFormError('يرجى التأكد من كتابة اسم اللون بالعربية والفرنسية لجميع الألوان.');
        return;
      }
      if (!c.images || c.images.length === 0) {
        setFormError(`يرجى إضافة صورة واحدة على الأقل للون: ${c.colorNameAr}.`);
        return;
      }
    }

    try {
      setIsSaving(true);

      const payload = {
        id: product?.id,
        modelName: modelName.trim(),
        shoeTypeAr: shoeTypeAr.trim(),
        shoeTypeFr: shoeTypeFr.trim(),
        style,
        priceMAD: price,
        isBestSeller,
        isActive,
        descriptionAr: descriptionAr.trim(),
        descriptionFr: descriptionFr.trim(),
        colors,
      };

      const res = await adminFetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'حدث خطأ أثناء حفظ المنتج في قاعدة البيانات.');
      }

      setSuccessNotice('تم حفظ المنتج وجميع ألوانه ومقاساته بنجاح!');
      setTimeout(() => {
        onSaved(data.product);
        onClose();
      }, 700);
    } catch (err: any) {
      console.error('[Product Editor Modal] Save error:', err);
      setFormError(err.message || 'فشلت عملية الحفظ. يرجى التأكد من الاتصال والمحاولة مجدداً.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white border border-[#E2DAD0] rounded-sm shadow-2xl p-5 sm:p-8 space-y-6 text-start max-h-[92vh] overflow-y-auto animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2DAD0]">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1E1A17] flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#9A5B2E]" />
              <span>{product ? `تعديل الحذاء: ${product.modelName}` : 'إضافة حذاء جديد بعدة ألوان'}</span>
            </h2>
            <p className="text-xs text-[#6B635B] mt-1">
              أضف حذاءً واحداً بعدة ألوان حقيقية مع صور ومقاسات ومخزون خاص بكل لون.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xs hover:bg-[#FAF8F5] text-[#6B635B] hover:text-[#1E1A17] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error / Success Alerts */}
        {formError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xs text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{formError}</span>
          </div>
        )}

        {successNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xs text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successNotice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: Basic Information */}
          <div className="space-y-4 p-4 sm:p-5 bg-[#FAF8F5] rounded-xs border border-[#E2DAD0]">
            <h3 className="text-xs font-bold text-[#9A5B2E] uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>1. المعلومات الأساسية للحذاء</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Model Name */}
              <div>
                <label className="font-bold text-[#1E1A17] block mb-1">
                  اسم الحذاء / الموديل <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="مثال: حذاء كلاسيكي جلدي / Le Royal"
                  required
                  className="w-full p-2.5 bg-white border border-[#E2DAD0] rounded-xs focus:outline-none focus:border-[#9A5B2E]"
                />
              </div>

              {/* Price MAD */}
              <div>
                <label className="font-bold text-[#1E1A17] block mb-1">
                  السعر بالدرهم المغربي (MAD) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={priceMAD}
                  onChange={(e) => setPriceMAD(e.target.value)}
                  placeholder="مثال: 1950"
                  required
                  className="w-full p-2.5 bg-white border border-[#E2DAD0] rounded-xs font-mono font-bold text-[#1E1A17] focus:outline-none focus:border-[#9A5B2E]"
                />
              </div>

              {/* Shoe Type Arabic */}
              <div>
                <label className="font-bold text-[#1E1A17] block mb-1">نوع الحذاء بالعربية</label>
                <input
                  type="text"
                  value={shoeTypeAr}
                  onChange={(e) => setShoeTypeAr(e.target.value)}
                  placeholder="مثال: أوكسفورد ريشيليو برأس مستقيم"
                  className="w-full p-2.5 bg-white border border-[#E2DAD0] rounded-xs focus:outline-none focus:border-[#9A5B2E]"
                />
              </div>

              {/* Shoe Type French */}
              <div>
                <label className="font-bold text-[#1E1A17] block mb-1">نوع الحذاء بالفرنسية</label>
                <input
                  type="text"
                  value={shoeTypeFr}
                  onChange={(e) => setShoeTypeFr(e.target.value)}
                  placeholder="Ex: Richelieu Oxford à bout droit"
                  className="w-full p-2.5 bg-white border border-[#E2DAD0] rounded-xs focus:outline-none focus:border-[#9A5B2E]"
                  dir="ltr"
                />
              </div>

              {/* Style Category */}
              <div>
                <label className="font-bold text-[#1E1A17] block mb-1">الفئة والتصنيف</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as ShoeStyle)}
                  className="w-full p-2.5 bg-white border border-[#E2DAD0] rounded-xs focus:outline-none focus:border-[#9A5B2E] cursor-pointer"
                >
                  <option value="oxford">أوكسفورد كلاسيكي (Oxford)</option>
                  <option value="derby">ديربي برباط مفتوح (Derby)</option>
                  <option value="loafer">موكاسين بدون رباط (Loafer)</option>
                  <option value="boot">بوت تشيلسي (Chelsea Boot)</option>
                </select>
              </div>

              {/* Status Toggles */}
              <div className="flex items-center gap-6 pt-5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 accent-[#1E1A17] rounded cursor-pointer"
                  />
                  <span className="font-bold text-[#1E1A17]">معروض في المتجر (نشط)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="w-4 h-4 accent-[#9A5B2E] rounded cursor-pointer"
                  />
                  <span className="font-bold text-[#9A5B2E] flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#9A5B2E]" />
                    <span>الأكثر مبيعاً</span>
                  </span>
                </label>
              </div>

              {/* Description Arabic */}
              <div className="sm:col-span-2">
                <label className="font-bold text-[#1E1A17] block mb-1">الوصف بالعربية</label>
                <textarea
                  rows={2}
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E2DAD0] rounded-xs focus:outline-none focus:border-[#9A5B2E]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Product Colors, Photos, Sizes & Stock */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E2DAD0]">
              <div>
                <h3 className="text-xs font-bold text-[#9A5B2E] uppercase tracking-wider flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  <span>2. ألوان الحذاء وصوره ومقاساته ({colors.length})</span>
                </h3>
                <span className="text-[11px] text-[#6B635B]">
                  يظهر هذا الحذاء كبطاقة واحدة في المتجر مع تبديل الصور تلقائياً حسب اللون.
                </span>
              </div>

              {/* Quick Add Color Preset Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-[#6B635B] hidden sm:inline">ألوان سريعة:</span>
                {COLOR_PRESETS.map((p) => (
                  <button
                    key={p.hex}
                    type="button"
                    onClick={() => handleAddColor(p)}
                    className="text-[11px] px-2 py-1 bg-white border border-[#E2DAD0] rounded-xs hover:border-[#9A5B2E] flex items-center gap-1 transition-colors cursor-pointer"
                    title={`إضافة ${p.ar}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: p.hex }} />
                    <span>{p.ar.split(' ')[0]}</span>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => handleAddColor()}
                  className="text-xs font-bold px-3 py-1.5 bg-[#1E1A17] text-white rounded-xs hover:bg-[#9A5B2E] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة لون</span>
                </button>
              </div>
            </div>

            {/* Colors Accordion List */}
            <div className="space-y-4">
              {colors.map((c, colorIndex) => {
                const isExpanded = expandedColorId === c.id;
                const isPrimary = colorIndex === 0;

                return (
                  <div
                    key={c.id}
                    className={`rounded-xs border transition-all ${
                      isPrimary
                        ? 'border-[#9A5B2E]/60 bg-white shadow-xs'
                        : 'border-[#E2DAD0] bg-white'
                    }`}
                  >
                    {/* Color Card Header */}
                    <div
                      onClick={() => setExpandedColorId(isExpanded ? null : c.id)}
                      className="p-3.5 sm:p-4 bg-[#FAF8F5] border-b border-[#E2DAD0] flex items-center justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Swatch Dot */}
                        <span
                          className="w-5 h-5 rounded-full border border-black/30 shadow-2xs shrink-0"
                          style={{ backgroundColor: c.colorHex }}
                        />

                        {/* Title & Preview */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#1E1A17] truncate">{c.colorNameAr}</span>
                            <span className="text-xs text-[#6B635B] truncate" dir="ltr">
                              ({c.colorNameFr})
                            </span>
                            {isPrimary && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-xs bg-[#9A5B2E]/15 text-[#9A5B2E]">
                                اللون الرئيسي
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#6B635B]">
                            {c.images.length} صور · {(c.availableSizes || []).length} مقاسات ·{' '}
                            {c.inStock !== false ? (
                              <span className="text-emerald-700 font-bold">متوفر</span>
                            ) : (
                              <span className="text-red-700 font-bold">غير متوفر</span>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Header Actions */}
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {!isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryColor(c.id)}
                            className="text-[11px] px-2.5 py-1 bg-white border border-[#E2DAD0] hover:border-[#9A5B2E] rounded-xs text-[#6B635B] hover:text-[#9A5B2E] transition-colors flex items-center gap-1 cursor-pointer"
                            title="تعيين هذا اللون ليكون اللون والصورة الافتراضية للحذاء"
                          >
                            <ArrowUp className="w-3 h-3" />
                            <span className="hidden sm:inline">تعيين كرئيسي</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleRemoveColor(c.id)}
                          disabled={colors.length <= 1}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="حذف هذا اللون"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setExpandedColorId(isExpanded ? null : c.id)}
                          className="p-1.5 text-[#6B635B] hover:text-[#1E1A17] cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Color Card Expanded Body */}
                    {isExpanded && (
                      <div className="p-4 sm:p-5 space-y-5 animate-fadeIn">
                        {/* 1. Color Basic Inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                          <div>
                            <label className="font-bold text-[#1E1A17] block mb-1">اسم اللون بالعربية</label>
                            <input
                              type="text"
                              value={c.colorNameAr}
                              onChange={(e) => handleUpdateColor(c.id, { colorNameAr: e.target.value })}
                              placeholder="مثال: أسود أبنوسي"
                              className="w-full p-2 bg-[#FAF8F5] border border-[#E2DAD0] rounded-xs focus:outline-none focus:border-[#9A5B2E]"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-[#1E1A17] block mb-1">اسم اللون بالفرنسية</label>
                            <input
                              type="text"
                              value={c.colorNameFr}
                              onChange={(e) => handleUpdateColor(c.id, { colorNameFr: e.target.value })}
                              placeholder="Ex: Noir Ébène"
                              dir="ltr"
                              className="w-full p-2 bg-[#FAF8F5] border border-[#E2DAD0] rounded-xs focus:outline-none focus:border-[#9A5B2E]"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-[#1E1A17] block mb-1">كود اللون (HEX)</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={c.colorHex}
                                onChange={(e) => handleUpdateColor(c.id, { colorHex: e.target.value })}
                                className="w-8 h-8 rounded border border-[#E2DAD0] cursor-pointer p-0.5"
                              />
                              <input
                                type="text"
                                value={c.colorHex}
                                onChange={(e) => handleUpdateColor(c.id, { colorHex: e.target.value })}
                                className="w-full p-2 bg-[#FAF8F5] border border-[#E2DAD0] rounded-xs font-mono text-[11px]"
                                dir="ltr"
                              />
                            </div>
                          </div>

                          <div className="flex items-center pt-5">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={c.inStock !== false}
                                onChange={(e) => handleUpdateColor(c.id, { inStock: e.target.checked })}
                                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                              />
                              <span className="font-bold text-[#1E1A17]">اللون متوفر للطلب</span>
                            </label>
                          </div>
                        </div>

                        {/* 2. Color Photos (Up to 3 Photos strictly) */}
                        <div className="space-y-3 pt-3 border-t border-[#E2DAD0]/70">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs font-bold text-[#1E1A17] flex items-center gap-1.5">
                                <ImageIcon className="w-3.5 h-3.5 text-[#9A5B2E]" />
                                <span>صور الحذاء بهذا اللون (المتوفر: {c.images.length}/3)</span>
                              </span>
                              <p className="text-[11px] text-[#6B635B]">
                                الصورة الأولى هي الصورة الأساسية للون. الحد الأقصى 3 صور لكل لون.
                              </p>
                            </div>

                            {/* Add Photo Button */}
                            {c.images.length < 3 && (
                              <div className="flex items-center gap-2">
                                <input
                                  type="file"
                                  accept="image/*"
                                  ref={(el) => { fileInputRefs.current[c.id] = el; }}
                                  onChange={(e) => handleFileUpload(c.id, e)}
                                  className="hidden"
                                />
                                <button
                                  type="button"
                                  onClick={() => fileInputRefs.current[c.id]?.click()}
                                  className="text-xs font-semibold px-2.5 py-1.5 bg-[#FAF8F5] hover:bg-[#E2DAD0]/40 border border-[#E2DAD0] rounded-xs text-[#1E1A17] flex items-center gap-1 cursor-pointer"
                                >
                                  <Upload className="w-3 h-3 text-[#9A5B2E]" />
                                  <span>رفع صورة</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setShowImagePickerForColor(showImagePickerForColor === c.id ? null : c.id)}
                                  className="text-xs font-semibold px-2.5 py-1.5 bg-white hover:bg-[#FAF8F5] border border-[#E2DAD0] rounded-xs text-[#9A5B2E] flex items-center gap-1 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>من المكتبة</span>
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Quick Library Picker Drawer */}
                          {showImagePickerForColor === c.id && (
                            <div className="p-3 bg-[#FAF8F5] rounded-xs border border-[#9A5B2E]/40 space-y-2 animate-fadeIn">
                              <span className="text-xs font-bold text-[#1E1A17] block">
                                اختر صورة أصلية من مكتبة BIAZ أو أدخل رابطاً مخصصاً:
                              </span>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {PRESET_LIBRARY_IMAGES.map((preset, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleAddImage(c.id, preset.url)}
                                    className="p-1.5 bg-white border border-[#E2DAD0] hover:border-[#9A5B2E] rounded-xs text-start space-y-1 transition-colors cursor-pointer group"
                                  >
                                    <div className="aspect-[4/3] bg-[#F7F5F0] overflow-hidden rounded-2xs">
                                      <img src={preset.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    </div>
                                    <span className="text-[10px] text-[#1E1A17] font-medium block truncate">
                                      {preset.title}
                                    </span>
                                  </button>
                                ))}
                              </div>

                              {/* Direct URL input */}
                              <div className="pt-2 flex items-center gap-2">
                                <input
                                  type="url"
                                  placeholder="أو الصق رابط صورة مباشر (URL)..."
                                  value={customImageUrl[c.id] || ''}
                                  onChange={(e) => setCustomImageUrl((prev) => ({ ...prev, [c.id]: e.target.value }))}
                                  className="flex-1 p-2 bg-white border border-[#E2DAD0] rounded-xs text-xs"
                                  dir="ltr"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleAddImage(c.id, customImageUrl[c.id] || '')}
                                  className="px-3 py-2 bg-[#1E1A17] text-white text-xs font-bold rounded-xs cursor-pointer hover:bg-[#9A5B2E]"
                                >
                                  إضافة الرابط
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Render Color Photos Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {c.images.map((img, imgIndex) => (
                              <div
                                key={imgIndex}
                                className="p-2 bg-[#FAF8F5] border border-[#E2DAD0] rounded-xs space-y-2 relative group"
                              >
                                <div className="aspect-[4/3] bg-white rounded-2xs overflow-hidden border border-[#E2DAD0]">
                                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                                </div>

                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="font-semibold text-[#1E1A17]">
                                    {imgIndex === 0 ? 'الصورة الأولى (الرئيسية)' : `زاوية إضافية ${imgIndex + 1}`}
                                  </span>

                                  <div className="flex items-center gap-1">
                                    {imgIndex > 0 && (
                                      <button
                                        type="button"
                                        onClick={() => handleSetFirstImage(c.id, imgIndex)}
                                        className="p-1 text-[#6B635B] hover:text-[#9A5B2E] hover:bg-white rounded cursor-pointer"
                                        title="تعيين كصورة أولى لهذا اللون"
                                      >
                                        <ArrowUp className="w-3.5 h-3.5" />
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() => handleRemoveImage(c.id, imgIndex)}
                                      disabled={c.images.length <= 1}
                                      className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-30 cursor-pointer"
                                      title="حذف الصورة"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 3. Sizes & Stock for this color */}
                        <div className="space-y-3 pt-3 border-t border-[#E2DAD0]/70">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs font-bold text-[#1E1A17] block">
                                المقاسات والمخزون المتوفر لهذا اللون ({c.availableSizes?.length || 0})
                              </span>
                              <p className="text-[11px] text-[#6B635B]">
                                حدد المقاسات المتوفرة وعدد الأزواج في المخزون. المقاس الذي مخزونه 0 لن يُسمح بطلبه.
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handlePopulateStandardSizes(c.id)}
                              className="text-[11px] font-semibold px-2.5 py-1 bg-[#FAF8F5] border border-[#E2DAD0] rounded-xs hover:border-[#9A5B2E] text-[#1E1A17] cursor-pointer"
                            >
                              المقاسات القياسية (39-45)
                            </button>
                          </div>

                          {/* Sizes Table / Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                            {(c.availableSizes || STANDARD_SIZES_TEMPLATE).map((sizeObj) => {
                              const isOutOfStock = (sizeObj.stock !== undefined && sizeObj.stock <= 0) || sizeObj.status === 'made_to_order';

                              return (
                                <div
                                  key={sizeObj.eu}
                                  className={`p-2 rounded-xs border text-center space-y-1.5 ${
                                    isOutOfStock
                                      ? 'bg-red-50/40 border-red-200'
                                      : 'bg-[#FAF8F5] border-[#E2DAD0]'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold font-mono text-[#1E1A17]">
                                      {sizeObj.eu}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveSize(c.id, sizeObj.eu)}
                                      className="text-red-500 hover:text-red-700 text-xs"
                                      title="حذف المقاس"
                                    >
                                      ×
                                    </button>
                                  </div>

                                  <div className="space-y-1 text-[11px]">
                                    <div className="flex items-center justify-center gap-1">
                                      <span className="text-[#6B635B] text-[10px]">المخزون:</span>
                                      <input
                                        type="number"
                                        min="0"
                                        value={sizeObj.stock ?? 5}
                                        onChange={(e) =>
                                          handleUpdateSize(c.id, sizeObj.eu, {
                                            stock: Math.max(0, parseInt(e.target.value) || 0),
                                            status: parseInt(e.target.value) <= 0 ? 'made_to_order' : 'in_stock',
                                          })
                                        }
                                        className="w-12 text-center p-0.5 bg-white border border-[#E2DAD0] rounded-2xs font-mono font-bold"
                                      />
                                    </div>

                                    <select
                                      value={sizeObj.status}
                                      onChange={(e) =>
                                        handleUpdateSize(c.id, sizeObj.eu, {
                                          status: e.target.value as any,
                                          stock: e.target.value === 'made_to_order' ? 0 : (sizeObj.stock || 5),
                                        })
                                      }
                                      className="w-full text-[10px] p-0.5 bg-white border border-[#E2DAD0] rounded-2xs cursor-pointer"
                                    >
                                      <option value="in_stock">متوفر</option>
                                      <option value="low_stock">محدود</option>
                                      <option value="made_to_order">نفد المخزون</option>
                                    </select>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Quick Add Custom Size Button */}
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-[11px] text-[#6B635B]">إضافة مقاس آخر:</span>
                            {[38, 46, 47, 48].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => handleAddCustomSize(c.id, s)}
                                className="text-[11px] px-2 py-0.5 bg-white border border-[#E2DAD0] hover:border-[#1E1A17] rounded-xs font-mono cursor-pointer"
                              >
                                + {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-[#E2DAD0] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-[#6B635B]">
              سيتم حفظ المنتج وتحديث ظهوره في المتجر فوراً.
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xs border border-[#E2DAD0] bg-white text-[#1E1A17] text-xs font-semibold hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              >
                إلغاء
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xs bg-[#1E1A17] hover:bg-[#9A5B2E] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جارٍ الحفظ في قاعدة البيانات...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{product ? 'حفظ التعديلات' : 'حفظ المنتج وإضافته للمتجر'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
