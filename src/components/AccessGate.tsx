import React, { useState, useEffect } from 'react';

export default function AccessGate({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Check if already unlocked in session storage
    const unlocked = sessionStorage.getItem('x4-access-granted');
    if (unlocked === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check (you can change this)
    if (password === 'x4protocol') {
      setIsUnlocked(true);
      sessionStorage.setItem('x4-access-granted', 'true');
      setPassword('');
    } else {
      alert('Invalid access code');
      setPassword('');
    }
  };

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleUnlock} className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">x4protocol</h1>
            <p className="text-gray-400">Private Access</p>
          </div>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter access code"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
            autoFocus
          />

          <button
            type="submit"
            className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all"
          >
            Unlock
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-8">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}
