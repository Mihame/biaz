'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  OrderRecord,
  OrderStatus,
  ORDER_STATUS_META,
  formatCustomerManualWhatsAppUrl,
} from '@/lib/ordersTypes';
import {
  Lock,
  Search,
  Filter,
  RefreshCw,
  LogOut,
  ExternalLink,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  AlertTriangle,
  MessageCircle,
  X,
  Phone,
  MapPin,
  User,
  Copy,
  Check,
  Calendar,
  DollarSign,
  TrendingUp,
  Inbox,
  ShieldAlert,
} from 'lucide-react';

const ADMIN_TOKEN_KEY = 'biaz_admin_session_token';

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

function setStoredToken(token: string | null) {
  if (typeof window === 'undefined') return;
  try {
    if (token) {
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    }
  } catch {}
}

/**
 * Authenticated fetch helper that sends both Authorization header and cookies
 */
async function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
}

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Orders & Data State
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [justRefreshed, setJustRefreshed] = useState(false);

  // Filters State
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [datePreset, setDatePreset] = useState<'all' | 'today' | 'week'>('all');
  const [filterTimestamp, setFilterTimestamp] = useState<number>(0);

  // Detail Modal & Action State
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Guard against concurrent overlapping fetches
  const isFetchingRef = useRef(false);

  // 1. Fetch Orders from Database with safe timeout and error handling
  const fetchOrders = useCallback(async (isManualRefresh = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoadingOrders(true);
    setOrdersError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await adminFetch('/api/orders', {
        signal: controller.signal,
      });

      if (res.status === 401) {
        // Only invalidate if the server confirms unauthorized
        setStoredToken(null);
        setIsAuthenticated(false);
        setLoginError('انتهت صلاحية جلسة الإدارة. يرجى إدخال كلمة المرور مجدداً.');
        return;
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل في تحميل الطلبات من قاعدة البيانات');
      }

      setOrders(data.orders || []);
      setStats(data.stats || null);

      if (isManualRefresh) {
        setJustRefreshed(true);
        setTimeout(() => setJustRefreshed(false), 2000);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setOrdersError('استغرقت العملية وقتاً أطول من المتوقع. اضغط على تحديث للمحاولة مجدداً.');
      } else {
        setOrdersError(err.message || 'خطأ في الاتصال بالخادم');
      }
    } finally {
      clearTimeout(timeoutId);
      setIsLoadingOrders(false);
      isFetchingRef.current = false;
    }
  }, []);

  // 2. Check Authentication on Mount
  useEffect(() => {
    let active = true;
    const runCheck = async () => {
      try {
        const token = getStoredToken();
        const res = await adminFetch('/api/admin/auth');
        const data = await res.json();
        if (!active) return;

        const authed = Boolean(data.authenticated);
        if (authed) {
          setIsAuthenticated(true);
          fetchOrders();
        } else {
          // If neither token nor cookie is valid
          if (token) {
            setStoredToken(null);
          }
          setIsAuthenticated(false);
        }
      } catch {
        if (active) setIsAuthenticated(false);
      }
    };
    runCheck();
    return () => {
      active = false;
    };
  }, [fetchOrders]);

  // 3. Handle Admin Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim() || isLoggingIn) return;

    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'كلمة المرور غير صحيحة');
      }

      if (data.token) {
        setStoredToken(data.token);
      }

      setIsAuthenticated(true);
      setPasswordInput('');
      // Fetch orders immediately with the new token
      fetchOrders();
    } catch (err: any) {
      setLoginError(err.message || 'فشل تسجيل الدخول');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 4. Handle Admin Logout
  const handleLogout = async () => {
    try {
      await adminFetch('/api/admin/auth', { method: 'DELETE' });
    } catch (_) {}
    setStoredToken(null);
    setIsAuthenticated(false);
    setOrders([]);
    setSelectedOrder(null);
  };

  // 5. Update Order Status
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdatingStatus(true);
    try {
      const res = await adminFetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'تعذر تحديث حالة الطلب');
      }

      // Update in local state immediately
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
      );

      if (selectedOrder && selectedOrder.orderId === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }

      // Refresh background stats safely
      fetchOrders();
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء تحديث حالة الطلب');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // 6. Delete Order
  const handleDeleteOrder = async (orderId: string) => {
    setIsDeletingId(orderId);
    try {
      const res = await adminFetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'تعذر حذف الطلب');
      }

      setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
      if (selectedOrder && selectedOrder.orderId === orderId) {
        setSelectedOrder(null);
      }
      setDeleteConfirmationId(null);
      fetchOrders();
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء حذف الطلب');
    } finally {
      setIsDeletingId(null);
    }
  };

  // 7. Filtered Orders Computation
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (selectedStatusFilter !== 'all' && order.status !== selectedStatusFilter) {
        return false;
      }

      // Search query filter (Order ID, customer name, phone, city, model)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = order.orderId.toLowerCase().includes(q);
        const matchesName = order.customer.fullName.toLowerCase().includes(q);
        const matchesPhone = order.customer.phone.replace(/\D/g, '').includes(q.replace(/\D/g, ''));
        const matchesCity = order.customer.city.toLowerCase().includes(q);
        const matchesModel = order.item.modelName.toLowerCase().includes(q);

        if (!matchesId && !matchesName && !matchesPhone && !matchesCity && !matchesModel) {
          return false;
        }
      }

      // Date preset filter
      if (datePreset === 'today') {
        const orderDate = new Date(order.createdAt).toDateString();
        const refToday = new Date(filterTimestamp || 0).toDateString();
        if (orderDate !== refToday) return false;
      } else if (datePreset === 'week') {
        const orderTime = new Date(order.createdAt).getTime();
        const weekAgo = (filterTimestamp || 0) - 7 * 24 * 60 * 60 * 1000;
        if (orderTime < weekAgo) return false;
      }

      return true;
    });
  }, [orders, selectedStatusFilter, searchQuery, datePreset, filterTimestamp]);

  // Loading state while checking session
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6 text-[#1E1A17]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-[#9A5B2E]" />
          <span className="text-xs font-semibold text-[#6B635B]">جاري التحقق من الصلاحيات...</span>
        </div>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4 sm:p-6 text-[#1E1A17] font-arabic"
      >
        <div className="w-full max-w-md bg-white border border-[#E2DAD0] rounded-sm p-6 sm:p-8 shadow-sm space-y-6">
          {/* Brand & Security Header */}
          <div className="text-center space-y-2 pb-4 border-b border-[#E2DAD0]">
            <div className="w-12 h-12 rounded-full bg-[#1E1A17] text-[#E5C158] flex items-center justify-center mx-auto mb-2 shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold font-heading-arabic text-[#1E1A17]">
              BIAZ Shoes · لوحة تحكم الإدارة
            </h1>
            <p className="text-xs text-[#6B635B]">
              هذه المنطقة مخصصة لإدارة ومتابعة طلبات المتجر فقط.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1E1A17] mb-1.5">
                كلمة مرور الإدارة
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (loginError) setLoginError(null);
                }}
                placeholder="أدخل كلمة مرور المسؤول..."
                className="w-full text-sm px-3.5 py-2.5 rounded-xs border border-[#E2DAD0] bg-[#FAF8F5] focus:outline-none focus:border-[#9A5B2E] focus:bg-white transition-colors"
                autoFocus
              />
            </div>

            {loginError && (
              <div className="p-3 bg-[#A33A2B]/10 border border-[#A33A2B]/30 rounded-xs text-xs text-[#A33A2B] font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn || !passwordInput.trim()}
              className="w-full min-h-[46px] bg-[#1E1A17] hover:bg-[#9A5B2E] disabled:bg-[#1E1A17]/60 text-white text-xs font-bold py-2.5 px-4 rounded-xs transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جاري الدخول...</span>
                </>
              ) : (
                <span>دخول إلى لوحة التحكم</span>
              )}
            </button>

            <div className="pt-2 text-center">
              <Link
                href="/"
                className="text-[11px] font-semibold text-[#6B635B] hover:text-[#9A5B2E] transition-colors inline-flex items-center gap-1"
              >
                <span>العودة إلى متجر BIAZ Shoes</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD
  return (
    <div dir="rtl" className="min-h-screen bg-[#FAF8F5] text-[#1E1A17] font-arabic flex flex-col">
      {/* 1. Admin Header Bar */}
      <header className="bg-white border-b border-[#E2DAD0] sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-lg sm:text-xl font-bold tracking-tight font-heading-arabic text-[#1E1A17]">
              BIAZ <span className="text-[#9A5B2E]">SHOES</span>
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-xs bg-[#1E1A17] text-white">
              لوحة إدارة الطلبات
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => fetchOrders(true)}
              disabled={isLoadingOrders}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xs border border-[#E2DAD0] bg-white hover:bg-[#FAF8F5] text-[#1E1A17] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              title="تحديث قائمة الطلبات"
            >
              {justRefreshed ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">تم التحديث</span>
                </>
              ) : (
                <>
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin text-[#9A5B2E]' : ''}`} />
                  <span className="hidden sm:inline">{isLoadingOrders ? 'جارٍ التحديث...' : 'تحديث'}</span>
                </>
              )}
            </button>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xs border border-[#E2DAD0] bg-white hover:bg-[#FAF8F5] text-[#6B635B] hover:text-[#1E1A17] transition-colors"
              title="فتح واجهة المتجر"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">المتجر</span>
            </a>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xs border border-[#A33A2B]/30 bg-white hover:bg-[#A33A2B]/10 text-[#A33A2B] transition-colors cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 w-full">
        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* Total Orders */}
            <div className="bg-white p-4 rounded-sm border border-[#E2DAD0] shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-[#6B635B]">
                <span>إجمالي الطلبات</span>
                <Inbox className="w-4 h-4 text-[#9A5B2E]" />
              </div>
              <p className="text-xl sm:text-2xl font-bold font-mono text-[#1E1A17]">
                {stats.total}
              </p>
              <span className="text-[10px] text-[#6B635B] block">مسجلة في قاعدة البيانات</span>
            </div>

            {/* New Orders */}
            <div className="bg-white p-4 rounded-sm border border-amber-300 bg-amber-50/40 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-amber-900 font-bold">
                <span>طلبات جديدة</span>
                <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
              </div>
              <p className="text-xl sm:text-2xl font-bold font-mono text-amber-900">
                {stats.newOrders}
              </p>
              <span className="text-[10px] text-amber-800 font-medium block">تنتظر المراجعة والتأكيد</span>
            </div>

            {/* Confirmed Orders */}
            <div className="bg-white p-4 rounded-sm border border-emerald-300 bg-emerald-50/30 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-emerald-900 font-bold">
                <span>تم تأكيدها</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-900">
                {stats.confirmed}
              </p>
              <span className="text-[10px] text-emerald-800 font-medium block">جاهزة للتجهيز والشحن</span>
            </div>

            {/* Delivered Orders */}
            <div className="bg-white p-4 rounded-sm border border-green-300 bg-green-50/30 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-green-900 font-bold">
                <span>تم تسليمها</span>
                <PackageCheck className="w-4 h-4 text-green-700" />
              </div>
              <p className="text-xl sm:text-2xl font-bold font-mono text-green-900">
                {stats.delivered}
              </p>
              <span className="text-[10px] text-green-800 font-medium block">تم استلامها بنجاح</span>
            </div>

            {/* Confirmed Revenue */}
            <div className="bg-white p-4 rounded-sm border border-[#E2DAD0] shadow-2xs space-y-1 col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between text-xs text-[#6B635B]">
                <span>المداخيل المستخلصة</span>
                <TrendingUp className="w-4 h-4 text-[#2F6B4F]" />
              </div>
              <p className="text-xl sm:text-2xl font-bold font-mono text-[#9A5B2E]">
                {stats.confirmedRevenueMAD.toLocaleString()} <span className="text-xs font-semibold text-[#1E1A17]">د.م.</span>
              </p>
              <span className="text-[10px] text-[#6B635B] block">من الطلبات المؤكدة والمسلمة</span>
            </div>
          </div>
        )}

        {/* Search, Filter Toolbar */}
        <div className="bg-white p-4 rounded-sm border border-[#E2DAD0] shadow-2xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#6B635B] absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث برقم الطلب (BZ-...)، اسم الزبون، رقم الهاتف، أو المدينة..."
                className="w-full text-xs sm:text-sm ps-9 pe-4 py-2.5 rounded-xs border border-[#E2DAD0] bg-[#FAF8F5] focus:outline-none focus:border-[#9A5B2E] focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-[#6B635B] hover:text-[#1E1A17]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Date Presets */}
            <div className="flex items-center gap-1 shrink-0 bg-[#FAF8F5] p-1 rounded-xs border border-[#E2DAD0]">
              <button
                type="button"
                onClick={() => {
                  setDatePreset('all');
                  setFilterTimestamp(Date.now());
                }}
                className={`text-xs px-2.5 py-1.5 rounded-xs font-semibold transition-colors cursor-pointer ${
                  datePreset === 'all' ? 'bg-[#1E1A17] text-white' : 'text-[#6B635B] hover:text-[#1E1A17]'
                }`}
              >
                كل الأوقات
              </button>
              <button
                type="button"
                onClick={() => {
                  setDatePreset('today');
                  setFilterTimestamp(Date.now());
                }}
                className={`text-xs px-2.5 py-1.5 rounded-xs font-semibold transition-colors cursor-pointer ${
                  datePreset === 'today' ? 'bg-[#1E1A17] text-white' : 'text-[#6B635B] hover:text-[#1E1A17]'
                }`}
              >
                اليوم
              </button>
              <button
                type="button"
                onClick={() => {
                  setDatePreset('week');
                  setFilterTimestamp(Date.now());
                }}
                className={`text-xs px-2.5 py-1.5 rounded-xs font-semibold transition-colors cursor-pointer ${
                  datePreset === 'week' ? 'bg-[#1E1A17] text-white' : 'text-[#6B635B] hover:text-[#1E1A17]'
                }`}
              >
                آخر 7 أيام
              </button>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-[#E2DAD0] pt-3 text-xs">
            <span className="text-[#6B635B] font-bold shrink-0 ms-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#9A5B2E]" />
              الحالة:
            </span>

            <button
              type="button"
              onClick={() => setSelectedStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                selectedStatusFilter === 'all'
                  ? 'bg-[#1E1A17] text-white'
                  : 'bg-[#FAF8F5] text-[#6B635B] hover:bg-[#F1ECE4] hover:text-[#1E1A17]'
              }`}
            >
              الكل ({orders.length})
            </button>

            {(Object.keys(ORDER_STATUS_META) as OrderStatus[]).map((st) => {
              const meta = ORDER_STATUS_META[st];
              const count = orders.filter((o) => o.status === st).length;
              const isSelected = selectedStatusFilter === st;

              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xs font-semibold transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 border ${
                    isSelected
                      ? `${meta.bgClass} ${meta.colorClass} ${meta.borderClass} ring-1 ring-black/10`
                      : 'bg-white text-[#6B635B] border-[#E2DAD0] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${meta.dotClass}`} />
                  <span>{meta.labelAr}</span>
                  <span className="opacity-75 font-mono text-[11px]">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error message */}
        {ordersError && (
          <div className="p-4 bg-[#A33A2B]/10 border border-[#A33A2B]/30 rounded-sm text-xs text-[#A33A2B] font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{ordersError}</span>
          </div>
        )}

        {/* Orders Table & Cards */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-sm border border-[#E2DAD0] p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E2DAD0] flex items-center justify-center mx-auto text-[#6B635B]">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#1E1A17]">لا توجد طلبات مطابقة لهذا البحث أو الفلتر</h3>
            <p className="text-xs text-[#6B635B] max-w-sm mx-auto">
              عندما يُتم الزبائن طلبات جديدة من واجهة المتجر، ستظهر تلقائيًا هنا في لوحة التحكم.
            </p>
            {(searchQuery || selectedStatusFilter !== 'all' || datePreset !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStatusFilter('all');
                  setDatePreset('all');
                }}
                className="text-xs font-semibold text-[#9A5B2E] hover:underline cursor-pointer"
              >
                إعادة ضبط الفلاتر
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-sm border border-[#E2DAD0] shadow-2xs overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead className="bg-[#FAF8F5] border-b border-[#E2DAD0] text-[#6B635B] font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4 text-start">رقم الطلب والتاريخ</th>
                    <th className="py-3 px-4 text-start">الزبون والهاتف</th>
                    <th className="py-3 px-4 text-start">المدينة</th>
                    <th className="py-3 px-4 text-start">تفاصيل الحذاء</th>
                    <th className="py-3 px-4 text-start">المجموع</th>
                    <th className="py-3 px-4 text-start">الحالة</th>
                    <th className="py-3 px-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2DAD0]">
                  {filteredOrders.map((order) => {
                    const statusMeta = ORDER_STATUS_META[order.status] || ORDER_STATUS_META.new;
                    const dateFormatted = new Date(order.createdAt).toLocaleString('fr-FR', {
                      timeZone: 'Africa/Casablanca',
                      dateStyle: 'short',
                      timeStyle: 'short',
                    });

                    return (
                      <tr
                        key={order.orderId}
                        className="hover:bg-[#FAF8F5]/60 transition-colors cursor-pointer"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-[#1E1A17] block">
                            {order.orderId}
                          </span>
                          <span className="text-[11px] text-[#6B635B] block mt-0.5">
                            {dateFormatted}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-[#1E1A17] block">
                            {order.customer.fullName}
                          </span>
                          <span className="text-[11px] font-mono text-[#6B635B] block mt-0.5" dir="ltr">
                            {order.customer.phone}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-medium text-[#1E1A17]">
                          {order.customer.city}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-[#1E1A17] block">
                            {order.item.modelName}
                          </span>
                          <span className="text-[11px] text-[#6B635B] block">
                            المقاس: <strong>{order.item.size}</strong> · الكمية: <strong>{order.item.quantity}</strong>
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-sm text-[#9A5B2E] font-mono">
                            {order.pricing.totalMAD.toLocaleString()} د.م.
                          </span>
                          <span className="text-[10px] text-[#2F6B4F] block">توصيل مجاني</span>
                        </td>

                        <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.orderId, e.target.value as OrderStatus)}
                            className={`text-xs font-bold px-2.5 py-1 rounded-xs border cursor-pointer focus:outline-none ${statusMeta.bgClass} ${statusMeta.colorClass} ${statusMeta.borderClass}`}
                          >
                            {(Object.keys(ORDER_STATUS_META) as OrderStatus[]).map((st) => (
                              <option key={st} value={st}>
                                {ORDER_STATUS_META[st].labelAr}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(order)}
                              className="p-1.5 rounded-xs hover:bg-[#FAF8F5] text-[#1E1A17] hover:text-[#9A5B2E] transition-colors cursor-pointer"
                              title="عرض التفاصيل الكاملة"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <a
                              href={formatCustomerManualWhatsAppUrl(order)}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-xs hover:bg-emerald-50 text-emerald-700 transition-colors"
                              title="التواصل مع الزبون عبر WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>

                            <button
                              type="button"
                              onClick={() => setDeleteConfirmationId(order.orderId)}
                              className="p-1.5 rounded-xs hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                              title="حذف الطلب"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-[#E2DAD0]">
              {filteredOrders.map((order) => {
                const statusMeta = ORDER_STATUS_META[order.status] || ORDER_STATUS_META.new;
                const dateFormatted = new Date(order.createdAt).toLocaleString('fr-FR', {
                  timeZone: 'Africa/Casablanca',
                  dateStyle: 'short',
                  timeStyle: 'short',
                });

                return (
                  <div
                    key={order.orderId}
                    className="p-4 space-y-3 hover:bg-[#FAF8F5] transition-colors"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono font-bold text-xs text-[#1E1A17] block">
                          {order.orderId}
                        </span>
                        <span className="text-[10px] text-[#6B635B]">{dateFormatted}</span>
                      </div>

                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-xs border ${statusMeta.bgClass} ${statusMeta.colorClass} ${statusMeta.borderClass}`}
                      >
                        {statusMeta.labelAr}
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="font-bold text-[#1E1A17]">{order.customer.fullName} · {order.customer.city}</p>
                      <p className="text-[#6B635B]" dir="ltr">{order.customer.phone}</p>
                      <p className="font-semibold text-[#1E1A17]">
                        {order.item.modelName} (مقاس {order.item.size} · كمية {order.item.quantity})
                      </p>
                      <p className="font-bold text-[#9A5B2E] font-mono text-sm">
                        المجموع: {order.pricing.totalMAD.toLocaleString()} د.م.
                      </p>
                    </div>

                    <div
                      className="flex items-center justify-between pt-2 border-t border-[#E2DAD0]/60"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <a
                        href={formatCustomerManualWhatsAppUrl(order)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-xs border border-emerald-300"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>واتساب الزبون</span>
                      </a>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="text-xs font-semibold px-2.5 py-1.5 rounded-xs border border-[#E2DAD0] bg-white text-[#1E1A17]"
                        >
                          تفاصيل
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmationId(order.orderId)}
                          className="p-1.5 text-rose-600 rounded-xs hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* 3. Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="w-full max-w-2xl bg-white border border-[#E2DAD0] rounded-sm shadow-xl p-5 sm:p-8 space-y-6 text-start max-h-[90vh] overflow-y-auto animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-start justify-between pb-4 border-b border-[#E2DAD0]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#6B635B]">رقم الطلب:</span>
                  <span className="font-mono text-base font-bold text-[#1E1A17]">{selectedOrder.orderId}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedOrder.orderId);
                      setCopiedId(true);
                      setTimeout(() => setCopiedId(false), 2000);
                    }}
                    className="p-1 text-[#6B635B] hover:text-[#9A5B2E]"
                    title="نسخ رقم الطلب"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span className="text-xs text-[#6B635B] block mt-1">
                  تاريخ الطلب:{' '}
                  {new Date(selectedOrder.createdAt).toLocaleString('fr-FR', {
                    timeZone: 'Africa/Casablanca',
                    dateStyle: 'full',
                    timeStyle: 'medium',
                  })}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-xs hover:bg-[#FAF8F5] text-[#6B635B] hover:text-[#1E1A17] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Selector in Modal */}
            <div className="p-4 bg-[#FAF8F5] rounded-xs border border-[#E2DAD0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#1E1A17] block">تغيير حالة الطلب:</span>
                <span className="text-[11px] text-[#6B635B]">
                  الحالة الحالية:{' '}
                  <strong className={ORDER_STATUS_META[selectedOrder.status]?.colorClass}>
                    {ORDER_STATUS_META[selectedOrder.status]?.labelAr}
                  </strong>
                </span>
              </div>

              <select
                value={selectedOrder.status}
                onChange={(e) => handleStatusChange(selectedOrder.orderId, e.target.value as OrderStatus)}
                disabled={isUpdatingStatus}
                className="text-xs font-bold py-2 px-3 rounded-xs border border-[#E2DAD0] bg-white cursor-pointer focus:outline-none focus:border-[#9A5B2E]"
              >
                {(Object.keys(ORDER_STATUS_META) as OrderStatus[]).map((st) => (
                  <option key={st} value={st}>
                    {ORDER_STATUS_META[st].labelAr}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Contact & Delivery Info */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#9A5B2E] uppercase tracking-wider pb-1 border-b border-[#E2DAD0]">
                بيانات الزبون والتوصيل
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white border border-[#E2DAD0] rounded-xs space-y-1">
                  <span className="text-[#6B635B] text-[11px] block flex items-center gap-1">
                    <User className="w-3 h-3" /> اسم الزبون:
                  </span>
                  <p className="font-bold text-[#1E1A17] text-sm">{selectedOrder.customer.fullName}</p>
                </div>

                <div className="p-3 bg-white border border-[#E2DAD0] rounded-xs space-y-1">
                  <span className="text-[#6B635B] text-[11px] block flex items-center gap-1">
                    <Phone className="w-3 h-3" /> رقم هاتف الزبون:
                  </span>
                  <p className="font-bold text-[#1E1A17] text-sm font-mono" dir="ltr">
                    {selectedOrder.customer.phone}
                  </p>
                </div>

                <div className="p-3 bg-white border border-[#E2DAD0] rounded-xs space-y-1">
                  <span className="text-[#6B635B] text-[11px] block flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> مدينة التوصيل:
                  </span>
                  <p className="font-bold text-[#1E1A17]">{selectedOrder.customer.city}</p>
                </div>

                <div className="p-3 bg-white border border-[#E2DAD0] rounded-xs space-y-1">
                  <span className="text-[#6B635B] text-[11px] block">لغة الطلب:</span>
                  <p className="font-semibold text-[#1E1A17]">
                    {selectedOrder.language === 'ar' ? 'العربية' : 'Français'}
                  </p>
                </div>

                <div className="p-3 bg-white border border-[#E2DAD0] rounded-xs sm:col-span-2 space-y-1">
                  <span className="text-[#6B635B] text-[11px] block">عنوان التوصيل بالتفصيل:</span>
                  <p className="font-medium text-[#1E1A17] leading-relaxed">{selectedOrder.customer.address}</p>
                </div>

                {selectedOrder.customer.notes && (
                  <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xs sm:col-span-2 space-y-1">
                    <span className="text-amber-800 text-[11px] font-bold block">ملاحظات الزبون:</span>
                    <p className="text-xs text-amber-900">{selectedOrder.customer.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Products Breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#9A5B2E] uppercase tracking-wider pb-1 border-b border-[#E2DAD0]">
                المنتج والمقاس المطلوب
              </h3>

              <div className="p-4 bg-[#FAF8F5] rounded-xs border border-[#E2DAD0] space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[#1E1A17]">{selectedOrder.item.modelName}</h4>
                    <p className="text-[#6B635B] text-xs">
                      {selectedOrder.item.shoeTypeAr} · {selectedOrder.item.colorNameAr}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-sm text-[#1E1A17]">
                    {selectedOrder.item.unitPriceMAD.toLocaleString()} د.م.
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs pt-2 border-t border-[#E2DAD0]/60">
                  <span className="bg-[#1E1A17] text-white px-2.5 py-1 rounded-xs font-bold">
                    المقاس: {selectedOrder.item.size}
                  </span>
                  <span className="text-[#6B635B]">
                    الكمية: <strong>{selectedOrder.item.quantity}</strong>
                  </span>
                  <span className="text-emerald-700 font-semibold ms-auto">
                    توصيل مجاني (0 د.م.)
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-3 border-t border-[#1E1A17]/10 text-sm">
                  <span className="font-bold text-[#1E1A17]">المجموع المطلوب استخلاصه عند التسليم:</span>
                  <span className="text-lg font-mono font-bold text-[#9A5B2E]">
                    {selectedOrder.pricing.totalMAD.toLocaleString()} د.م.
                  </span>
                </div>
              </div>
            </div>

            {/* MANUAL WHATSAPP BUTTON (Mandatory requirement #4) */}
            <div className="pt-2">
              <a
                href={formatCustomerManualWhatsAppUrl(selectedOrder)}
                target="_blank"
                rel="noreferrer"
                className="w-full min-h-[48px] bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs sm:text-sm font-bold py-3 px-4 rounded-xs transition-colors flex items-center justify-center gap-2.5 shadow-xs"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <span>التواصل مع الزبون عبر WhatsApp ({selectedOrder.customer.phone})</span>
              </a>
              <p className="text-[11px] text-[#6B635B] text-center mt-1.5">
                يفتح محادثة مباشرة مع رقم الزبون المسجل في الطلب برسالة تأكيد جاهزة تشمل رقم الطلب والمقاس والمبلغ.
              </p>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-3 border-t border-[#E2DAD0] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setDeleteConfirmationId(selectedOrder.orderId)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 p-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>حذف الطلب نهائياً</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-xs font-bold px-4 py-2 rounded-xs border border-[#E2DAD0] bg-white hover:bg-[#FAF8F5] text-[#1E1A17] cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Delete Confirmation Dialog */}
      {deleteConfirmationId && (
        <div
          className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setDeleteConfirmationId(null)}
        >
          <div
            className="w-full max-w-sm bg-white border border-[#E2DAD0] rounded-sm p-6 shadow-xl space-y-4 text-start animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold text-[#1E1A17]">تأكيد حذف الطلب</h3>
              <p className="text-xs text-[#6B635B]">
                هل أنت متأكد من رغبتك في حذف الطلب <strong className="font-mono text-[#1E1A17]">{deleteConfirmationId}</strong> نهائيًا من قاعدة البيانات؟ لا يمكن التراجع عن هذه الخطوة.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleDeleteOrder(deleteConfirmationId)}
                disabled={isDeletingId === deleteConfirmationId}
                className="flex-1 min-h-[40px] bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white text-xs font-bold rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isDeletingId === deleteConfirmationId ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>جاري الحذف...</span>
                  </>
                ) : (
                  <span>نعم، حذف الطلب</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setDeleteConfirmationId(null)}
                className="flex-1 min-h-[40px] bg-white hover:bg-[#FAF8F5] border border-[#E2DAD0] text-[#1E1A17] text-xs font-semibold rounded-xs transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
