import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus, Trash2, RefreshCw, ExternalLink, Clock,
  CheckCircle, AlertTriangle, FileText, ArrowRight
} from 'lucide-react'
import { monitors, changes } from '../utils/api'

export default function Dashboard() {
  const [monitorList, setMonitorList] = useState([])
  const [changeList, setChangeList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)

  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      window.location.href = '/login'
      return
    }
    loadData()
  }, [token])

  async function loadData() {
    try {
      setLoading(true)
      const [mData, cData] = await Promise.all([
        monitors.list(),
        changes.list(),
      ])
      setMonitorList(mData || [])
      setChangeList(cData || [])
    } catch (err) {
      setError(err.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!newUrl) return

    setAdding(true)
    try {
      await monitors.create(newUrl, newName)
      setNewUrl('')
      setNewName('')
      setShowAddModal(false)
      await loadData()
    } catch (err) {
      setError(err.message || 'Failed to add monitor')
    } finally {
      setAdding(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this monitor? All history will be lost.')) return
    try {
      await monitors.delete(id)
      await loadData()
    } catch (err) {
      setError(err.message || 'Failed to delete')
    }
  }

  async function handleCheck(id) {
    try {
      await monitors.check(id)
      setError('')
      alert('Check initiated. Refresh in a minute to see results.')
    } catch (err) {
      setError(err.message || 'Check failed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {monitorList.length} monitor{monitorList.length !== 1 ? 's' : ''} active
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary mt-4 sm:mt-0 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Monitor</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="text-sm text-gray-500">Total Monitors</div>
          <div className="text-2xl font-bold text-gray-900">{monitorList.length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500">Changes Detected</div>
          <div className="text-2xl font-bold text-primary-600">{changeList.length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500">Last Check</div>
          <div className="text-sm font-medium text-gray-900">
            {monitorList[0]?.last_checked_at
              ? new Date(monitorList[0].last_checked_at).toLocaleDateString()
              : 'Never'}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500">Plan</div>
          <div className="text-sm font-medium text-gray-900 capitalize">
            {JSON.parse(localStorage.getItem('user') || '{}').plan || 'free'}
          </div>
        </div>
      </div>

      {/* Monitors */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Your Monitors</h2>

        {monitorList.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No monitors yet</h3>
            <p className="text-gray-600 mb-4">Add your first service to start monitoring.</p>
            <button onClick={() => setShowAddModal(true)} className="btn-primary">
              Add Your First Monitor
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {monitorList.map((monitor) => (
              <div key={monitor.id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900 truncate">{monitor.name || monitor.url}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      monitor.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {monitor.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <a
                      href={monitor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 hover:text-primary-600"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span className="truncate max-w-xs">{monitor.url}</span>
                    </a>
                    {monitor.last_checked_at && (
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>Checked {new Date(monitor.last_checked_at).toLocaleDateString()}</span>
                      </span>
                    )}
                  </div>
                  {monitor.last_hash && (
                    <p className="text-xs text-gray-400 mt-1">
                      Content hash: {monitor.last_hash.slice(0, 16)}...
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCheck(monitor.id)}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Check now"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(monitor.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Changes */}
      {changeList.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Changes</h2>
          <div className="space-y-4">
            {changeList.slice(0, 10).map((change) => (
              <div key={change.id} className="card border-l-4 border-l-primary-500">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{change.monitor_name}</h3>
                    <p className="text-sm text-gray-500">{change.url}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Detected {new Date(change.detected_at).toLocaleString()}
                    </p>
                    {change.keywords_found && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {change.keywords_found.split(',').map((kw) => (
                          <span
                            key={kw}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-800"
                          >
                            {kw.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <CheckCircle className="h-5 w-5 text-primary-500 flex-shrink-0" />
                </div>
                {change.diff_text && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-4 overflow-auto max-h-48">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">{change.diff_text}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Monitor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Monitor</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL to Monitor</label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="input-field"
                  placeholder="https://stripe.com/legal/terms"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name (optional)</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="input-field"
                  placeholder="Stripe Terms of Service"
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {adding ? 'Adding...' : 'Add Monitor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
