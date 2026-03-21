import React from 'react';
import InquiryForm from '../components/InquiryForm';

const ContactPage: React.FC = () => {
  const handleInquirySubmit = (data: { subject: string; message: string; name?: string; email?: string }) => {
    console.log('Inquiry submitted:', data);
    // Here you would typically send this to your backend API
    alert('Thank you for your inquiry! We will get back to you soon.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600">
            Have questions about EduShare? We're here to help! Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <InquiryForm onSubmit={handleInquirySubmit} />

        {/* Additional Contact Information */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Other Ways to Reach Us</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Email Support</h3>
                <p className="text-gray-600">support@edushare.com</p>
                <p className="text-sm text-gray-500">Response time: 24-48 hours</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Phone Support</h3>
                <p className="text-gray-600">+94 77 123 4567</p>
                <p className="text-sm text-gray-500">Mon-Fri, 9AM-6PM SLST</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Office Location</h3>
                <p className="text-gray-600">Colombo, Sri Lanka</p>
                <p className="text-sm text-gray-500">By appointment only</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">How do I upload resources?</h3>
                <p className="text-gray-600 text-sm">
                  Navigate to the Upload page, select your files, add details, and submit for review.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">How do I earn money?</h3>
                <p className="text-gray-600 text-sm">
                  Set your price for resources and earn 70% of each sale. Payouts are processed monthly.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">What file formats are supported?</h3>
                <p className="text-gray-600 text-sm">
                  We support PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, and image files.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
