// backend/src/middleware/points.js
import User from '../models/User.js';

const POINTS_VALUES = {
  UPLOAD_DRAWING: 10,
  RECEIVE_LIKE: 2,
  COMPLETE_BOOK: 20,
  FIRST_DRAWING: 50,
  STREAK_BONUS: 15,
  RECEIVE_COMMENT: 3,
  FIRST_COMMENT: 5,
  COMMENT_STREAK: 2
};

const ACHIEVEMENTS = {
  BEGINNER_ARTIST: { required: 1, points: 50, badge: '🎨' },
  REGULAR_ARTIST: { required: 5, points: 100, badge: '🎨🎨' },
  MASTER_ARTIST: { required: 10, points: 200, badge: '🎨🎨🎨' },
  POPULAR_DRAWING: { required: 10, type: 'likes', points: 100, badge: '⭐' },
  BOOKWORM: { required: 5, type: 'books', points: 150, badge: '📚' }
};

const checkAchievements = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found in checkAchievements');
      return [];
    }

    const newAchievements = [];
    const currentAchievements = user.achievements || [];

    for (const [name, achievement] of Object.entries(ACHIEVEMENTS)) {
      if (!currentAchievements.includes(name)) {
        let qualified = false;

        switch (achievement.type) {
          case 'likes':
            qualified = (user.totalLikes || 0) >= achievement.required;
            break;
          case 'books':
            qualified = (user.completedBooks?.length || 0) >= achievement.required;
            break;
          default:
            // Default to checking drawings count
            qualified = (user.drawings?.length || 0) >= achievement.required;
        }

        if (qualified) {
          newAchievements.push(name);
          currentAchievements.push(name);
        }
      }
    }

    if (newAchievements.length > 0) {
      await User.findByIdAndUpdate(userId, {
        achievements: currentAchievements,
        $inc: { 
          points: newAchievements.reduce((total, name) => 
            total + (ACHIEVEMENTS[name]?.points || 0), 0)
        }
      });
    }

    return newAchievements;
  } catch (error) {
    console.error('Error in checkAchievements:', error);
    return [];
  }
};

const awardPoints = async (userId, action, metadata = {}) => {
  try {
    let pointsToAward = POINTS_VALUES[action] || 0;
    const user = await User.findById(userId);
    
    if (!user) {
      console.log('User not found in awardPoints');
      return { pointsAwarded: 0, newAchievements: [] };
    }

    // Check for first drawing bonus
    if (action === 'UPLOAD_DRAWING' && (!user.drawings || user.drawings.length === 0)) {
      pointsToAward += POINTS_VALUES.FIRST_DRAWING;
    }

    // Update user points and history
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $inc: { points: pointsToAward },
        $push: { 
          pointsHistory: {
            action,
            points: pointsToAward,
            timestamp: new Date(),
            metadata
          }
        }
      },
      { new: true }
    );

    // Check for new achievements
    const newAchievements = await checkAchievements(userId);

    return {
      pointsAwarded: pointsToAward,
      newAchievements,
      totalPoints: updatedUser.points
    };
  } catch (error) {
    console.error('Error awarding points:', error);
    return { pointsAwarded: 0, newAchievements: [] };
  }
};

export { awardPoints, POINTS_VALUES, ACHIEVEMENTS };