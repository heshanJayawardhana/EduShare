import React, { useState, useEffect, useRef } from 'react';
import { Star, Heart, Share, Download, Play, Pause, Volume2, Maximize2, SkipBack, SkipForward, Users, Clock, CheckCircle, Eye, MessageCircle, Send, X, Award, Upload } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CommentBox from '../components/CommentBox';
import NotificationSystem from '../components/NotificationSystem';
import apiService from '../services/apiService';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  rating: number;
  timestamp: string;
  userBadge?: 'Bronze' | 'Silver' | 'Gold';
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'Pending' | 'Answered';
  timestamp: string;
  answer?: string;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document';
  videoUrl?: string;
  documentUrl?: string;
  uploader: string;
  uploaderBadge?: 'Bronze' | 'Silver' | 'Gold';
  faculty: string;
  module: string;
  semester: string;
  uploadDate: string;
  price: number;
  currency: string;
  isFree: boolean;
  averageRating: number;
  totalRatings: number;
}

const ResourceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [resource, setResource] = useState<Resource | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // SLIIT Course Web sample data
  const mockResource: Resource = {
    id: id || '1',
    title: 'Web Development Fundamentals - Complete Course',
    description: 'Master the fundamentals of web development with HTML5, CSS3, JavaScript, and responsive design. This comprehensive course covers everything from basic HTML structure to modern CSS techniques and JavaScript programming, with practical hands-on projects and real-world applications.',
    type: 'video',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    uploader: 'Prof. Michael Chen',
    uploaderBadge: 'Silver',
    faculty: 'IT',
    module: 'Web Development',
    semester: 'Year 1',
    uploadDate: '2024-01-15',
    price: 0,
    currency: 'LKR',
    isFree: true,
    averageRating: 4.6,
    totalRatings: 89
  };

  const mockComments: Comment[] = [
    {
      id: '1',
      userId: '1',
      userName: 'David Kumar',
      content: 'The HTML5 section was excellent! The semantic HTML examples really clarified proper structure.',
      rating: 5,
      timestamp: '3 hours ago',
      userBadge: 'Gold'
    },
    {
      id: '2',
      userId: '2',
      userName: 'Sarah Lee',
      content: 'CSS Grid and Flexbox explanations were very clear. The responsive design examples were practical.',
      rating: 4,
      timestamp: '6 hours ago',
      userBadge: 'Silver'
    },
    {
      'id': '3',
      userId: '3',
      userName: 'Mike Wilson',
      content: 'JavaScript concepts were explained well, but more ES6+ examples would be helpful.',
      rating: 4,
      timestamp: '1 day ago',
      userBadge: 'Bronze'
    },
    {
      'id': '4',
      userId: '4',
      userName: 'Lisa Anderson',
      content: 'Perfect for beginners! The step-by-step approach made learning web development easy.',
      rating: 5,
      timestamp: '2 days ago',
      userBadge: 'Silver'
    }
  ];

  const mockInquiries: Inquiry[] = [
    {
      id: '1',
      name: 'Ravindu Perera',
      email: 'ravindu.p@my.sliit.lk',
      subject: 'CSS Grid Layout Help',
      message: 'I\'m having trouble understanding CSS Grid auto-fit and auto-fill properties. Can you provide more examples?',
      status: 'Answered',
      timestamp: '3 days ago',
      answer: 'I\'ve added a supplementary video covering CSS Grid advanced techniques with practical examples for responsive layouts.'
    },
    {
      id: '2',
      name: 'Nimali Fernando',
      email: 'nimali.f@my.sliit.lk',
      subject: 'JavaScript Async/Await',
      message: 'Can you explain async/await with more real-world examples? The current examples are basic.',
      status: 'Answered',
      timestamp: '2 days ago',
      answer: 'Great question! I\'ve created additional content covering API calls, error handling, and practical async patterns.'
    },
    {
      id: '3',
      name: 'Kasun Silva',
      email: 'kasun.s@my.sliit.lk',
      subject: 'Mobile Responsive Design',
      message: 'Do you have resources for mobile-first design principles and media queries?',
      status: 'Pending',
      timestamp: '1 day ago'
    }
  ];

  useEffect(() => {
    setResource(mockResource);
    setComments(mockComments);
    setInquiries(mockInquiries);
  }, [id]);

  const handleRating = async (rating: number) => {
    if (!isAuthenticated) {
      alert('Please sign in to rate this resource');
      return;
    }
    try {
      const response = await fetch(`/api/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          resourceId: id,
          rating: rating
        })
      });
      
      if (response.ok) {
        setUserRating(rating);
        // Update resource rating
        const data = await response.json();
        if (resource) {
          setResource({
            ...resource,
            averageRating: data.newAverageRating,
            totalRatings: data.newTotalRatings
          });
        }
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      // Fallback to local state
      setUserRating(rating);
    }
  };

  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to comment on this resource');
      return;
    }
    if (newComment.trim()) {
      try {
        const response = await fetch(`/api/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            resourceId: id,
            content: newComment,
            rating: 5
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          const newCommentObj: Comment = {
            id: data.comment._id,
            userId: user?.id || 'current-user',
            userName: user?.name || 'Current User',
            content: newComment,
            rating: 5,
            timestamp: 'Just now',
            userBadge: user?.badge || 'Bronze'
          };
          setComments([newCommentObj, ...comments]);
          setNewComment('');
        }
      } catch (error) {
        console.error('Error submitting comment:', error);
        // Fallback to local state
        const newCommentObj: Comment = {
          id: Date.now().toString(),
          userId: user?.id || 'current-user',
          userName: user?.name || 'Current User',
          content: newComment,
          rating: 5,
          timestamp: 'Just now',
          userBadge: user?.badge || 'Bronze'
        };
        setComments([newCommentObj, ...comments]);
        setNewComment('');
      }
    }
  };

  const validateInquiryForm = () => {
    const { name, email, subject, message } = inquiryForm;
    
    // Name validation
    if (!name || name.trim().length < 2) {
      alert('Please enter a valid name (at least 2 characters)');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return false;
    }
    
    // Subject validation
    if (!subject || subject.trim().length < 5) {
      alert('Please enter a subject (at least 5 characters)');
      return false;
    }
    
    // Message validation
    if (!message || message.trim().length < 10) {
      alert('Please enter a message (at least 10 characters)');
      return false;
    }
    
    // Module validation (if user is authenticated and has module)
    if (user && !resource?.module) {
      alert('Module information is required for this inquiry');
      return false;
    }
    
    return true;
  };

  const handleSubmitInquiry = async () => {
    if (!validateInquiryForm()) {
      return;
    }
    
    try {
      const response = await fetch(`/api/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user ? `Bearer ${localStorage.getItem('token')}` : ''
        },
        body: JSON.stringify({
          resourceId: id,
          name: inquiryForm.name || user?.name || '',
          email: inquiryForm.email || user?.email || '',
          subject: inquiryForm.subject,
          message: inquiryForm.message,
          module: resource?.module || 'General'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const newInquiry: Inquiry = {
          id: data.inquiry._id,
          name: inquiryForm.name || user?.name || '',
          email: inquiryForm.email || user?.email || '',
          subject: inquiryForm.subject,
          message: inquiryForm.message,
          status: 'Pending',
          timestamp: 'Just now'
        };
        setInquiries([newInquiry, ...inquiries]);
        setInquiryForm({ name: '', email: '', subject: '', message: '' });
        setShowInquiryForm(false);
        alert('Inquiry submitted successfully! The uploader and admin have been notified.');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to submit inquiry');
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Failed to submit inquiry. Please try again.');
    }
  };

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'Gold':
        return 'bg-gradient-to-r from-yellow-200 to-amber-200 text-yellow-800 border-yellow-300 shadow-yellow-200';
      case 'Silver':
        return 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 border-gray-400';
      case 'Bronze':
        return 'bg-gradient-to-r from-orange-200 to-amber-200 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getBadgeEmoji = (badge?: string) => {
    switch (badge) {
      case 'Gold': return '🥇';
      case 'Silver': return '🥈';
      case 'Bronze': return '🥉';
      default: return '';
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSignInClick = () => {
    // Create a custom event to trigger the auth modal
    const event = new CustomEvent('openAuthModal');
    window.dispatchEvent(event);
  };

  if (!resource) {
    return (
      <div className="min-h-screen bg-lavender-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resource...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Video Player Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="relative aspect-video bg-black">
            {resource.type === 'video' ? (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                  <source src="https://www.w3schools.com/html/mov_bbb.ogg" type="video/ogg" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Video Controls Overlay */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${
                    showControls ? 'opacity-100' : 'opacity-0'
                  }`}
                  onMouseEnter={() => setShowControls(true)}
                  onMouseLeave={() => setShowControls(false)}
                >
                  {/* Play/Pause Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={handlePlayPause}
                      className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="h-8 w-8 text-white" />
                      ) : (
                        <Play className="h-8 w-8 text-white" />
                      )}
                    </button>
                  </div>
                  
                  {/* Bottom Controls */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center space-x-4">
                      {/* Play/Pause */}
                      <button
                        onClick={handlePlayPause}
                        className="text-white hover:text-purple-300 transition-colors"
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </button>
                      
                      {/* Progress Bar */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-white text-xs">{formatTime(currentTime)}</span>
                          <div className="flex-1 bg-white/30 rounded-full h-1 relative">
                            <div
                              className="absolute top-0 left-0 h-full bg-purple-500 rounded-full"
                              style={{ width: `${(currentTime / duration) * 100}%` }}
                            />
                            <input
                              type="range"
                              min="0"
                              max={duration}
                              value={currentTime}
                              onChange={(e) => handleSeek(Number(e.target.value))}
                              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                          <span className="text-white text-xs">{formatTime(duration)}</span>
                        </div>
                      </div>
                      
                      {/* Volume */}
                      <div className="flex items-center space-x-2">
                        <Volume2 className="h-5 w-5 text-white" />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={(e) => handleVolumeChange(Number(e.target.value))}
                          className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
                        />
                      </div>
                      
                      {/* Fullscreen */}
                      <button
                        onClick={handleFullscreen}
                        className="text-white hover:text-purple-300 transition-colors"
                      >
                        <Maximize2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center">
                <Eye className="h-20 w-20 text-white mb-4" />
                <p className="text-white">Document Viewer</p>
                <p className="text-gray-400 text-sm mt-2">{resource.documentUrl}</p>
              </div>
            )}
          </div>
        </div>

        {/* Resource Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{resource.title}</h1>
          
          {/* Uploader Info with Badge */}
          <div className="flex items-center mb-6">
            <span className="text-gray-600 mr-2">Uploaded by</span>
            <span className="font-semibold text-gray-900 mr-2">{resource.uploader}</span>
            {resource.uploaderBadge && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getBadgeColor(resource.uploaderBadge)}`}>
                <span className="mr-1">{getBadgeEmoji(resource.uploaderBadge)}</span>
                {resource.uploaderBadge} Contributor
                {resource.uploaderBadge === 'Gold' && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                )}
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              {resource.faculty}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {resource.module}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {resource.semester}
            </span>
          </div>

          {/* Upload Date */}
          <div className="flex items-center text-gray-600 mb-6">
            <Clock className="h-4 w-4 mr-2" />
            Uploaded on {resource.uploadDate}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              {resource.isFree ? (
                <span className="text-2xl font-bold text-green-600">Free</span>
              ) : (
                <span className="text-2xl font-bold text-purple-600">
                  {resource.currency} {resource.price.toLocaleString()}
                </span>
              )}
            </div>
            <div className="flex space-x-4">
              <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700">
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
              <button className="flex items-center px-4 py-2 border border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </button>
              <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50">
                <Share className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Rating System */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Rate This Resource</h2>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="flex mr-4">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleRating(i + 1)}
                    className="mr-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        i < userRating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 hover:text-yellow-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {userRating > 0 ? `You rated: ${userRating} stars` : 
                   isAuthenticated ? 'Click to rate' : 'Sign in to rate'}
                </p>
                {!isAuthenticated && (
                  <p className="text-sm text-purple-600 mt-1">
                    Click the profile icon to sign in
                  </p>
                )}
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{resource.averageRating}</p>
              <p className="text-gray-600">Average Rating ({resource.totalRatings} ratings)</p>
            </div>
          </div>
        </div>

        
        {/* Comments Section */}
        <div className="mb-8">
          <CommentBox
            resourceId={id || ''}
            userId={user?.id}
            userName={user?.name}
            comments={comments.map(comment => ({
              ...comment,
              resourceId: comment.id,
              createdAt: comment.timestamp,
              isPositive: Math.random() > 0.3 // Mock positive/negative for demo
            }))}
            onAddComment={(comment) => {
              if (isAuthenticated) {
                const newCommentObj = {
                  id: Date.now().toString(),
                  userId: user?.id || 'anonymous',
                  userName: user?.name || 'Anonymous User',
                  content: comment.content,
                  rating: comment.rating,
                  timestamp: 'Just now',
                  userBadge: user?.badge || 'Bronze'
                };
                setComments([newCommentObj, ...comments]);
              }
            }}
            canDelete={false}
            showAddComment={isAuthenticated}
          />
          
          {!isAuthenticated && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center mb-6">
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign in to Comment</h3>
              <p className="text-gray-600 mb-4">Join the conversation and share your thoughts about this resource.</p>
              <button
                onClick={handleSignInClick}
                className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
              >
                Sign In to Comment
              </button>
            </div>
          )}
        </div>

          
        {/* Inquiry Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Student Inquiries</h2>
            <button
              onClick={() => setShowInquiryForm(!showInquiryForm)}
              className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Ask a Question
            </button>
          </div>

          {/* Inquiry Form */}
          {showInquiryForm && (
            <div className="mb-8 p-6 bg-lavender-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Your Inquiry</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({...inquiryForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({...inquiryForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={inquiryForm.subject}
                    onChange={(e) => setInquiryForm({...inquiryForm, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({...inquiryForm, message: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={4}
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowInquiryForm(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitInquiry}
                    className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
                  >
                    Submit Inquiry
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Previous Inquiries */}
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{inquiry.subject}</h4>
                    <p className="text-sm text-gray-600">{inquiry.name} - {inquiry.email}</p>
                  </div>
                  <div className="flex items-center">
                    {inquiry.status === 'Answered' ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-green-600 font-medium">Answered</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                        <span className="text-yellow-600 font-medium">Pending</span>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{inquiry.message}</p>
                <p className="text-sm text-gray-500">{inquiry.timestamp}</p>
                {inquiry.answer && (
                  <div className="mt-4 p-4 bg-green-50 rounded-xl">
                    <p className="text-green-800">{inquiry.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailPage;
