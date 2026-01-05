import '../../styles/ToggleSwitch.css'

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
  isDark?: boolean
}

export default function ToggleSwitch({ checked, onChange, label, description, isDark = false }: ToggleSwitchProps) {
  return (
    <div className={`toggle-switch ${isDark ? 'dark' : ''}`}>
      <div className="toggle-switch-label">
        <label className="toggle-switch-label-text">
          {label}
        </label>
        {description && (
          <p className="toggle-switch-description">
            {description}
          </p>
        )}
      </div>
      
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`toggle-switch-btn ${checked ? 'checked' : ''}`}
      >
        <span className="toggle-switch-indicator" />
      </button>
    </div>
  )
}
