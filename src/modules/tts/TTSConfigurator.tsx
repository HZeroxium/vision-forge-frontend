// src/modules/tts/TTSConfigurator.tsx
import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import SelectInput from '../../components/forms/SelectInput'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

const voiceOptions = [
  { value: 'default', label: 'Default Voice' },
  { value: 'voice1', label: 'Voice 1' },
  { value: 'voice2', label: 'Voice 2' },
]

export default function TTSConfigurator() {
  const [voice, setVoice] = useState('default')
  const [speed, setSpeed] = useState(1)
  const [tone, setTone] = useState(1)
  const [volume, setVolume] = useState(1)

  const handleSave = async () => {
    // <TODO>: Call API to update TTS configuration
    console.log({ voice, speed, tone, volume })
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">TTS Configuration</h2>
        <SelectInput
          label="Voice"
          value={voice}
          onChange={(e) => setVoice(e.target.value as string)}
          options={voiceOptions}
        />
        <Input
          type="number"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          placeholder="Speed"
          fullWidth
          className="mt-4"
        />
        <Input
          type="number"
          value={tone}
          onChange={(e) => setTone(Number(e.target.value))}
          placeholder="Tone"
          fullWidth
          className="mt-4"
        />
        <Input
          type="number"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          placeholder="Volume"
          fullWidth
          className="mt-4"
        />
        <Button onClick={handleSave} className="mt-4">
          Save Configuration
        </Button>
      </div>
    </DashboardLayout>
  )
}
