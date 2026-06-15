'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { submitProjectSchema, type SubmitProjectInput } from '@/lib/validators';
import {
  CATEGORIES,
  AI_TOOLS,
  DEV_DURATION_OPTIONS,
  POPULAR_TECH_STACKS,
} from '@/lib/constants';

// Section wrapper
function FormSection({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pb-8 mb-8 border-b border-[rgba(0,0,0,0.05)] last:border-b-0 last:pb-0 last:mb-0">
      <h2 className="text-base font-semibold text-[#0f1419] mb-5 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-[#f5f5f5] flex items-center justify-center text-sm">
          {icon}
        </span>
        {title}
      </h2>
      {children}
    </div>
  );
}

export function SubmitForm() {
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [techInput, setTechInput] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<SubmitProjectInput>({
    resolver: zodResolver(submitProjectSchema) as any,
    defaultValues: {
      ai_tool_ids: [],
      tech_stack: [],
      is_profitable: false,
    },
  });

  const techStack = watch('tech_stack') || [];
  const aiToolIds = watch('ai_tool_ids') || [];
  const screenshotUrl = watch('screenshot_url');

  // Screenshot preview
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setScreenshotPreview(url);
    register('screenshot_url').onChange(e);
  };

  // Tech stack tag input
  const addTech = () => {
    const trimmed = techInput.trim();
    if (!trimmed || techStack.length >= 15) return;
    if (techStack.includes(trimmed)) return;
    setValue('tech_stack', [...techStack, trimmed], { shouldValidate: true });
    setTechInput('');
  };

  const removeTech = (tech: string) => {
    setValue(
      'tech_stack',
      techStack.filter(t => t !== tech),
      { shouldValidate: true }
    );
  };

  const handleTechKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTech();
    }
  };

  // Quick-add popular tech
  const addPopularTech = (tech: string) => {
    if (techStack.length >= 15 || techStack.includes(tech)) return;
    setValue('tech_stack', [...techStack, tech], { shouldValidate: true });
  };

  // AI tool toggle
  const toggleAiTool = (toolSlug: string) => {
    const current = getValues('ai_tool_ids') || [];
    if (current.includes(toolSlug)) {
      setValue(
        'ai_tool_ids',
        current.filter(id => id !== toolSlug),
        { shouldValidate: true }
      );
    } else {
      setValue('ai_tool_ids', [...current, toolSlug], { shouldValidate: true });
    }
  };

  const onSubmit = async (data: SubmitProjectInput) => {
    setSubmitState('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Something went wrong');
      }

      setSubmitState('success');
    } catch (err: any) {
      setSubmitState('error');
      setErrorMessage(
        err.message || 'Failed to submit. The database may not be connected yet.'
      );
    }
  };

  // ============================================================
  // Success state
  // ============================================================
  if (submitState === 'success') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-[#ecfdf5] flex items-center justify-center mx-auto mb-5">
          <span className="text-3xl">🎉</span>
        </div>
        <h2 className="text-2xl font-bold text-[#0f1419] mb-2">
          Project Submitted!
        </h2>
        <p className="text-[#505050] mb-8 max-w-sm mx-auto leading-relaxed">
          Your project is pending review. Once approved, it will appear on the homepage.
        </p>
        <div className="flex gap-3 justify-center">
          <Button href="/" variant="outline">Back to Home</Button>
          <Button href="/submit" onClick={() => setSubmitState('idle')}>
            Submit Another
          </Button>
        </div>
      </div>
    );
  }

  // ============================================================
  // Form
  // ============================================================
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* -------- Project Info -------- */}
      <FormSection icon="📦" title="Project Info">
        <div className="space-y-4">
          <Input
            label="Project Name"
            placeholder="My Awesome Project"
            required
            {...register('title')}
            error={errors.title?.message}
          />

          <Textarea
            label="Tagline"
            placeholder="A short, catchy description of your project (10–160 characters)"
            required
            rows={2}
            {...register('tagline')}
            error={errors.tagline?.message}
            hint={`${watch('tagline')?.length || 0}/160`}
            className="min-h-[60px]"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Project URL"
              placeholder="https://yourproject.com"
              type="url"
              required
              {...register('url')}
              error={errors.url?.message}
            />
            <Input
              label="GitHub URL"
              placeholder="https://github.com/you/project"
              type="url"
              {...register('github_url')}
              error={errors.github_url?.message}
            />
          </div>

          <Input
            label="Screenshot URL"
            placeholder="https://placehold.co/1200x750/FFF7ED/F97316?text=Your+Project"
            required
            {...register('screenshot_url')}
            onChange={handleScreenshotChange}
            error={errors.screenshot_url?.message}
          />

          {/* Screenshot preview */}
          {screenshotPreview && !errors.screenshot_url && (
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] max-w-md">
              <img
                src={screenshotPreview}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          <Textarea
            label="Description"
            placeholder="Tell us what your project does, how it works, and what makes it special..."
            rows={4}
            {...register('description')}
            error={errors.description?.message}
          />
        </div>
      </FormSection>

      {/* -------- Category & AI Tools -------- */}
      <FormSection icon="🏷️" title="Category &amp; AI Tools">
        <div className="space-y-5">
          <Select
            label="Category"
            placeholder="Select a category..."
            options={CATEGORIES.map(cat => ({
              value: cat.slug,
              label: `${cat.icon} ${cat.name}`,
            }))}
            {...register('category_slug')}
            error={errors.category_slug?.message}
          />

          {/* AI Tools multi-select */}
          <div>
            <label className="text-sm font-medium text-[var(--color-text)] mb-2.5 block">
              AI Tools Used
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AI_TOOLS.map(tool => {
                const isSelected = aiToolIds.includes(tool.slug);
                return (
                  <button
                    key={tool.slug}
                    type="button"
                    onClick={() => toggleAiTool(tool.slug)}
                    className={[
                      'text-sm px-3 py-2.5 rounded-xl border text-left transition-all duration-200',
                      isSelected
                        ? 'border-[#f97316] bg-[#fff7ed] text-[#c2410c] font-medium shadow-sm shadow-orange-100'
                        : 'border-[var(--color-border)] text-[#505050] hover:border-[var(--color-border-hover)] hover:bg-[#fafafa]',
                    ].join(' ')}
                  >
                    {tool.name}
                  </button>
                );
              })}
            </div>
            {errors.ai_tool_ids?.message && (
              <p className="text-xs text-[var(--color-error)] mt-1.5">{errors.ai_tool_ids.message}</p>
            )}
          </div>
        </div>
      </FormSection>

      {/* -------- Tech Stack -------- */}
      <FormSection icon="🛠" title="Tech Stack">
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Type a technology and press Enter..."
              value={techInput}
              onChange={e => setTechInput(e.target.value)}
              onKeyDown={handleTechKeyDown}
              hint={`${techStack.length}/15 max`}
              className="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={addTech}
              className="shrink-0"
            >
              + Add
            </Button>
          </div>

          {/* Selected tags */}
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {techStack.map(tech => (
                <Tag key={tech} onRemove={() => removeTech(tech)}>
                  {tech}
                </Tag>
              ))}
            </div>
          )}

          {/* Popular suggestions */}
          <div>
            <p className="text-xs text-[#8b98a5] mb-2">
              Popular — click to add:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_TECH_STACKS.filter(t => !techStack.includes(t))
                .slice(0, 12)
                .map(tech => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => addPopularTech(tech)}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-[#f5f5f5] text-[#505050] hover:text-[#f97316] hover:bg-[#fff7ed] transition-colors"
                  >
                    + {tech}
                  </button>
                ))}
            </div>
          </div>

          {errors.tech_stack?.message && (
            <p className="text-xs text-[var(--color-error)]">{errors.tech_stack.message}</p>
          )}
        </div>
      </FormSection>

      {/* -------- Development -------- */}
      <FormSection icon="⏱️" title="Development">
        <div className="space-y-4">
          <Select
            label="How long did it take?"
            placeholder="Select duration..."
            options={DEV_DURATION_OPTIONS.map(d => ({
              value: d.value,
              label: d.label,
            }))}
            {...register('dev_duration')}
            error={errors.dev_duration?.message}
          />

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              {...register('is_profitable')}
              className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
            />
            <span className="text-sm text-[#0f1419] group-hover:text-[#f97316] transition-colors">
              💰 This project is generating revenue
            </span>
          </label>
        </div>
      </FormSection>

      {/* -------- About You -------- */}
      <FormSection icon="👤" title="About You">
        <div className="space-y-4">
          <Input
            label="Your Name"
            placeholder="John Doe"
            required
            {...register('author_name')}
            error={errors.author_name?.message}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email"
              placeholder="you@example.com"
              type="email"
              {...register('author_email')}
              error={errors.author_email?.message}
            />
            <Input
              label="Website"
              placeholder="https://yourwebsite.com"
              type="url"
              {...register('author_website')}
              error={errors.author_website?.message}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Twitter / X"
              placeholder="@yourhandle"
              {...register('author_twitter')}
              error={errors.author_twitter?.message}
            />
            <Input
              label="GitHub Username"
              placeholder="yourgithub"
              {...register('author_github')}
              error={errors.author_github?.message}
            />
          </div>
        </div>
      </FormSection>

      {/* -------- Error -------- */}
      {submitState === 'error' && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 mb-6">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* -------- Submit -------- */}
      <Button
        type="submit"
        size="lg"
        className="w-full mt-2"
        disabled={submitState === 'loading'}
      >
        {submitState === 'loading' ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
            </svg>
            Submitting...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Submit Project 🚀
          </span>
        )}
      </Button>

      <p className="text-xs text-[#8b98a5] text-center mt-4">
        By submitting, you agree to have your project listed in the Vibe Open World directory.
      </p>
    </form>
  );
}
