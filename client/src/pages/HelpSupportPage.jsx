import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supportApi } from '../api/supportApi';
import { orderApi } from '../api/orderApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Headset, LifeBuoy, Send, ShieldCheck, PhoneCall, AlertTriangle, CheckCircle2, MessageSquare, ArrowLeft } from 'lucide-react';

export default function HelpSupportPage() {
  const [searchParams] = useSearchParams();
  const prefilledOrderId = searchParams.get('orderId') || '';

  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  // New Ticket Form State
  const [ticketForm, setTicketForm] = useState({
    orderId: prefilledOrderId,
    issueCategory: 'FOOD_QUALITY',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [ordersRes, ticketsRes] = await Promise.all([
        orderApi.getOrders(),
        supportApi.getTickets()
      ]);

      if (ordersRes.success) setOrders(ordersRes.data || []);
      if (ticketsRes.success) {
        setTickets(ticketsRes.data || []);
        if (ticketsRes.data.length > 0) {
          setSelectedTicket(ticketsRes.data[0]);
        }
      }
    } catch (err) {
      console.error('Fetch support data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicketSubmit = async (e) => {
    e.preventDefault();
    if (!ticketForm.orderId) return showError('Please select an order');
    if (!ticketForm.description.trim()) return showError('Please describe your issue');

    const targetOrder = orders.find(o => o.orderId === ticketForm.orderId || o._id === ticketForm.orderId);
    const restaurantName = targetOrder ? targetOrder.restaurantName || 'Foodie Outlet' : 'Foodie Kitchen';

    setSubmitting(true);
    try {
      const res = await supportApi.createTicket({
        orderId: ticketForm.orderId,
        restaurantName,
        issueCategory: ticketForm.issueCategory,
        description: ticketForm.description
      });

      if (res.success) {
        showSuccess('Support ticket created! Senior Executive Sarah Jenkins assigned.');
        setTickets([res.data, ...tickets]);
        setSelectedTicket(res.data);
        setTicketForm({ orderId: '', issueCategory: 'FOOD_QUALITY', description: '' });
      }
    } catch (err) {
      showError(err.message || 'Failed to create support ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim() || !selectedTicket) return;

    const msg = chatMessage.trim();
    setChatMessage('');
    try {
      const res = await supportApi.addMessage(selectedTicket.ticketId || selectedTicket._id, msg);
      if (res.success) {
        setSelectedTicket(res.data);
        setTickets(tickets.map(t => t.ticketId === res.data.ticketId ? res.data : t));
      }
    } catch (err) {
      showError('Failed to send message');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold uppercase tracking-wider">
            <Headset className="w-3.5 h-3.5" />
            24/7 Priority Support Assistant
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Help & Order Resolution</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Having an issue with your food quality or delivery? Report your concern below and get an assigned support executive right away.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
          <div className="w-12 h-12 rounded-full bg-rose-600 text-white font-black text-xl flex items-center justify-center">
            SJ
          </div>
          <div className="text-xs">
            <p className="font-extrabold text-white text-sm">Sarah Jenkins</p>
            <p className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Senior Support Lead
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Create Ticket & Ticket List */}
        <div className="space-y-6">
          
          {/* Create Ticket Form */}
          <form onSubmit={handleCreateTicketSubmit} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2 border-b border-slate-100 pb-3">
              <LifeBuoy className="w-5 h-5 text-rose-600" />
              Report an Order Issue
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Select Order</label>
              <select
                required
                value={ticketForm.orderId}
                onChange={(e) => setTicketForm({ ...ticketForm, orderId: e.target.value })}
                className="w-full p-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-rose-500"
              >
                <option value="">-- Select Your Order --</option>
                {orders.map(o => (
                  <option key={o._id} value={o.orderId || o._id}>
                    Order #{o.orderId || o._id} (₹{o.grandTotal})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Issue Category</label>
              <select
                value={ticketForm.issueCategory}
                onChange={(e) => setTicketForm({ ...ticketForm, issueCategory: e.target.value })}
                className="w-full p-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-rose-500"
              >
                <option value="FOOD_QUALITY">Food quality was not good / cold</option>
                <option value="MISSING_ITEM">Item was missing from package</option>
                <option value="LATE_DELIVERY">Delivery was significantly delayed</option>
                <option value="WRONG_ORDER">Received wrong item or order</option>
                <option value="PAYMENT_REFUND">Payment or billing query</option>
                <option value="OTHER">Other general concern</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Describe Issue</label>
              <textarea
                rows={3}
                required
                placeholder="e.g. The food taste was bad and not fresh, please issue a refund or replacement."
                value={ticketForm.description}
                onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                className="w-full p-3 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition active:scale-95"
            >
              {submitting ? 'Creating Ticket...' : 'Submit Issue & Assign Executive'}
            </button>
          </form>

          {/* Tickets History List */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h4 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">
              Your Support Tickets ({tickets.length})
            </h4>

            {tickets.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No support tickets raised yet.</p>
            ) : (
              <div className="space-y-2">
                {tickets.map(t => (
                  <button
                    key={t._id}
                    onClick={() => setSelectedTicket(t)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center justify-between ${
                      selectedTicket?.ticketId === t.ticketId
                        ? 'border-rose-600 bg-rose-50/50'
                        : 'border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">Ticket #{t.ticketId}</span>
                      <span className="text-[11px] text-slate-500 block truncate max-w-[180px]">{t.description}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {t.status}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right 2 Columns: Live Chat & Assigned Agent Executive Screen */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
              
              {/* Agent Header */}
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-600 font-extrabold text-white flex items-center justify-center text-sm shadow">
                    SJ
                  </div>
                  <div>
                    <p className="font-extrabold text-sm">{selectedTicket.assignedAgent?.name || 'Sarah Jenkins'}</p>
                    <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Assigned Support Lead • Ticket #{selectedTicket.ticketId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="tel:+1800366343"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
                    Call Lead
                  </a>
                </div>
              </div>

              {/* Chat Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                {selectedTicket.messages?.map((m, idx) => {
                  const isUser = m.sender === 'USER';
                  const isSystem = m.sender === 'SYSTEM';

                  if (isSystem) {
                    return (
                      <div key={idx} className="text-center my-2">
                        <span className="inline-block px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold">
                          {m.message}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={idx}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] font-bold text-slate-400 mb-1 px-1">
                        {m.senderName}
                      </span>
                      <div
                        className={`max-w-md px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                          isUser
                            ? 'bg-rose-600 text-white rounded-br-none'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                        }`}
                      >
                        {m.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick AI Bot Actions */}
              <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px] font-bold">
                <span className="text-slate-400 shrink-0">Bot Actions:</span>
                <button
                  type="button"
                  onClick={() => { setChatMessage("Food quality was bad, please issue a refund."); }}
                  className="px-3 py-1 rounded-full bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 transition shrink-0"
                >
                  Food Was Bad (Claim Refund)
                </button>
                <button
                  type="button"
                  onClick={() => { setChatMessage("Where is my delivery partner?"); }}
                  className="px-3 py-1 rounded-full bg-white hover:bg-slate-200 text-slate-700 border border-slate-200 transition shrink-0"
                >
                  Where is my order?
                </button>
                <button
                  type="button"
                  onClick={() => { setChatMessage("When will my refund be processed?"); }}
                  className="px-3 py-1 rounded-full bg-white hover:bg-slate-200 text-slate-700 border border-slate-200 transition shrink-0"
                >
                  Refund Status
                </button>
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message or ask the AI Assistant..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-slate-100 text-center space-y-4">
              <Headset className="w-16 h-16 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-900 text-lg">No Active Ticket Selected</h4>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Select an existing ticket from the left panel or report a new order issue to start chatting with your assigned support agent.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
