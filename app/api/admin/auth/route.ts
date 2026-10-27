import { NextRequest, NextResponse } from 'next/server';
import {
  verifyAdminPassword,
  generateAdminSessionToken,
  checkAdminAuth,
  ADMIN_COOKIE_NAME,
} from '@/lib/adminAuth';

// In-memory rate limiting against brute force attempts
const failedAttemptsMap: Map<string, { count: number; lockedUntil: number }> = new Map();

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const now = Date.now();
    const rateInfo = failedAttemptsMap.get(ip);

    if (rateInfo && rateInfo.lockedUntil > now) {
      const waitMinutes = Math.ceil((rateInfo.lockedUntil - now) / 60000);
      return NextResponse.json(
        {
          success: false,
          error: `تم قفل محاولات الدخول مؤقتاً بسبب تكرار كلمة المرور الخاطئة. يرجى الانتظار ${waitMinutes} دقيقة.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'يرجى إدخال كلمة مرور الإدارة.' },
        { status: 400 }
      );
    }

    const isValid = verifyAdminPassword(password);

    if (!isValid) {
      const currentCount = (rateInfo?.count || 0) + 1;
      let lockedUntil = 0;
      if (currentCount >= 5) {
        lockedUntil = now + 15 * 60 * 1000; // 15 min lock
      }
      failedAttemptsMap.set(ip, { count: currentCount, lockedUntil });

      return NextResponse.json(
        { success: false, error: 'كلمة المرور غير صحيحة. يرجى التأكد والمحاولة مجدداً.' },
        { status: 401 }
      );
    }

    // Clear failed attempts on successful login
    failedAttemptsMap.delete(ip);

    const token = generateAdminSessionToken();

    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح.',
      token,
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err: any) {
    console.error('[Admin Auth API] Login error:', err);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في معالجة طلب تسجيل الدخول.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const isAuth = checkAdminAuth(req);
  return NextResponse.json({ authenticated: isAuth });
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'تم تسجيل الخروج بنجاح.',
  });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 0,
  });

  return response;
}
