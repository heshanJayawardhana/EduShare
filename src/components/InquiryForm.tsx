import React, { useState } from 'react';
import { Mail, Send, Users, MessageSquare, AlertCircle } from 'lucide-react';
import apiService from '../services/apiService';

interface InquiryFormProps {
  resourceId?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  onSubmit?: (data: { subject: string; message: string; name?: string; email?: string }) => void;
  className?: string;
}

const InquiryForm: React.FC<InquiryFormProps> = ({ 
  resourceId, 
  userId, 
  userName, 
  userEmail, 
  onSubmit, 
  className = '' 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };

    // Name validation (optional but if provided, must be valid)
    if (formData.name && formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation (optional but if provided, must be valid)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Subject validation (required)
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters';
    } else if (formData.subject.trim().length > 100) {
      newErrors.subject = 'Subject must be less than 100 characters';
    }

    // Message validation (required)
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters';
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.subject && !newErrors.message;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit inquiry via API
      if (resourceId && userId) {
        await apiService.submitInquiry({
          resourceId,
          userId,
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          userName: userName || formData.name.trim(),
          userEmail: userEmail || formData.email.trim()
        });
      } else {
        // General contact form submission
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      }
      
      if (onSubmit) {
        onSubmit({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim()
        });
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setErrors({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      // Show success message
      alert('Inquiry submitted successfully! The uploader will be notified.');

    } catch (error) {
      console.error('Form submission error:', error);
      setErrors(prev => ({
        ...prev,
        message: 'Failed to submit inquiry. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center mb-6">
        <Mail className="h-6 w-6 text-purple-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="John Doe (optional)"
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="john@example.com (optional)"
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Subject Field (Required) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => handleInputChange('subject', e.target.value)}
            placeholder="How can we help you?"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.subject ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
            }`}
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.subject}
            </p>
          )}
        </div>

        {/* Message Field (Required) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Please describe your inquiry in detail..."
              rows={6}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                errors.message ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.message && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.message}
            </p>
          )}
          <div className="mt-1 text-xs text-gray-500 text-right">
            {formData.message.length}/1000 characters
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </>
          )}
        </button>
      </form>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <h3 className="font-medium text-purple-900 mb-2">Need immediate help?</h3>
        <p className="text-sm text-purple-700">
          You can also reach us at <strong>support@edushare.com</strong> or call us at <strong>+94 77 123 4567</strong>
        </p>
      </div>
    </div>
  );
};

export default InquiryForm;
