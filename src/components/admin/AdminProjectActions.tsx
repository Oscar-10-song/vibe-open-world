'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminProjectActionsProps {
  projectId: string;
  currentStatus: string;
}

export function AdminProjectActions({ projectId, currentStatus }: AdminProjectActionsProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  const updateStatus = async (status: string) => {
    setUpdating(status);
    try {
      await fetch('/api/admin/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, status }),
      });
      router.refresh();
    } catch {
      // silently fail
    } finally {
      setUpdating(null);
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    approved: 'bg-green-500/10 text-green-600 border-green-500/20',
    rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
    featured: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={[
          'text-xs font-medium px-2 py-0.5 rounded-full border',
          statusColors[currentStatus] || statusColors.pending,
        ].join(' ')}
      >
        {currentStatus}
      </span>
      <div className="flex gap-1">
        {currentStatus !== 'approved' && currentStatus !== 'featured' && (
          <button
            onClick={() => updateStatus('approved')}
            disabled={updating === 'approved'}
            className="text-xs px-2 py-1 rounded-md bg-green-500/10 text-green-600 hover:bg-green-500/20 disabled:opacity-50 transition-colors"
          >
            {updating === 'approved' ? '…' : '✓ Approve'}
          </button>
        )}
        {currentStatus !== 'featured' && (
          <button
            onClick={() => updateStatus('featured')}
            disabled={updating === 'featured'}
            className="text-xs px-2 py-1 rounded-md bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 disabled:opacity-50 transition-colors"
          >
            {updating === 'featured' ? '…' : '⭐ Feature'}
          </button>
        )}
        {currentStatus !== 'rejected' && (
          <button
            onClick={() => updateStatus('rejected')}
            disabled={updating === 'rejected'}
            className="text-xs px-2 py-1 rounded-md bg-red-500/10 text-red-600 hover:bg-red-500/20 disabled:opacity-50 transition-colors"
          >
            {updating === 'rejected' ? '…' : '✕ Reject'}
          </button>
        )}
      </div>
    </div>
  );
}
