import React, { useState } from 'react';
import { Upload, X, FileText, Video, Briefcase, Calculator, Microscope, Palette, Laptop, GraduationCap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ResourceFormData {
  title: string;
  description: string;
  type: 'document' | 'video' | 'image' | 'other';
  faculty: string;
  module: string;
  academicYear: string;
  semester: string;
  price: number;
  currency: string;
  isFree: boolean;
  tags: string[];
  file: File | null;
}

const ResourceUploadPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState<ResourceFormData>({
    title: '',
    description: '',
    type: 'document',
    faculty: '',
    module: '',
    academicYear: '',
    semester: '',
    price: 0,
    currency: 'LKR',
    isFree: true,
    tags: [],
    file: null
  });

  const faculties = [
    { name: 'IT', icon: Laptop, color: 'bg-blue-500' },
    { name: 'Business', icon: Briefcase, color: 'bg-green-500' },
    { name: 'Engineering', icon: Calculator, color: 'bg-orange-500' },
    { name: 'Medicine', icon: Microscope, color: 'bg-red-500' },
    { name: 'Science', icon: Palette, color: 'bg-purple-500' },
    { name: 'Arts', icon: Palette, color: 'bg-pink-500' }
  ];

  const academicYears = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Postgraduate'];
  const semesters = ['Semester 1', 'Semester 2', 'Summer Session'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB');
        return;
      }
      setFormData({ ...formData, file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please sign in to upload resources');
      return;
    }

    if (!formData.title || !formData.description || !formData.file || !formData.faculty || !formData.module) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('faculty', formData.faculty);
      formDataToSend.append('module', formData.module);
      formDataToSend.append('academicYear', formData.academicYear);
      formDataToSend.append('semester', formData.semester);
      formDataToSend.append('price', formData.price.toString());
      formDataToSend.append('currency', formData.currency);
      formDataToSend.append('isFree', formData.isFree.toString());
      formDataToSend.append('tags', JSON.stringify(formData.tags));
      formDataToSend.append('file', formData.file);
      formDataToSend.append('uploaderId', user?.id || '');

      const response = await fetch('/api/resources/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      // Simulate upload progress (in real app, use XMLHttpRequest for progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      if (response.ok) {
        setUploadProgress(100);
        const data = await response.json();
        alert('Resource uploaded successfully!');
        // Reset form
        setFormData({
          title: '',
          description: '',
          type: 'document',
          faculty: '',
          module: '',
          academicYear: '',
          semester: '',
          price: 0,
          currency: 'LKR',
          isFree: true,
          tags: [],
          file: null
        });
        setUploadProgress(0);
      } else {
        const error = await response.json();
        alert(error.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="h-12 w-12 text-blue-500" />;
      case 'video': return <Video className="h-12 w-12 text-red-500" />;
      case 'image': return <FileText className="h-12 w-12 text-green-500" />;
      default: return <FileText className="h-12 w-12 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Upload Resource</h1>
              <p className="text-gray-600 mt-2">Share your knowledge with the SLIIT community</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <GraduationCap className="h-4 w-4" />
              <span>{user?.name || 'Guest'}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                user?.badge === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                user?.badge === 'Silver' ? 'bg-gray-100 text-gray-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {user?.badge || 'Bronze'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resource File *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mov,.avi,.jpg,.jpeg,.png"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {formData.file ? (
                    <div className="flex flex-col items-center">
                      {getFileIcon(formData.type)}
                      <p className="mt-2 text-sm font-medium text-gray-900">
                        {formData.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setFormData({ ...formData, file: null });
                        }}
                        className="mt-2 text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-500">
                        PDF, DOC, PPT, MP4, JPG, PNG (max 50MB)
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Resource Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resource Type *
              </label>
              <div className="grid grid-cols-4 gap-4">
                {['document', 'video', 'image', 'other'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type as any })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.type === type
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {getFileIcon(type)}
                    <p className="mt-2 text-sm font-medium capitalize">{type}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter resource title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Faculty *
                </label>
                <select
                  value={formData.faculty}
                  onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Faculty</option>
                  {faculties.map((faculty) => (
                    <option key={faculty.name} value={faculty.name}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={4}
                placeholder="Describe your resource..."
                required
              />
            </div>

            {/* Academic Info */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Module *
                </label>
                <input
                  type="text"
                  value={formData.module}
                  onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Web Development"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Year *
                </label>
                <select
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Year</option>
                  {academicYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semester *
                </label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Semester</option>
                  {semesters.map((semester) => (
                    <option key={semester} value={semester}>
                      {semester}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <label className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  checked={formData.isFree}
                  onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                  className="rounded text-purple-600"
                />
                <span className="text-sm font-medium text-gray-700">
                  Free Resource
                </span>
              </label>

              {!formData.isFree && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (LKR)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {isSubmitting && (
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-900">Uploading...</span>
                  <span className="text-sm text-purple-700">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Uploading...' : 'Upload Resource'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResourceUploadPage;
