import { useState, useEffect } from 'react'
import { Trash2, Mail, MailOpen, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getContactMessages, markMessageAsRead } from '../../services/contactService'
import ConfirmationModal from './ConfirmationModal'

interface Message {
  id: number
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

interface MessagesManagerProps {
  onUpdate: () => void
  onToast?: (message: string, type: 'success' | 'error') => void
}

export default function MessagesManager({ onUpdate, onToast }: MessagesManagerProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    try {
      const data = await getContactMessages()
      setMessages(
        data.map((msg) => ({
          id: msg.id!,
          name: msg.name,
          email: msg.email,
          subject: 'Contact Form Submission',
          message: msg.message,
          is_read: msg.is_read || false,
          created_at: msg.created_at || new Date().toISOString(),
        })),
      )
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: number) => {
    try {
      await markMessageAsRead(id)
      await fetchMessages()
      onUpdate()
    } catch (err) {
      onToast?.(err instanceof Error ? err.message : 'Failed to mark as read', 'error')
    }
  }

  const handleDelete = () => {
    if (deleteId === null) return
    setDeleteId(null)
  }

  const openMessage = (message: Message) => {
    setSelectedMessage(message)
    if (!message.is_read) {
      handleMarkAsRead(message.id)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-500 mt-4">Loading messages...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ConfirmationModal
        isOpen={deleteId !== null}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      {messages.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="font-heading text-xl font-semibold text-gray-600 mb-2">No messages yet</h3>
          <p className="text-gray-500">Contact form submissions will appear here</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-heading font-semibold text-navy-800">
                Inbox ({messages.filter((m) => !m.is_read).length} unread)
              </h3>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  whileHover={{ backgroundColor: '#f9fafb' }}
                  onClick={() => openMessage(message)}
                  className={`p-4 border-b border-gray-100 cursor-pointer ${
                    selectedMessage?.id === message.id ? 'bg-teal-50' : ''
                  } ${!message.is_read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      {message.is_read ? (
                        <MailOpen className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Mail className="w-4 h-4 text-blue-600" />
                      )}
                      <p className={`font-semibold text-sm ${!message.is_read ? 'text-navy-800' : 'text-gray-700'}`}>
                        {message.name}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(message.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{message.email}</p>
                  <p className="text-sm text-gray-500 truncate mt-1">{message.message}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selectedMessage ? (
                <motion.div
                  key={selectedMessage.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-navy-800 mb-2">
                        {selectedMessage.name}
                      </h3>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-teal-600 hover:underline"
                      >
                        {selectedMessage.email}
                      </a>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(selectedMessage.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDeleteId(selectedMessage.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        onClick={() => setSelectedMessage(null)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Close"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  {selectedMessage.subject && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Subject:</p>
                      <p className="font-semibold text-navy-800">{selectedMessage.subject}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Message:</p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your message'}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      <Mail size={18} />
                      Reply via Email
                    </a>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-xl border border-gray-200 p-12 text-center h-full flex items-center justify-center"
                >
                  <div>
                    <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select a message to view details</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}
