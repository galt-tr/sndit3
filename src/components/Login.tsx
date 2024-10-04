import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login, verify2FA } from '../api'
import { Send, Mail, Lock, Shield } from 'lucide-react'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [error, setError] = useState('')
  const [step, setStep] = useState<'login' | 'twoFactor'>('login')
  const [userId, setUserId] = useState<number | null>(null)
  const navigate = useNavigate()
  const { login: authLogin } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (step === 'login') {
        const response = await login(email, password)
        if (response.token) {
          // 2FA is disabled, proceed with login
          authLogin(response.token)
          navigate('/')
        } else {
          // 2FA is enabled, move to 2FA step
          setUserId(response.userId)
          setStep('twoFactor')
        }
      } else {
        const { token } = await verify2FA(userId!, twoFactorCode)
        authLogin(token)
        navigate('/')
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-2xl rounded-lg px-8 pt-6 pb-8 mb-4">
          <div className="flex justify-center mb-8">
            <Send size={64} className="text-indigo-500 transform rotate-45" />
          </div>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Sign in to sndit</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 'login' ? (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label htmlFor="twoFactorCode" className="block text-sm font-medium text-gray-700">2FA Code</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="twoFactorCode"
                    name="twoFactorCode"
                    type="text"
                    required
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter 2FA code"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                  />
                </div>
              </div>
            )}
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {step === 'login' ? 'Sign in' : 'Verify 2FA'}
              </button>
            </div>
          </form>
        </div>
        <div className="text-center">
          <Link to="/signup" className="font-medium text-white hover:text-indigo-200">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login