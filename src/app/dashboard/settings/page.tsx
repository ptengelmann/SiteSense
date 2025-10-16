'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'company' | 'profile'>('company');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [companyData, setCompanyData] = useState({
    name: '',
    vatNumber: '',
    cisRegistrationNumber: '',
    companyNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postcode: '',
    phone: '',
    email: '',
  });

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [companyRes, profileRes] = await Promise.all([
        fetch('/api/settings/company'),
        fetch('/api/settings/profile'),
      ]);

      const company = await companyRes.json();
      const profile = await profileRes.json();

      if (company.data) setCompanyData(company.data);
      if (profile.data) setProfileData(profile.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCompanySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/settings/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save');
      }

      setMessage({ type: 'success', text: 'Company settings saved successfully!' });
      router.refresh();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const saveProfileSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save');
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      router.refresh();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="text-neutral-600 mt-3">Loading settings...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Settings</h1>
          <p className="text-neutral-600 mt-1">
            Manage your company profile and account settings
          </p>
        </div>

        {/* Message Banner */}
        {message && (
          <div
            className={`p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="card">
          <div className="border-b border-neutral-200">
            <div className="flex gap-4 px-6">
              <button
                onClick={() => setActiveTab('company')}
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === 'company'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Company Settings
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === 'profile'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Profile Settings
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Company Settings Tab */}
            {activeTab === 'company' && (
              <form onSubmit={saveCompanySettings} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Company Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={companyData.name}
                        onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Company Number</label>
                      <input
                        type="text"
                        value={companyData.companyNumber}
                        onChange={(e) => setCompanyData({ ...companyData, companyNumber: e.target.value })}
                        className="input"
                        placeholder="e.g., 12345678"
                      />
                    </div>
                    <div>
                      <label className="label">VAT Number</label>
                      <input
                        type="text"
                        value={companyData.vatNumber}
                        onChange={(e) => setCompanyData({ ...companyData, vatNumber: e.target.value })}
                        className="input"
                        placeholder="GB123456789"
                      />
                    </div>
                    <div>
                      <label className="label">CIS Registration Number</label>
                      <input
                        type="text"
                        value={companyData.cisRegistrationNumber}
                        onChange={(e) => setCompanyData({ ...companyData, cisRegistrationNumber: e.target.value })}
                        className="input"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Address</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="label">Address Line 1</label>
                      <input
                        type="text"
                        value={companyData.addressLine1}
                        onChange={(e) => setCompanyData({ ...companyData, addressLine1: e.target.value })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Address Line 2</label>
                      <input
                        type="text"
                        value={companyData.addressLine2}
                        onChange={(e) => setCompanyData({ ...companyData, addressLine2: e.target.value })}
                        className="input"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">City</label>
                        <input
                          type="text"
                          value={companyData.city}
                          onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="label">Postcode</label>
                        <input
                          type="text"
                          value={companyData.postcode}
                          onChange={(e) => setCompanyData({ ...companyData, postcode: e.target.value })}
                          className="input"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Phone Number</label>
                      <input
                        type="tel"
                        value={companyData.phone}
                        onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Email Address</label>
                      <input
                        type="email"
                        value={companyData.email}
                        onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                        className="input"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button type="submit" disabled={isSaving} className="btn btn-primary">
                    {isSaving ? 'Saving...' : 'Save Company Settings'}
                  </button>
                </div>
              </form>
            )}

            {/* Profile Settings Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={saveProfileSettings} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">First Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Last Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        className="input"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Account Details</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="label">Email Address <span className="text-red-500">*</span></label>
                      <input
                        type="email"
                        required
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="input"
                      />
                      <p className="text-xs text-neutral-600 mt-1">
                        This email is used for login and notifications
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card p-4 bg-blue-50 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-neutral-700">
                      <p className="font-medium">Password Reset</p>
                      <p className="mt-1">To change your password, please contact support or use the "Forgot Password" link on the login page.</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button type="submit" disabled={isSaving} className="btn btn-primary">
                    {isSaving ? 'Saving...' : 'Save Profile Settings'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
