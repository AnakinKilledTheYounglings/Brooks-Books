import React, { useState, useEffect } from 'react';
import { 
  Book, 
  Medal, 
  Image as ImageIcon, 
  Heart, 
  Award, 
  BookOpen,
  Settings,
  Edit3
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert } from '../components/ui/alert';
import apiService from '../services/apiService';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [drawings, setDrawings] = useState([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchDrawings();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await apiService.getProfile();
      if (data) {
        setProfile(data);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  const fetchDrawings = async () => {
    try {
      const data = await apiService.getProfileDrawings();
      setDrawings(data);
    } catch (err) {
      console.error('Error fetching drawings:', err);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    setUploadingPhoto(true);
  
    try {
      await apiService.updateProfilePhoto(file);
      // Force a complete profile refresh
      const profileData = await apiService.getProfile();
      setProfile(profileData);
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setUploadingPhoto(false);
    }
  };


  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <Alert variant="destructive" className="m-4">
      {error}
    </Alert>
  );

  if (!profile) return (
    <Alert variant="destructive" className="m-4">
      Please log in to view your profile
    </Alert>
  );

  const handlePhotoClick = () => {
    document.getElementById('photo-upload').click();
  };



  const renderOverview = () => (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Stats Cards */}
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold opacity-80">Total Points</p>
              <h3 className="text-3xl font-bold">{profile.points}</h3>
            </div>
            <Medal className="w-12 h-12 opacity-80" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold opacity-80">Drawings</p>
              <h3 className="text-3xl font-bold">{profile.drawings?.length || 0}</h3>
            </div>
            <ImageIcon className="w-12 h-12 opacity-80" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold opacity-80">Books Read</p>
              <h3 className="text-3xl font-bold">{profile.completedBooks?.length || 0}</h3>
            </div>
            <BookOpen className="w-12 h-12 opacity-80" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold opacity-80">Total Likes</p>
              <h3 className="text-3xl font-bold">{profile.totalLikes || 0}</h3>
            </div>
            <Heart className="w-12 h-12 opacity-80" />
          </div>
        </CardContent>
      </Card>

      {/* Achievements Section */}
      <Card className="md:col-span-2">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Award className="w-6 h-6" />
            Achievements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {profile.achievements?.map((achievement, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-center"
              >
                <div className="text-2xl mb-2">🏆</div>
                <p className="font-medium">{achievement}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="md:col-span-2">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {profile.pointsHistory?.map((activity, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-green-500 font-semibold">
                  +{activity.points} points
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDrawings = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {drawings.map((drawing, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <img 
              src={drawing.imageUrl} 
              alt={`Drawing for ${drawing.bookTitle}`} 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {new Date(drawing.createdAt).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span>{drawing.likes?.length || 0}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              From: {drawing.bookTitle}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderSettings = () => (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-6">Profile Settings</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Display Name</label>
            <input 
              type="text"
              className="w-full p-2 border rounded-md"
              value={profile.username}
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea 
              className="w-full p-2 border rounded-md"
              rows="4"
              disabled={!isEditing}
              placeholder="Tell us about yourself..."
            ></textarea>
          </div>
          <Button 
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2"
          >
            {isEditing ? (
              <>Save Changes</>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  console.log('Rendering profile photo:', {
    hasPhoto: !!profile.profilePhoto,
    photoUrl: profile.profilePhoto,
    username: profile.username
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="mb-8 text-center relative">
        <div className="relative inline-block">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center text-white text-4xl relative">
            {profile.profilePhoto ? (
              <img 
                src={profile.profilePhoto} 
                alt={profile.username}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  console.error('Image failed to load:', profile.profilePhoto);
                  e.target.src = ''; // Clear the source on error
                  e.target.onerror = null; // Prevent infinite loop
                }}
              />
            ) : (
              <span>{profile.username[0].toUpperCase()}</span>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="absolute bottom-0 right-0 rounded-full p-2"
            onClick={handlePhotoClick}  // Changed this line
            disabled={uploadingPhoto}
          >
            {uploadingPhoto ? (
              <div className="w-5 h-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
            ) : (
              <Edit3 className="w-4 h-4" />
            )}
          </Button>
          <input
            type="file"
            id="photo-upload"
            className="hidden"
            accept="image/*"
            onChange={handlePhotoUpload}
          />
        </div>
        <h1 className="text-3xl font-bold mb-2">{profile.username}</h1>
        <p className="text-gray-500">Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-8 border-b">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('drawings')}
          className={`px-6 py-3 ${activeTab === 'drawings' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
        >
          Drawings
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-3 ${activeTab === 'settings' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
        >
          Settings
        </button>
      </div>

      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'drawings' && renderDrawings()}
      {activeTab === 'settings' && renderSettings()}
    </div>
  );
};

export default UserProfile;