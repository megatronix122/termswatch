import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Eye, Bell, Archive, CheckCircle, ArrowRight, AlertTriangle, FileText, Lock } from 'lucide-react'
import { waitlist } from '../utils/api'

export default function Landing() {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleWaitlist = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await waitlist.join(email, company, '')
      setSubmitted(true)
      setEmail('')
      setCompany('')
    } catch (err) {
      setError(err.message || 'Failed to join waitlist')
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-primary-50 to-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            <span>Monitor 500+ services automatically</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Never Miss a<br />
            <span className="text-primary-600">Terms of Service</span> Change
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            TermsWatch automatically monitors legal documents across your entire SaaS stack.
            Get instant alerts when privacy policies, terms of service, or security docs change.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/login" className="btn-primary text-lg px-8 py-3">
              Start Monitoring Free
            </Link>
            <span className="text-gray-500 text-sm">1 monitor free forever</span>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-gray-400">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">SOC2 audit ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">GDPR compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The Compliance Risk You Didn't Know You Had
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your SaaS stack uses 50+ third-party services. Each can change their legal terms at any time,
              exposing you to new liability, data processing risks, and compliance violations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card">
              <AlertTriangle className="h-10 w-10 text-amber-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Alert Fatigue</h3>
              <p className="text-gray-600">
                Generic monitoring tools alert on every page change — blog posts, pricing updates, UI tweaks.
                You drown in noise and miss the one alert that matters.
              </p>
            </div>
            <div className="card">
              <FileText className="h-10 w-10 text-red-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Audit Trail Gaps</h3>
              <p className="text-gray-600">
                SOC2 and ISO27001 require demonstrating vendor term awareness. Most companies
                have no systematic tracking — a critical control deficiency.
              </p>
            </div>
            <div className="card">
              <Lock className="h-10 w-10 text-primary-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Regulatory Exposure</h3>
              <p className="text-gray-600">
                GDPR Article 28, CCPA, and HIPAA require knowing when data processing terms change.
                Missing a change can mean fines up to 4% of revenue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Purpose-Built for Compliance Teams
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              TermsWatch is the only tool specifically designed to monitor legal document changes
              with compliance context, audit trails, and zero alert fatigue.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card text-center">
              <Eye className="h-10 w-10 text-primary-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Legal-Text Extraction</h3>
              <p className="text-sm text-gray-600">
                Automatically extracts terms, privacy, and cookie policy text — filters out blog posts and marketing noise.
              </p>
            </div>
            <div className="card text-center">
              <Bell className="h-10 w-10 text-primary-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Smart Alerts</h3>
              <p className="text-sm text-gray-600">
                Only alerts on meaningful legal changes. Highlights compliance keywords like liability, GDPR, and data processing.
              </p>
            </div>
            <div className="card text-center">
              <Archive className="h-10 w-10 text-primary-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Audit Archive</h3>
              <p className="text-sm text-gray-600">
                Permanent version history with timestamps. Export audit reports for SOC2, ISO27001, and GDPR compliance.
              </p>
            </div>
            <div className="card text-center">
              <Shield className="h-10 w-10 text-primary-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Triple Detection</h3>
              <p className="text-sm text-gray-600">
                Three independent detection methods ensure zero false negatives. We never miss a change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple Pricing</h2>
            <p className="text-gray-600">Start free. Upgrade when you grow.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card border-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Free</h3>
              <div className="text-3xl font-bold text-gray-900 mt-2">$0</div>
              <p className="text-gray-500 text-sm">/month</p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />1 service monitor</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Weekly checks</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Email alerts</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />30-day archive</li>
              </ul>
              <Link to="/login" className="btn-secondary w-full mt-6 text-center block">Get Started</Link>
            </div>

            <div className="card border-2 border-primary-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Starter</h3>
              <div className="text-3xl font-bold text-gray-900 mt-2">$49</div>
              <p className="text-gray-500 text-sm">/month</p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />15 service monitors</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Daily checks</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Slack alerts</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />1-year archive</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Pre-built catalog</li>
              </ul>
              <Link to="/login" className="btn-primary w-full mt-6 text-center block">Start Free Trial</Link>
            </div>

            <div className="card border-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Pro</h3>
              <div className="text-3xl font-bold text-gray-900 mt-2">$99</div>
              <p className="text-gray-500 text-sm">/month</p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />50 service monitors</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Hourly checks</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />API access</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Unlimited archive</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Team management</li>
              </ul>
              <Link to="/login" className="btn-secondary w-full mt-6 text-center block">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section className="py-16 bg-primary-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join the Waitlist
          </h2>
          <p className="text-primary-200 mb-8">
            Be the first to know when we launch. Get early access and a lifetime 20% discount.
          </p>

          {submitted ? (
            <div className="bg-primary-800 rounded-lg p-6 text-white">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-400" />
              <p className="text-lg font-medium">You're on the list!</p>
              <p className="text-primary-300 mt-2">We'll email you when TermsWatch launches.</p>
            </div>
          ) : (
            <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-primary-400"
              />
              <input
                type="text"
                placeholder="Company (optional)"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-primary-400"
              />
              <button type="submit" className="bg-white text-primary-900 px-6 py-3 rounded-lg font-bold hover:bg-primary-50 transition-colors">
                Join Waitlist
              </button>
            </form>
          )}
          {error && <p className="text-red-300 mt-4">{error}</p>}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-primary-500" />
              <span className="text-white font-bold">TermsWatch</span>
            </div>
            <p className="text-sm">© 2026 TermsWatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
