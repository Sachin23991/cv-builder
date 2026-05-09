'use client';
import { useEffect, useState } from 'react';

export function AnalyticsLoader() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  
  // Dynamic import so it doesn't block initial bundle
  const { Analytics } = require('@vercel/analytics/react');
  return <Analytics />;
}
