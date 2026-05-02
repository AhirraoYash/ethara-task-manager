import { useState } from 'react';
import { X, KeyRound, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { changePassword } from '../api/user.api';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userMobile?: string;
}

export default function ChangePasswordModal({ isOpen, onClose, userMobile }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const passwordStrength = (pass: string) => {
    if (pass.length === 0) return { score: 0, label: '', color: 'transparent' };
    if (pass.length < 6) return { score: 1, label: 'Too short', color: '#ef4444' };
    if (pass.length < 8) return { score: 2, label: 'Weak', color: '#f97316' };
    if (!/[A-Z]/.test(pass) || !/[0-9]/.test(pass)) return { score: 3, label: 'Fair', color: '#eab308' };
    return { score: 4, label: 'Strong', color: '#22c55e' };
  };

  const strength = passwordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await changePassword(currentPassword, newPassword);
      setSuccess(result.message || 'Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    onClose();
  };

  const inputStyle = {
    width: '100%',
    padding: '11px 44px 11px 14px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }}>
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
        }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '420px',
        background: 'linear-gradient(145deg, rgba(30,27,75,0.95) 0%, rgba(15,12,41,0.98) 100%)',
        border: '1px solid rgba(139,92,246,0.3)',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.15)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(139,92,246,0.4)',
            }}>
              <KeyRound size={20} color="white" />
            </div>
            <div>
              <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 700, margin: 0 }}>Change Password</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: 0 }}>Update your account security</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{
              width: '32px', height: '32px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'rgba(255,255,255,0.5)',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Hint */}
        {userMobile && (
          <div style={{
            background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
            borderRadius: '12px', padding: '12px 14px', marginBottom: '20px',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <ShieldCheck size={15} color="#a78bfa" />
            <p style={{ color: 'rgba(167,139,250,0.9)', fontSize: '12px', margin: 0 }}>
              Your default password is your mobile number: <strong style={{ color: '#c4b5fd' }}>{userMobile}</strong>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '10px', padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <AlertCircle size={15} color="#f87171" />
              <span style={{ color: '#f87171', fontSize: '13px' }}>{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div style={{
              background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: '10px', padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <CheckCircle size={15} color="#34d399" />
              <span style={{ color: '#34d399', fontSize: '13px' }}>{success}</span>
            </div>
          )}

          {/* Current Password */}
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 600, marginBottom: '7px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Current Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                placeholder="Enter your current password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                style={inputStyle}
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)',
                display: 'flex', padding: '4px',
              }}>
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 600, marginBottom: '7px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              New Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showNew ? 'text' : 'password'}
                required
                placeholder="Enter new password (min 6 characters)"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                style={inputStyle}
              />
              <button type="button" onClick={() => setShowNew(!showNew)} style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)',
                display: 'flex', padding: '4px',
              }}>
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Strength meter */}
            {newPassword.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                      flex: 1, height: '3px', borderRadius: '99px',
                      background: i <= strength.score ? strength.color : 'rgba(255,255,255,0.1)',
                      transition: 'background 0.3s',
                    }} />
                  ))}
                </div>
                <p style={{ fontSize: '11px', color: strength.color, margin: 0 }}>{strength.label}</p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 600, marginBottom: '7px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Confirm New Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={{
                  ...inputStyle,
                  borderColor: confirmPassword && newPassword !== confirmPassword ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.12)',
                }}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)',
                display: 'flex', padding: '4px',
              }}>
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p style={{ color: '#f87171', fontSize: '11px', marginTop: '4px' }}>Passwords don't match</p>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                flex: 1, padding: '12px',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px', color: 'rgba(255,255,255,0.6)',
                fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !!success}
              style={{
                flex: 1, padding: '12px',
                background: isLoading ? 'rgba(139,92,246,0.5)' : 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                border: 'none', borderRadius: '12px',
                color: 'white', fontSize: '14px', fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px rgba(139,92,246,0.4)',
                transition: 'all 0.2s',
              }}
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
