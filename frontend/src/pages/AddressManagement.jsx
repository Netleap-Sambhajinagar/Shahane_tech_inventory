import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../utils/api';

const AddressManagement = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    city: '',
    state: '',
    zip_code: '',
    detailed_address: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchAddress();
  }, []);

  const fetchAddress = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(getApiUrl('/api/users/address'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        // Token expired or invalid, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      if (response.status === 403) {
        setMessage('Admin cannot access user endpoints. Please login as a user.');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setAddress({
          city: data.city || '',
          state: data.state || '',
          zip_code: data.zip_code || '',
          detailed_address: data.detailed_address || ''
        });
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setMessage('Failed to load address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(getApiUrl('/api/users/address'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(address)
      });

      if (response.status === 401) {
        // Token expired or invalid, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      if (response.status === 403) {
        const errorData = await response.json();
        setMessage(errorData.message || 'Admin cannot access user endpoints. Please login as a user.');
        return;
      }

      if (response.ok) {
        setMessage('Address updated successfully!');
        setIsEditing(false);
      } else {
        setMessage('Failed to update address');
      }
    } catch (error) {
      console.error('Error updating address:', error);
      setMessage('Failed to update address');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchAddress(); // Reset to original data
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading address...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/account')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-red-600" />
            <h1 className="text-3xl font-bold text-slate-900">Your Addresses</h1>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('successfully') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Address Form */}
        <div className="bg-white border border-slate-200 rounded-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Delivery Address</h2>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Edit Address
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="Enter your city"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                State
              </label>
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="Enter your state"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                name="zip_code"
                value={address.zip_code}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="Enter ZIP code"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Detailed Address
            </label>
            <textarea
              name="detailed_address"
              value={address.detailed_address}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-slate-50 disabled:text-slate-500"
              placeholder="Enter your complete address (street, house number, etc.)"
            />
          </div>

          {/* Address Preview */}
          {!isEditing && (address.city || address.state || address.zip_code || address.detailed_address) && (
            <div className="mt-8 p-6 bg-slate-50 rounded-lg">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Current Address</h3>
              <div className="space-y-2 text-slate-700">
                {address.detailed_address && <p>{address.detailed_address}</p>}
                {(address.city || address.state || address.zip_code) && (
                  <p>
                    {address.city && `${address.city}`}
                    {address.city && address.state && ', '}
                    {address.state && `${address.state}`}
                    {(address.city || address.state) && address.zip_code && ' - '}
                    {address.zip_code && `${address.zip_code}`}
                  </p>
                )}
              </div>
            </div>
          )}

          {!isEditing && !address.city && !address.state && !address.zip_code && !address.detailed_address && (
            <div className="mt-8 p-6 bg-slate-50 rounded-lg text-center">
              <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-500">No address added yet</p>
              <p className="text-sm text-slate-400 mt-1">Click "Edit Address" to add your delivery address</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressManagement;
