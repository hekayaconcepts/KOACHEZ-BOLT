import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { OnboardingData } from '@/pages/Onboarding'

interface Step5Props {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onPrev: () => void
}

export default function Step5Intake({ data, updateData, onNext, onPrev }: Step5Props) {
  const [questionText, setQuestionText] = useState('')

  const addQuestion = () => {
    if (!questionText.trim()) return

    const questions = [
      ...data.intakeFormQuestions,
      {
        id: Date.now().toString(),
        question: questionText.trim(),
        type: 'text'
      }
    ]

    updateData({ intakeFormQuestions: questions })
    setQuestionText('')
  }

  const removeQuestion = (id: string) => {
    updateData({ intakeFormQuestions: data.intakeFormQuestions.filter((q) => q.id !== id) })
  }

  return (
    <div>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#0a2240' }}>Intake questions</h2>
      <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 32 }}>Create a short form to learn more about clients before the first session.</p>

      <div style={{ background: '#f9fafb', borderRadius: 16, padding: 28, marginBottom: 32, border: '1px solid #e5e7eb' }}>
        <div style={{ marginBottom: 20 }}>
          <Label htmlFor="question" style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#0f172a' }}>
            Add a question
          </Label>
          <Textarea
            id="question"
            placeholder="e.g. What is the biggest challenge you want to solve?"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            style={{ width: '100%', minHeight: 100, padding: '12px 14px', borderRadius: 12, border: '1px solid #dbeafe', fontSize: 14 }}
          />
        </div>
        <Button
          onClick={addQuestion}
          disabled={!questionText.trim()}
          style={{
            padding: '10px 22px',
            background: questionText.trim() ? '#185fa5' : '#e5e7eb',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            cursor: questionText.trim() ? 'pointer' : 'not-allowed'
          }}
        >
          Add question
        </Button>
      </div>

      {data.intakeFormQuestions.length > 0 ? (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0a2240', marginBottom: 16 }}>Your intake questions</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            {data.intakeFormQuestions.map((question) => (
              <div key={question.id} style={{ padding: 18, borderRadius: 14, background: '#fff', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center' }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{question.question}</p>
                  <button
                    onClick={() => removeQuestion(question.id)}
                    style={{ color: '#ef4444', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13 }}
                  >
                    Remove
                  </button>
                </div>
                <p style={{ margin: '10px 0 0', fontSize: 12, color: '#64748b' }}>Answer type: Text</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ background: '#f0f7ff', borderRadius: 14, padding: 24, marginBottom: 32, textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 14, color: '#475569' }}>No questions added yet. You can continue and add them later.</p>
        </div>
      )}

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
          Next: Contract →
        </Button>
      </div>
    </div>
  )
}
