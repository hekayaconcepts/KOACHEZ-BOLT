import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { OnboardingData } from '@/pages/Onboarding'

interface Step3Props {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onPrev: () => void
}

export default function Step3Services({ data, updateData, onNext, onPrev }: Step3Props) {
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    duration: '60 min',
    features: ''
  })

  const addService = () => {
    if (!newService.name || !newService.price) return

    const service = {
      id: Date.now().toString(),
      name: newService.name,
      description: newService.description,
      price: parseFloat(newService.price),
      duration: newService.duration,
      features: newService.features.split('\n').filter(f => f.trim())
    }

    updateData({
      services: [...data.services, service]
    })

    setNewService({
      name: '',
      description: '',
      price: '',
      duration: '60 min',
      features: ''
    })
  }

  const removeService = (id: string) => {
    updateData({
      services: data.services.filter(s => s.id !== id)
    })
  }

  const isComplete = data.services.length > 0

  return (
    <div>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#0a2240' }}>Your coaching packages</h2>
      <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 32 }}>Create the services you offer. You can add more later.</p>

      <div style={{ marginBottom: 32 }}>
        <div style={{ background: '#f9fafb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#0a2240' }}>Add a Service</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <Label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Service Name *</Label>
              <Input
                type="text"
                placeholder="e.g., 1-on-1 Coaching"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #dbeafe', fontSize: 13 }}
              />
            </div>

            <div>
              <Label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Price (USD) *</Label>
              <Input
                type="number"
                placeholder="e.g., 150"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #dbeafe', fontSize: 13 }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <Label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Description</Label>
            <Textarea
              placeholder="What's included in this service?"
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #dbeafe', fontSize: 13, minHeight: 80 }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <Label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Duration</Label>
            <Input
              type="text"
              placeholder="e.g., 60 min"
              value={newService.duration}
              onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #dbeafe', fontSize: 13 }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <Label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Features (one per line)</Label>
            <Textarea
              placeholder="e.g., 1 coaching session&#10;Email follow-up&#10;Action plan"
              value={newService.features}
              onChange={(e) => setNewService({ ...newService, features: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #dbeafe', fontSize: 13, minHeight: 80 }}
            />
          </div>

          <Button
            onClick={addService}
            disabled={!newService.name || !newService.price}
            style={{
              padding: '10px 20px',
              background: newService.name && newService.price ? '#185fa5' : '#e5e7eb',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: newService.name && newService.price ? 'pointer' : 'not-allowed'
            }}
          >
            + Add Service
          </Button>
        </div>

        {/* Services List */}
        {data.services.length > 0 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: '#0a2240' }}>Your Services</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              {data.services.map((service) => (
                <div key={service.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                    <div>
                      <h4 style={{ fontSize: 14, fontWeight: 600, color: '#0a2240', margin: 0 }}>{service.name}</h4>
                      <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>${service.price} • {service.duration}</p>
                    </div>
                    <button
                      onClick={() => removeService(service.id)}
                      style={{
                        background: '#fee2e2',
                        color: '#991b1b',
                        border: 'none',
                        borderRadius: 4,
                        padding: '6px 12px',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  {service.description && (
                    <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 8px' }}>{service.description}</p>
                  )}
                  {service.features.length > 0 && (
                    <ul style={{ fontSize: 12, color: '#6b7280', margin: 0, paddingLeft: 16 }}>
                      {service.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
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
          Next: Subdomain →
        </Button>
      </div>
    </div>
  )
}
