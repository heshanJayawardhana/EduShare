// Badge System Implementation
export type Badge = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export interface UserProfile {
  commentsCount: number;
  uploadsCount: number;
  badge: Badge;
}

export const calculateBadge = (commentsCount: number, uploadsCount: number): Badge => {
  const score = commentsCount + (uploadsCount * 2); // Uploads worth more
  
  if (score >= 100) return 'Diamond';
  if (score >= 50) return 'Platinum';
  if (score >= 25) return 'Gold';
  if (score >= 10) return 'Silver';
  return 'Bronze';
};

export const getBadgeColor = (badge: Badge): string => {
  switch (badge) {
    case 'Diamond':
      return 'bg-gradient-to-r from-blue-200 to-cyan-200 text-blue-800 border-blue-300 shadow-blue-200';
    case 'Platinum':
      return 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 border-gray-400';
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

export const getBadgeEmoji = (badge: Badge): string => {
  switch (badge) {
    case 'Diamond': return '💎';
    case 'Platinum': return '🏆';
    case 'Gold': return '🥇';
    case 'Silver': return '🥈';
    case 'Bronze': return '🥉';
    default: return '';
  }
};

export const getBadgeDescription = (badge: Badge): string => {
  switch (badge) {
    case 'Diamond':
      return 'Elite Contributor - 100+ points';
    case 'Platinum':
      return 'Master Contributor - 50+ points';
    case 'Gold':
      return 'Expert Contributor - 25+ points';
    case 'Silver':
      return 'Active Contributor - 10+ points';
    case 'Bronze':
      return 'New Contributor - Starting out';
    default:
      return 'Contributor';
  }
};
