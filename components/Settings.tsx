import React, { useState } from 'react';
import { Settings as SettingsIcon, Monitor, Bell, Shield, Database, Plug, Save, X, Sun, Moon, Eye, EyeOff, Check, AlertCircle, Globe, Mail, Phone, MapPin, Clock, Palette, Layout, Lock, Key, Wifi, RefreshCw, Download, Trash2, Server, Webhook, Plus } from 'lucide-react';
import { apiKeyService, ApiKey } from '../services/apiKeyService';

type Tab = 'general' | 'appearance' | 'notifications' | 'security' | 'data' | 'integrations';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'general', label: 'General', icon: <SettingsIcon size={18} /> },
  { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  { id: 'security', label: 'Security', icon: <Shield size={18} /> },
  { id: 'data', label: 'Data Management', icon: <Database size={18} /> },
  { id: 'integrations', label: 'Integrations', icon: <Plug size={18} /> },
];

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // General
  const [hospitalName, setHospitalName] = useState('NexusHealth Hospital');
  const [adminEmail, setAdminEmail] = useState('admin@nexushealth.com');
  const [phone, setPhone] = useState('+1-555-0100');
  const [address, setAddress] = useState('123 Medical Center Drive, City, State 10001');
  const [timezone, setTimezone] = useState('UTC+5:30');
  const [language, setLanguage] = useState('English');

  // Appearance
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [compactMode, setCompactMode] = useState(false);
  const [sidebarPosition, setSidebarPosition] = useState<'left' | 'right'>('left');
  const [accentColor, setAccentColor] = useState('#0d9488');

  // Notifications
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [quietHoursStart, setQuietHoursStart] = useState('22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('07:00');
  const [notifCategories, setNotifCategories] = useState({ appointments: true, emergencies: true, billing: false, inventory: true, maintenance: false });

  // Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFA, setTwoFA] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [ipWhitelist, setIpWhitelist] = useState('');

  // Data
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [retentionPeriod, setRetentionPeriod] = useState('365');

  // Integrations
  const [webhookUrl, setWebhookUrl] = useState('');
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(apiKeyService.listKeys());
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [newKeyData, setNewKeyData] = useState<{ name: string; expiresAt?: string; ipWhitelist: string; rateLimit: 'standard' | 'unlimited' }>({
    name: '',
    ipWhitelist: '',
    rateLimit: 'standard'
  });
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const handleGenerateKey = () => {
    const ips = newKeyData.ipWhitelist.split(',').map(ip => ip.trim()).filter(ip => ip);
    apiKeyService.generateKey({
      name: newKeyData.name,
      expiresAt: newKeyData.expiresAt,
      ipWhitelist: ips,
      rateLimit: newKeyData.rateLimit
    });
    setApiKeys(apiKeyService.listKeys());
    setIsKeyModalOpen(false);
  };

  const handleRevokeKey = (id: string) => {
    if (confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      apiKeyService.revokeKey(id);
      setApiKeys(apiKeyService.listKeys());
    }
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!checked)} className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-slate-300 dark:bg-slate-600'}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </button>
  );

  const SectionTitle = ({ title, desc }: { title: string; desc: string }) => (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-foreground-primary">{title}</h3>
      <p className="text-sm text-foreground-secondary">{desc}</p>
    </div>
  );

  const InputField = ({ label, value, onChange, type = 'text', placeholder = '', disabled = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; disabled?: boolean }) => (
    <div>
      <label className="block text-sm font-semibold text-foreground-primary mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
        className="w-full border border-border rounded-xl p-3 text-sm bg-background-primary text-foreground-primary focus:ring-2 focus:ring-accent outline-none disabled:opacity-50 transition-all theme-transition" />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground-primary">Settings</h1>
          <p className="text-foreground-secondary">Manage hospital system configuration.</p>
        </div>
        <button onClick={handleSave} className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-lg ${saved ? 'bg-green-600 shadow-green-600/20' : 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/20'} text-white`}>
          {saved ? <><Check size={18} /> Saved!</> : <><Save size={18} /> Save Changes</>}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab Navigation */}
        <div className="lg:w-56 flex-shrink-0">
          <nav className="bg-background-secondary rounded-2xl shadow-sm border border-border overflow-hidden theme-transition">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors text-left ${activeTab === tab.id ? 'bg-accent/10 text-accent border-l-3 border-accent' : 'text-foreground-secondary hover:bg-background-tertiary'}`}>
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-background-secondary rounded-2xl shadow-sm border border-border p-6 lg:p-8 theme-transition">

          {/* General */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <SectionTitle title="Hospital Information" desc="Basic details about your hospital." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField label="Hospital Name" value={hospitalName} onChange={setHospitalName} placeholder="Hospital name" />
                <InputField label="Admin Email" value={adminEmail} onChange={setAdminEmail} type="email" placeholder="email@hospital.com" />
                <InputField label="Phone" value={phone} onChange={setPhone} type="tel" placeholder="+1-555-0000" />
                <div>
                  <label className="block text-sm font-semibold text-foreground-primary mb-1.5">Timezone</label>
                  <select value={timezone} onChange={e => setTimezone(e.target.value)}
                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-primary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition">
                    <option>UTC+5:30</option><option>UTC+0:00</option><option>UTC-5:00</option><option>UTC-8:00</option><option>UTC+8:00</option>
                  </select>
                </div>
              </div>
              <InputField label="Address" value={address} onChange={setAddress} placeholder="Full hospital address" />
              <div>
                <label className="block text-sm font-semibold text-foreground-primary mb-1.5">Language</label>
                <select value={language} onChange={e => setLanguage(e.target.value)}
                  className="w-full max-w-xs border border-border rounded-xl p-3 text-sm bg-background-primary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition">
                  <option>English</option><option>Hindi</option><option>Spanish</option><option>French</option><option>Arabic</option>
                </select>
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <SectionTitle title="Appearance" desc="Customize the look and feel." />
              <div>
                <label className="block text-sm font-semibold text-foreground-primary mb-3">Theme</label>
                <div className="flex gap-3">
                  {([['light', <Sun size={18} />, 'Light'], ['dark', <Moon size={18} />, 'Dark'], ['system', <Monitor size={18} />, 'System']] as const).map(([value, icon, label]) => (
                    <button key={value} onClick={() => setTheme(value)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${theme === value ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-background-tertiary text-foreground-secondary hover:bg-background-elevated'}`}>
                      {icon} {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-background-primary rounded-xl theme-transition">
                <div>
                  <p className="font-semibold text-foreground-primary text-sm">Compact Mode</p>
                  <p className="text-xs text-foreground-secondary">Reduced spacing for more content density.</p>
                </div>
                <Toggle checked={compactMode} onChange={setCompactMode} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground-primary mb-3">Sidebar Position</label>
                <div className="flex gap-3">
                  {(['left', 'right'] as const).map(pos => (
                    <button key={pos} onClick={() => setSidebarPosition(pos)}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold capitalize transition-all ${sidebarPosition === pos ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-background-tertiary text-foreground-secondary hover:bg-background-elevated'}`}>
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground-primary mb-3">Accent Color</label>
                <div className="flex items-center gap-3">
                  {['#0d9488', '#6366f1', '#ec4899', '#f59e0b', '#ef4444', '#8b5cf6'].map(color => (
                    <button key={color} onClick={() => setAccentColor(color)}
                      className={`w-10 h-10 rounded-xl transition-all ${accentColor === color ? 'ring-2 ring-offset-2 ring-foreground-muted dark:ring-offset-background-primary scale-110' : 'hover:scale-105'}`}
                      style={{ backgroundColor: color }} />
                  ))}
                  <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)}
                    className="w-10 h-10 rounded-xl border-2 border-border cursor-pointer" />
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <SectionTitle title="Notification Preferences" desc="Control how you receive notifications." />
              <div className="space-y-3">
                {[
                  { label: 'Email Notifications', desc: 'Receive alerts via email', checked: emailNotifs, onChange: setEmailNotifs, icon: <Mail size={18} /> },
                  { label: 'SMS Notifications', desc: 'Receive alerts via SMS', checked: smsNotifs, onChange: setSmsNotifs, icon: <Phone size={18} /> },
                  { label: 'Push Notifications', desc: 'Browser push notifications', checked: pushNotifs, onChange: setPushNotifs, icon: <Bell size={18} /> },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-4 bg-background-primary rounded-xl theme-transition">
                    <div className="flex items-center gap-3">
                      <div className="text-foreground-muted">{item.icon}</div>
                      <div>
                        <p className="font-semibold text-foreground-primary text-sm">{item.label}</p>
                        <p className="text-xs text-foreground-secondary">{item.desc}</p>
                      </div>
                    </div>
                    <Toggle checked={item.checked} onChange={item.onChange} />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground-primary mb-3">Quiet Hours</label>
                <div className="flex items-center gap-3">
                  <input type="time" value={quietHoursStart} onChange={e => setQuietHoursStart(e.target.value)}
                    className="border border-border rounded-xl p-3 text-sm bg-background-primary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition" />
                  <span className="text-foreground-secondary text-sm">to</span>
                  <input type="time" value={quietHoursEnd} onChange={e => setQuietHoursEnd(e.target.value)}
                    className="border border-border rounded-xl p-3 text-sm bg-background-primary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground-primary mb-3">Category Preferences</label>
                <div className="space-y-2">
                  {Object.entries(notifCategories).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-background-tertiary theme-transition">
                      <span className="text-sm text-foreground-primary capitalize">{key}</span>
                      <Toggle checked={val as boolean} onChange={v => setNotifCategories(p => ({ ...p, [key]: v }))} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <SectionTitle title="Security Settings" desc="Manage passwords, 2FA, and access controls." />
              <div className="p-4 bg-background-primary rounded-xl space-y-4 theme-transition">
                <h4 className="font-semibold text-foreground-primary text-sm flex items-center gap-2"><Lock size={16} /> Change Password</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Current password"
                      className="w-full border border-border rounded-xl p-3 pr-10 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition" />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground-primary">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password"
                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition" />
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm password"
                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition" />
                </div>
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> Passwords do not match</p>
                )}
              </div>
              <div className="flex items-center justify-between p-4 bg-background-primary rounded-xl theme-transition">
                <div className="flex items-center gap-3">
                  <Key size={18} className="text-foreground-muted" />
                  <div>
                    <p className="font-semibold text-foreground-primary text-sm">Two-Factor Authentication</p>
                    <p className="text-xs text-foreground-secondary">Add an extra layer of security.</p>
                  </div>
                </div>
                <Toggle checked={twoFA} onChange={setTwoFA} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-foreground-primary mb-1.5">Session Timeout (minutes)</label>
                  <select value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)}
                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-primary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition">
                    <option value="15">15 minutes</option><option value="30">30 minutes</option><option value="60">1 hour</option><option value="120">2 hours</option><option value="0">Never</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground-primary mb-1.5">IP Whitelist</label>
                  <input type="text" value={ipWhitelist} onChange={e => setIpWhitelist(e.target.value)} placeholder="e.g. 192.168.1.0/24, 10.0.0.1"
                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-primary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition" />
                </div>
              </div>
              <div className="bg-warning-light border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm">Active Sessions</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">You are currently logged in from 2 devices. Last login: Today at 9:15 AM from 192.168.1.42</p>
                    <button className="text-xs text-amber-700 dark:text-amber-300 font-semibold mt-2 hover:underline">Revoke all other sessions →</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data Management */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <SectionTitle title="Data Management" desc="Backups, exports, and data retention policies." />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Export as CSV', desc: 'Download data in CSV format', icon: <Download size={18} />, color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
                  { label: 'Export as PDF', desc: 'Generate PDF reports', icon: <Download size={18} />, color: 'bg-success-light text-success-dark border-green-200 dark:border-green-800' },
                  { label: 'Backup Now', desc: 'Create an instant backup', icon: <RefreshCw size={18} />, color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800' },
                ].map(action => (
                  <button key={action.label} className={`${action.color} border rounded-xl p-4 text-left hover:shadow-md transition-all`}>
                    <div className="mb-2">{action.icon}</div>
                    <p className="font-semibold text-sm">{action.label}</p>
                    <p className="text-xs opacity-75 mt-0.5">{action.desc}</p>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-foreground-primary mb-1.5">Auto-Backup Frequency</label>
                  <select value={backupFrequency} onChange={e => setBackupFrequency(e.target.value)}
                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-primary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition">
                    <option value="hourly">Every Hour</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground-primary mb-1.5">Data Retention (days)</label>
                  <select value={retentionPeriod} onChange={e => setRetentionPeriod(e.target.value)}
                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-primary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition">
                    <option value="90">90 Days</option><option value="180">180 Days</option><option value="365">1 Year</option><option value="730">2 Years</option><option value="0">Indefinite</option>
                  </select>
                </div>
              </div>
              <div className="bg-danger-light border border-red-200 dark:border-red-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Trash2 size={18} className="text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-800 dark:text-red-300 text-sm">Danger Zone</p>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">Purge records older than retention period. This action is irreversible.</p>
                    <button className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold mt-2 hover:bg-red-700 transition-colors">Purge Old Records</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Integrations */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <SectionTitle title="Integrations" desc="Connect external services and APIs." />
              <div className="space-y-4">
                {[
                  { name: 'Google Calendar', status: 'Connected', desc: 'Sync appointments', color: 'bg-success-light text-success-dark' },
                  { name: 'Twilio SMS', status: 'Not Connected', desc: 'SMS notifications', color: 'bg-background-tertiary text-foreground-secondary' },
                  { name: 'Stripe Payments', status: 'Connected', desc: 'Online billing', color: 'bg-success-light text-success-dark' },
                  { name: 'DICOM Server', status: 'Not Connected', desc: 'Medical imaging', color: 'bg-background-tertiary text-foreground-secondary' },
                ].map(service => (
                  <div key={service.name} className="flex items-center justify-between p-4 bg-background-primary rounded-xl theme-transition">
                    <div className="flex items-center gap-3">
                      <Server size={18} className="text-foreground-muted" />
                      <div>
                        <p className="font-semibold text-foreground-primary text-sm">{service.name}</p>
                        <p className="text-xs text-foreground-secondary">{service.desc}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${service.color}`}>{service.status}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground-primary text-sm flex items-center gap-2">
                    <Key size={16} /> API Keys
                  </h4>
                  <button
                    onClick={() => {
                      setIsKeyModalOpen(true);
                      setNewKeyData({ name: '', ipWhitelist: '', rateLimit: 'standard' });
                    }}
                    className="text-xs bg-accent text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-accent/90 transition-colors flex items-center gap-1"
                  >
                    <Plus size={14} /> Generate Key
                  </button>
                </div>

                <div className="space-y-3">
                  {apiKeys.length === 0 ? (
                    <div className="text-center p-8 bg-background-primary rounded-xl border border-dashed border-border text-foreground-secondary">
                      <Key size={24} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No API keys generated yet.</p>
                    </div>
                  ) : (
                    apiKeys.map(key => (
                      <div key={key.id} className={`p-4 rounded-xl border transition-all ${key.status === 'revoked' ? 'bg-background-tertiary border-border opacity-75' : 'bg-background-primary border-border hover:shadow-sm'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-bold text-foreground-primary text-sm flex items-center gap-2">
                              {key.name}
                              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${key.status === 'active' ? 'bg-success-light text-success-dark' : 'bg-background-tertiary text-foreground-muted'}`}>
                                {key.status}
                              </span>
                            </h5>
                            <p className="text-xs text-foreground-muted mt-1 font-mono">
                              {visibleKeys[key.id] ? key.key : key.key.substring(0, 16) + '...'}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setVisibleKeys(prev => ({ ...prev, [key.id]: !prev[key.id] }))}
                              className="p-1.5 text-foreground-muted hover:text-foreground-primary hover:bg-background-tertiary rounded-lg transition-colors"
                              title={visibleKeys[key.id] ? "Hide Key" : "Show Key"}
                            >
                              {visibleKeys[key.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                            {key.status === 'active' && (
                              <button
                                onClick={() => handleRevokeKey(key.id)}
                                className="p-1.5 text-foreground-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Revoke Key"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-foreground-secondary mt-3 pt-3 border-t border-border">
                          <div>
                            <span className="block text-foreground-muted mb-0.5">Created</span>
                            {new Date(key.createdAt).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="block text-foreground-muted mb-0.5">Expires</span>
                            {key.expiresAt ? new Date(key.expiresAt).toLocaleDateString() : 'Never'}
                          </div>
                          <div>
                            <span className="block text-foreground-muted mb-0.5">Rate Limit</span>
                            <span className="capitalize">{key.rateLimit}</span>
                          </div>
                          <div>
                            <span className="block text-foreground-muted mb-0.5">Last Used</span>
                            {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}
                          </div>
                        </div>
                        {key.ipWhitelist && key.ipWhitelist.length > 0 && (
                          <div className="mt-2 text-xs text-foreground-secondary flex items-start gap-1">
                            <Shield size={12} className="mt-0.5" />
                            <span>Restricted to: {key.ipWhitelist.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground-primary text-sm flex items-center gap-2 mb-3"><Webhook size={16} /> Webhook URL</h4>
                <input type="url" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} placeholder="https://your-server.com/webhook"
                  className="w-full border border-border rounded-xl p-3 text-sm bg-background-primary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition" />
              </div>
            </div>
          )}

          {/* Generate Key Modal */}
          {isKeyModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-background-primary rounded-2xl shadow-xl w-full max-w-md animate-scale-up">
                <div className="flex justify-between items-center p-4 border-b border-border">
                  <h3 className="font-bold text-foreground-primary">Generate New API Key</h3>
                  <button onClick={() => setIsKeyModalOpen(false)} className="text-foreground-muted hover:text-foreground-primary">
                    <X size={20} />
                  </button>
                </div>
                <div className="p-4 space-y-4">
                  <InputField
                    label="Key Name"
                    value={newKeyData.name}
                    onChange={(v) => setNewKeyData({ ...newKeyData, name: v })}
                    placeholder="e.g. Mobile App, Backend Service"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground-primary mb-1.5">Expiration</label>
                      <input
                        type="date"
                        className="w-full border border-border rounded-xl p-3 text-sm bg-background-primary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition"
                        onChange={(e) => setNewKeyData({ ...newKeyData, expiresAt: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground-primary mb-1.5">Rate Limit</label>
                      <select
                        className="w-full border border-border rounded-xl p-3 text-sm bg-background-primary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition"
                        value={newKeyData.rateLimit}
                        onChange={(e) => setNewKeyData({ ...newKeyData, rateLimit: e.target.value as any })}
                      >
                        <option value="standard">Standard</option>
                        <option value="unlimited">Unlimited</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground-primary mb-1.5">IP Whitelist (Optional)</label>
                    <input
                      type="text"
                      className="w-full border border-border rounded-xl p-3 text-sm bg-background-primary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition"
                      placeholder="Comma separated IPs (e.g. 10.0.0.1, 192.168.1.1)"
                      value={newKeyData.ipWhitelist}
                      onChange={(e) => setNewKeyData({ ...newKeyData, ipWhitelist: e.target.value })}
                    />
                    <p className="text-[10px] text-foreground-muted mt-1">Leave empty to allow all IPs.</p>
                  </div>
                </div>
                <div className="p-4 border-t border-border flex justify-end gap-2">
                  <button
                    onClick={() => setIsKeyModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-foreground-secondary hover:bg-background-tertiary rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGenerateKey}
                    disabled={!newKeyData.name}
                    className="px-4 py-2 text-sm font-bold bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Generate Key
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
