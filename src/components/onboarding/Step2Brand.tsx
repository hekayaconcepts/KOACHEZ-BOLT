import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { OnboardingData } from '@/pages/Onboarding'

interface Step2Props {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onPrev: () => void
}

const FONT_OPTIONS = [
  { value: 'DM Sans', label: 'DM Sans (Modern)' },
  { value: 'Fraunces', label: 'Fraunces (Elegant)' },
  { value: 'Inter', label: 'Inter (Clean)' },
  { value: 'Playfair Display', label: 'Playfair Display (Luxury)' },
  { value: 'Poppins', label: 'Poppins (Friendly)' },
  { value: 'Raleway', label: 'Raleway (Minimal)' },
  { value: 'Montserrat', label: 'Montserrat (Bold)' },
  { value: 'Lora', label: 'Lora (Readable)' },
  { value: 'Merriweather', label: 'Merriweather (Classic)' },
  { value: 'Roboto', label: 'Roboto (Universal)' },
]

const COLOR_PALETTE = [
  '#185fa5', '#0a2240', '#059669', '#dc2626', '#f59e0b',
  '#7c3aed', '#06b6d4', '#ec4899', '#14b8a6', '#8b5cf6'
]

export default function Step2Brand({ data, updateData, onNext, onPrev }: Step2Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `logo_${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('profile_images')
        .upload(fileName, file)

      if (uploadError) {
        setError(`Upload failed: ${uploadError.message}`)
        setUploading(false)
        return
      }

      const { data: publicData } = supabase.storage
        .from('profile_images')
        .getPublicUrl(fileName)

      updateData({ logoUrl: publicData.publicUrl })
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#0a2240' }}>Brand your page</h2>
      <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 32 }}>Choose colors and fonts that match your style.</p>

      {error && (
        <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 8, padding: 12, marginBottom: 24, color: '#991b1b', fontSize: 14 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 32 }}>
        {/* Left - Controls */}
        <div>
          <div style={{ marginBottom: 24 }}>
            <Label style={{ display: 'block', marginBottom: 12, fontSize: 14, fontWeight: 600, color: '#374151' }}>Primary Color</Label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 12 }}>
              {COLOR_PALETTE.map((color) => (
                <button
                  key={color}
                  onClick={() => updateData({ brandColor: color })}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    borderRadius: 8,
                    background: color,
                    border: data.brandColor === color ? '3px solid #0a2240' : '2px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Input
                type="text"
                value={data.brandColor}
                onChange={(e) => updateData({ brandColor: e.target.value })}
                placeholder="#185fa5"
                style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid #dbeafe', fontSize: 12 }}
              />
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 6,
                  background: data.brandColor,
                  border: '1px solid #dbeafe'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <Label htmlFor="font" style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#374151' }}>Font</Label>
            <Select value={data.brandFont} onValueChange={(value) => updateData({ brandFont: value })}>
              <SelectTrigger style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #dbeafe', fontSize: 14 }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((font) => (
                  <SelectItem key={font.value} value={font.value}>{font.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div style={{ marginBottom: 24 }}>
            <Label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#374151' }}>Logo (Optional)</Label>
            <div
              style={{
                width: '100%',
                height: 120,
                borderRadius: 8,
                border: '2px dashed #dbeafe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: data.logoUrl ? 'transparent' : '#f0f7ff',
                overflow: 'hidden',
                marginBottom: 12
              }}
            >
              {data.logoUrl ? (
                <img src={data.logoUrl} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>🏷️</div>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Upload logo</p>
                </div>
              )}
            </div>

            <label style={{ display: 'block' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
              <Button
                as="span"
                disabled={uploading}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #dbeafe',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: uploading ? 'not-allowed' : 'pointer'
                }}
              >
                {uploading ? 'Uploading...' : 'Choose Logo'}
              </Button>
            </label>
          </div>
        </div>

        {/* Right - Preview */}
        <div>
          <Label style={{ display: 'block', marginBottom: 12, fontSize: 14, fontWeight: 600, color: '#374151' }}>Live Preview</Label>
          <div
            style={{
              borderRadius: 12,
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              background: '#fff'
            }}
          >
            {/* Preview Header */}
            <div
              style={{
                background: data.brandColor,
                padding: '24px',
                color: '#fff',
                textAlign: 'center'
              }}
            >
              {data.logoUrl && (
                <img src={data.logoUrl} alt="Logo" style={{ maxWidth: 60, maxHeight: 60, marginBottom: 12 }} />
              )}
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0, fontFamily: data.brandFont }}>
                {data.name || 'Your Name'}
              </h3>
              <p style={{ fontSize: 14, margin: '8px 0 0', opacity: 0.9, fontFamily: data.brandFont }}>
                {data.tagline || 'Your tagline'}
              </p>
            </div>

            {/* Preview Content */}
            <div style={{ padding: '24px' }}>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#6b7280', margin: 0, fontFamily: data.brandFont }}>
                {data.bio || 'Your bio will appear here...'}
              </p>
              <button
                style={{
                  marginTop: 16,
                  padding: '10px 20px',
                  background: data.brandColor,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Book a Session
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <Button
          onClick={onPrev}
          style={{
            padding: '10px 24px',
            background: '#f3f4f6',
            color: '#374151',
            border: '1px solid #dbeafe',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          ← Back
        </Button>
        <Button
          onClick={onNext}
          style={{
            padding: '10px 24px',
            background: '#185fa5',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Next: Services →
        </Button>
      </div>
    </div>
  )
}
