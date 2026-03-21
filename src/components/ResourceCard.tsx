import React from 'react';
import { Download, ShoppingCart, Eye } from 'lucide-react';
import { Resource } from '../types';
import RatingStars from './RatingStars';

interface ResourceCardProps {
  resource: Resource;
  onAddToCart?: (resource: Resource) => void;
  onViewDetails?: (resource: Resource) => void;
  className?: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onAddToCart,
  onViewDetails,
  className = '',
}) => {
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Gold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Silver':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'Bronze':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(resource);
  };

  const handleViewDetails = () => {
    onViewDetails?.(resource);
  };

  return (
    <div
      className={`resource-card bg-white rounded-lg shadow-md hover:shadow-xl cursor-pointer ${className}`}
      onClick={handleViewDetails}
    >
      <div className="p-6">
        {/* Resource Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {resource.title}
        </h3>

        {/* Uploaded By with Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">by {resource.uploadedBy.name}</span>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full border ${getBadgeColor(
                resource.uploadedBy.badge
              )}`}
            >
              {resource.uploadedBy.badge}
            </span>
          </div>
        </div>

        {/* Rating */}
        <div className="mb-3">
          <RatingStars rating={resource.rating} size="sm" showValue />
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {resource.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Download className="h-4 w-4" />
              <span>{resource.downloadCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{resource.category}</span>
            </div>
          </div>
          {resource.price && (
            <span className="font-semibold text-primary-600">
              ${resource.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleAddToCart}
          className="w-full btn-primary flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ResourceCard;
