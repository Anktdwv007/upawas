import React, { useState } from 'react';
import {
  X,
  Building,
  UserCheck,
  Phone,
  Calendar,
  CheckCircle2,
  Edit,
  Tag,
  Eye,
  PlusCircle,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';
import type { Property, User, Lead, UnitSystem } from '../types';
import { formatArea, formatPriceINR } from '../utils/conversions';

interface SellerDashboardModalProps {
  user: User;
  properties: Property[];
  leads: Lead[];
  unitSystem: UnitSystem;
  onClose: () => void;
  onOpenPostProperty: () => void;
  onUpdatePropertyStatus: (propertyId: string, status: 'Ready to Move' | 'Sold') => void;
  onUpdateLeadStatus: (leadId: string, status: 'Pending' | 'Contacted' | 'Completed') => void;
  onSelectProperty: (property: Property) => void;
}

export const SellerDashboardModal: React.FC<SellerDashboardModalProps> = ({
  user,
  properties,
  leads,
  unitSystem,
  onClose,
  onOpenPostProperty,
  onUpdatePropertyStatus,
  onUpdateLeadStatus,
  onSelectProperty,
}) => {
  const [activeTab, setActiveTab] = useState<'my-properties' | 'leads'>('my-properties');

  // Filter properties posted by user (or mock user properties if none posted yet)
  const myProperties = properties.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
                  {user.name}'s Seller Hub
                </h3>
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase border border-blue-500/20">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user.email} | {user.phone} {user.agencyName && `• ${user.agencyName}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPostProperty}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Listing</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('my-properties')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl transition border-b-2 ${
              activeTab === 'my-properties'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold bg-blue-500/5'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>My Listed Properties ({myProperties.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl transition border-b-2 ${
              activeTab === 'leads'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold bg-blue-500/5'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Buyer Inquiries & Site Visits ({leads.length})</span>
          </button>
        </div>

        {/* Scrollable Tab Body */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* TAB 1: MY PROPERTIES */}
          {activeTab === 'my-properties' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myProperties.map((prop) => (
                  <div
                    key={prop.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex gap-3">
                      <img
                        src={prop.images[0]}
                        alt={prop.title}
                        className="w-24 h-24 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-500">
                          {prop.city}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {prop.title}
                        </h4>
                        <div className="text-amber-500 font-extrabold text-base">
                          {formatPriceINR(prop.price)}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                          {formatArea(prop.areaSqFt, unitSystem)} | Status:{' '}
                          <span className={prop.possessionStatus === 'Sold' ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}>
                            {prop.possessionStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 text-xs">
                      <button
                        onClick={() => onSelectProperty(prop)}
                        className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold hover:underline"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview Card</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {prop.possessionStatus !== 'Sold' ? (
                          <button
                            onClick={() => onUpdatePropertyStatus(prop.id, 'Sold')}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700 transition"
                          >
                            Mark as Sold
                          </button>
                        ) : (
                          <button
                            onClick={() => onUpdatePropertyStatus(prop.id, 'Ready to Move')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition"
                          >
                            Mark Active
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: BUYER LEADS */}
          {activeTab === 'leads' && (
            <div className="space-y-4">
              {leads.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <UserCheck className="w-12 h-12 mx-auto stroke-1" />
                  <p className="text-sm font-semibold">No buyer leads yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {lead.buyerName}
                          </h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            lead.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {lead.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                          Inquired for: <strong>{lead.propertyTitle}</strong>
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-blue-500" />
                            <span>{lead.buyerPhone}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-indigo-500" />
                            <span>Site Visit Date: {lead.visitDate}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/${lead.buyerPhone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(lead.buyerName)},%20this%20is%20${encodeURIComponent(user.name)}%20regarding%20your%20site%20visit%20request%20on%20AwaasUP.`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp Buyer</span>
                        </a>

                        <button
                          onClick={() => onUpdateLeadStatus(lead.id, lead.status === 'Completed' ? 'Pending' : 'Completed')}
                          className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition"
                        >
                          {lead.status === 'Completed' ? 'Reopen' : 'Mark Done'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
