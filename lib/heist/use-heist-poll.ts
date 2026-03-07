"use client";

import { useState, useEffect, useCallback } from 'react';

export function useHeistPoll<T>(
  url: string,
  intervalMs: number = 2000,
  headers?: Record<string, string>
): { data: T | null; loading: boolean; error: string | null; refresh: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const headersStr = JSON.stringify(headers ?? {});

  const fetchData = useCallback(async () => {
    try {
      const h = JSON.parse(headersStr);
      const res = await fetch(url, { headers: h });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? `HTTP ${res.status}`);
        return;
      }
      const json = await res.json();
      setData(json);
      setError(null);
    } catch {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  }, [url, headersStr]);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, intervalMs);
    return () => clearInterval(id);
  }, [fetchData, intervalMs]);

  return { data, loading, error, refresh: fetchData };
}

export async function adminAction(
  action: string,
  adminKey: string,
  body: Record<string, unknown> = {}
) {
  const res = await fetch('/api/heist/admin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
    },
    body: JSON.stringify({ action, ...body }),
  });
  return res.json();
}

export async function submitAction(
  body: Record<string, unknown>,
  token?: string
) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['x-player-token'] = token;
  const res = await fetch('/api/heist/submit', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function joinGame(displayName: string) {
  const res = await fetch('/api/heist/join', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ displayName }),
  });
  return res.json();
}

export async function getMe(token: string) {
  const res = await fetch('/api/heist/me', {
    headers: { 'x-player-token': token },
  });
  if (!res.ok) return null;
  return res.json();
}
