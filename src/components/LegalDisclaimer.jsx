import { useState } from 'react'

function LegalDisclaimer() {
  const [disclaimerAccepted, setDisclaimer] = useState(() => {
    const saved = localStorage.getItem('disclaimerAccepted')
    return saved ? saved === 'true' : false 
  })

  const handleAccept = () =>{
    localStorage.setItem('disclaimerAccepted', 'true')
    setDisclaimer(true)
  }

  if (disclaimerAccepted)
    return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-dark-card border border-white/10 rounded-2xl p-8 max-w-lg mx-4 shadow-2xl">
        <h2 className="font-heading text-2xl font-bold text-text-primary mb-4">
          Medical Disclaimer
        </h2>
        <p className="text-text-muted mb-4 leading-relaxed">
          Nucleus is a fitness tracking and logging tool. The information
          provided — including AI-generated insights — is for educational
          and informational purposes only.
        </p>
        <p className="text-text-muted mb-6 leading-relaxed">
          This app does not provide medical advice, diagnosis, or treatment.
          Always consult a qualified healthcare professional before making
          changes to your diet, exercise, or health routine.
        </p>
        <button
          onClick={handleAccept}
          className="w-full cursor-pointer bg-accent hover:bg-accent-light text-white font-semibold py-3 rounded-xl transition-colors duration-150"
        >
          I Understand & Accept
        </button>
      </div>
    </div>
  )
}

export default LegalDisclaimer
