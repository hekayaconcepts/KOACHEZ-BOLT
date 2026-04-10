import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { OnboardingData } from '@/pages/Onboarding'

interface Step1Props {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
}

export default function Step1Profile({ data, updateData, onNext }: Step1Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('profile_images')
        .upload(filePath, file)

      if (uploadError) {
        setError(`Upload failed: ${uploadError.message}`)
        setUploading(false)
        return
      }

      const { data: publicData } = supabase.storage
        .from('profile_images')
        .getPublicUrl(filePath)

      updateData({ profilePhotoUrl: publicData.publicUrl })
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const isComplete = data.name && data.tagline && data.niche && data.bio

  return (
    <div>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#0a2240' }}>Tell us about yourself</h2>
      <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 32 }}>This is the first thing your clients will see. Make it count.</p>

      {error && (
        <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 8, padding: 12, marginBottom: 24, color: '#991b1b', fontSize: 14 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 32 }}>
        {/* Left - Form */}
        <div>
          <div style={{ marginBottom: 24 }}>
            <Label htmlFor="name" style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#374151' }}>Your Full Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Sarah Mitchell"
              value={data.name}
              onChange={(e) => updateData({ name: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #dbeafe', fontSize: 14 }}
            />
          </div>

          <div style={{ marginBottom: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <Label htmlFor="tagline" style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#374151' }}>Your Tagline *</Label>
              <Input
                id="tagline"
                type="text"
                placeholder="e.g., Executive Leadership Coach"
                value={data.tagline}
                onChange={(e) => updateData({ tagline: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #dbeafe', fontSize: 14 }}
              />
              <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>One line that describes what you do</p>
            </div>
            <div>
              <Label htmlFor="niche" style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#374151' }}>Your Niche *</Label>
              <Input
                id="niche"
                type="text"
                placeholder="e.g., Leadership, Wellness, Career"
                value={data.niche}
                onChange={(e) => updateData({ niche: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #dbeafe', fontSize: 14 }}
              />
              <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>This helps clients understand your expertise.</p>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <Label htmlFor="location" style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#374151' }}>Location</Label>
            <Input
              id="location"
              type="text"
              placeholder="e.g., London, UK"
              value={data.location}
              onChange={(e) => updateData({ location: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #dbeafe', fontSize: 14 }}
            />
            <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>Optional, but useful for local clients.</p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <Label htmlFor="bio" style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#374151' }}>Your Bio *</Label>
            <Textarea
              id="bio"
              placeholder="Tell your story. What's your experience? What transformation do you offer?"
              value={data.bio}
              onChange={(e) => updateData({ bio: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #dbeafe', fontSize: 14, minHeight: 120, fontFamily: 'inherit' }}
            />
            <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{data.bio.length}/500 characters</p>
          </div>
        </div>

        {/* Right - Photo Preview */}
        <div>
          <Label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#374151' }}>Your Photo</Label>
          <div
            style={{
              width: '100%',
              aspectRatio: '1',
              borderRadius: 12,
              border: '2px dashed #dbeafe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: data.profilePhotoUrl ? 'transparent' : '#f0f7ff',
              overflow: 'hidden',
              position: 'relative',
              marginBottom: 16
            }}
          >
            {data.profilePhotoUrl ? (
              <img src={data.profilePhotoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                <p style={{ fontSize: 12, color: '#6b7280' }}>Upload your photo</p>
              </div>
            )}
          </div>

          <label style={{ display: 'block' }}>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '10px 12px',
                background: '#185fa5',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 600,
                cursor: uploading ? 'not-allowed' : 'pointer',
                opacity: uploading ? 0.6 : 1
              }}
            >
              {uploading ? 'Uploading...' : 'Choose Photo'}
            </span>
          </label>

          <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>JPG, PNG, or WebP. Max 5 MB.</p>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <Button
          onClick={onNext}
          disabled={!isComplete}
          style={{
            padding: '10px 24px',
            background: isComplete ? '#185fa5' : '#e5e7eb',
            color: isComplete ? '#fff' : '#9ca3af',
            border: 'none',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            cursor: isComplete ? 'pointer' : 'not-allowed'
          }}
        >
          Next: Brand →
        </Button>
      </div>
    </div>
  )
}
