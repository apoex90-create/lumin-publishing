'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, Save, X, Loader2, GripVertical, Eye, EyeOff, ChevronDown } from 'lucide-react';

export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'url' | 'email' | 'json';
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  rows?: number;
  help?: string;
}

interface Props {
  resourceName: string;          // for API: /api/admin/content/{resourceName}
  resourceLabel: string;          // shown to user
  items: any[];
  fields: FieldConfig[];
  displayFields: string[];        // which fields to show in the list
  defaultValues?: Record<string, any>;
}

export default function CrudManager({ resourceName, resourceLabel, items, fields, displayFields, defaultValues = {} }: Props) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function startNew() {
    setFormData({ ...defaultValues, isPublished: true, sortOrder: items.length });
    setEditingId('new');
    setError('');
  }

  function startEdit(item: any) {
    // For plans/services, convert features JSON string back to plain lines for editing
    const formItem = { ...item };
    if ((resourceName === 'plans' || resourceName === 'services') && typeof formItem.features === 'string') {
      try {
        const arr = JSON.parse(formItem.features);
        if (Array.isArray(arr)) {
          formItem.features = arr.join('\n');
        }
      } catch {
        // not JSON, leave as-is
      }
    }
    setFormData(formItem);
    setEditingId(item.id);
    setError('');
  }

  function cancelEdit() {
    setEditingId(null);
    setFormData({});
    setError('');
  }

  async function save() {
    setSaving(true);
    setError('');
    try {
      const url = editingId === 'new'
        ? `/api/admin/content/${resourceName}`
        : `/api/admin/content/${resourceName}/${editingId}`;
      const method = editingId === 'new' ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }

      cancelEdit();
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm(`Delete this ${resourceLabel}? This cannot be undone.`)) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/content/${resourceName}/${id}`, { method: 'DELETE' });
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(item: any) {
    await fetch(`/api/admin/content/${resourceName}/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !item.isPublished }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={startNew} className="btn-gold">
          <Plus className="w-4 h-4 mr-2" /> Add {resourceLabel}
        </button>
      </div>

      {editingId === 'new' && (
        <FormEditor
          fields={fields}
          formData={formData}
          setFormData={setFormData}
          onSave={save}
          onCancel={cancelEdit}
          saving={saving}
          error={error}
          isNew
        />
      )}

      <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl overflow-hidden">
        {items.length === 0 ? (
          <div className="p-12 text-center text-cream-100/50">
            <p>No {resourceLabel.toLowerCase()}s yet.</p>
            <button onClick={startNew} className="btn-gold mt-4">
              <Plus className="w-4 h-4 mr-2" /> Create the first one
            </button>
          </div>
        ) : (
          <div className="divide-y divide-cream-100/5">
            {items.map((item) => (
              <div key={item.id}>
                {editingId === item.id ? (
                  <div className="p-4">
                    <FormEditor
                      fields={fields}
                      formData={formData}
                      setFormData={setFormData}
                      onSave={save}
                      onCancel={cancelEdit}
                      saving={saving}
                      error={error}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-5 hover:bg-cream-100/5">
                    <GripVertical className="w-4 h-4 text-cream-100/30 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      {displayFields.map((f) => {
                        const val = item[f];
                        if (!val) return null;
                        return (
                          <div key={f}>
                            <p className="text-cream-50 font-medium truncate">{typeof val === 'boolean' ? (val ? 'Yes' : 'No') : String(val)}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => togglePublish(item)}
                        className={`p-2 rounded-lg transition-colors ${
                          item.isPublished ? 'text-green-300 hover:bg-green-500/10' : 'text-cream-100/40 hover:bg-cream-100/5'
                        }`}
                        title={item.isPublished ? 'Published — click to hide' : 'Hidden — click to publish'}
                      >
                        {item.isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button
                        onClick={() => startEdit(item)}
                        className="p-2 rounded-lg hover:bg-cream-100/5 text-cream-100/60 hover:text-gold-400 transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => remove(item.id)}
                        className="p-2 rounded-lg hover:bg-burgundy-500/10 text-cream-100/60 hover:text-burgundy-300 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FormEditor({
  fields, formData, setFormData, onSave, onCancel, saving, error, isNew = false,
}: {
  fields: FieldConfig[];
  formData: Record<string, any>;
  setFormData: (d: Record<string, any>) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  error: string;
  isNew?: boolean;
}) {
  return (
    <div className="bg-gradient-to-br from-gold-500/5 to-royal-500/5 border border-gold-500/30 rounded-2xl p-6">
      <h3 className="font-display text-xl text-cream-50 mb-4">{isNew ? 'New item' : 'Edit item'}</h3>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-burgundy-500/20 border border-burgundy-400 text-burgundy-300 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {fields.map((field) => (
          <FieldEditor
            key={field.name}
            field={field}
            value={formData[field.name]}
            onChange={(v) => setFormData({ ...formData, [field.name]: v })}
          />
        ))}
      </div>

      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-cream-100/10">
        <button onClick={onSave} disabled={saving} className="btn-gold disabled:opacity-50">
          {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save</>}
        </button>
        <button onClick={onCancel} disabled={saving} className="px-5 py-2.5 rounded-full border border-cream-100/30 text-cream-50 hover:bg-cream-100/5 text-sm font-medium">
          Cancel
        </button>
      </div>
    </div>
  );
}

function FieldEditor({ field, value, onChange }: { field: FieldConfig; value: any; onChange: (v: any) => void }) {
  const baseInputClass = 'w-full px-4 py-3 rounded-xl bg-cream-100/5 border border-cream-100/10 text-cream-50 focus:border-gold-500 outline-none transition-all';

  return (
    <div>
      <label className="block text-xs font-bold tracking-widest uppercase text-gold-400 mb-2">
        {field.label}
        {field.required && <span className="text-burgundy-300 ml-1">*</span>}
      </label>

      {field.type === 'textarea' ? (
        <textarea
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          rows={field.rows ?? 4}
          placeholder={field.placeholder}
          className={`${baseInputClass} resize-none`}
        />
      ) : field.type === 'boolean' ? (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={value ?? false}
            onChange={(e) => onChange(e.target.checked)}
            className="w-5 h-5 rounded accent-gold-500"
          />
          <span className="text-cream-100/70 text-sm">{field.placeholder ?? 'Yes'}</span>
        </label>
      ) : field.type === 'select' ? (
        <select
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className={baseInputClass}
        >
          <option value="">Select...</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : field.type === 'number' ? (
        <input
          type="number"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
          placeholder={field.placeholder}
          className={baseInputClass}
        />
      ) : (
        <input
          type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={baseInputClass}
        />
      )}

      {field.help && <p className="text-xs text-cream-100/40 mt-1">{field.help}</p>}
    </div>
  );
}
