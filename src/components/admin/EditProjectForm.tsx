'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CATEGORIES } from '@/lib/constants';

interface ProjectData {
  id: string;
  title: string;
  tagline: string;
  description: string;
  url: string;
  github_url: string;
  screenshot_url: string;
  category_slug: string;
  status: string;
}

export function EditProjectForm({ project }: { project: ProjectData }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: project.title,
    tagline: project.tagline,
    description: project.description,
    url: project.url,
    github_url: project.github_url,
    screenshot_url: project.screenshot_url,
    category_slug: project.category_slug,
  });

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/admin/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id, ...form }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save');
      }

      setSuccess(true);
      setTimeout(() => router.push('/admin/projects'), 800);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      {success && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-600">
          Saved! Redirecting…
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-600">
          {error}
        </div>
      )}

      <Input
        label="Title"
        value={form.title}
        onChange={e => update('title', e.target.value)}
        required
      />

      <Textarea
        label="Tagline"
        value={form.tagline}
        onChange={e => update('tagline', e.target.value)}
        rows={2}
        required
      />

      <Textarea
        label="Description"
        value={form.description}
        onChange={e => update('description', e.target.value)}
        rows={4}
      />

      <Input
        label="Project URL"
        type="url"
        value={form.url}
        onChange={e => update('url', e.target.value)}
        required
      />

      <Input
        label="GitHub URL"
        type="url"
        value={form.github_url}
        onChange={e => update('github_url', e.target.value)}
      />

      <Input
        label="Screenshot URL"
        type="url"
        value={form.screenshot_url}
        onChange={e => update('screenshot_url', e.target.value)}
        required
      />

      <Select
        label="Category"
        options={[
          { value: '', label: '— None —' },
          ...CATEGORIES.map(cat => ({
            value: cat.slug,
            label: `${cat.icon} ${cat.name}`,
          })),
        ]}
        value={form.category_slug}
        onChange={e => update('category_slug', e.target.value)}
      />

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/projects')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
