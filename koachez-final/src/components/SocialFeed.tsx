import React, { useState } from 'react';
import { coachProfile } from '../data/coachData';
import { Linkedin, Youtube, Instagram, ExternalLink, Heart, MessageCircle, Share2, Play } from 'lucide-react';

interface SocialFeedProps {
  fullPage?: boolean;
}

const SocialFeed: React.FC<SocialFeedProps> = ({ fullPage = false }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'linkedin' | 'youtube' | 'instagram'>('all');

  // Mock social media posts
  const socialPosts = [
    {
      id: 1,
      platform: 'linkedin',
      content: "Leadership isn't about being in charge. It's about taking care of those in your charge. Here are 5 ways to show your team you value them...",
      date: '2 hours ago',
      likes: 234,
      comments: 45,
      shares: 12,
      image: null,
    },
    {
      id: 2,
      platform: 'youtube',
      content: 'NEW VIDEO: The 3 Habits That Transformed My Leadership Style',
      date: '1 day ago',
      likes: 1200,
      comments: 89,
      shares: 156,
      image: 'https://d64gsuwffb70l.cloudfront.net/696a677ac6fed1d4b2d4195b_1768581265086_a5d11eee.png',
      isVideo: true,
    },
    {
      id: 3,
      platform: 'instagram',
      content: 'Monday motivation: Your potential is endless. Go do what you were created to do. 💪 #leadership #coaching #motivation',
      date: '2 days ago',
      likes: 567,
      comments: 34,
      shares: 23,
      image: 'https://d64gsuwffb70l.cloudfront.net/696a677ac6fed1d4b2d4195b_1768581333070_05ca54fc.png',
    },
    {
      id: 4,
      platform: 'linkedin',
      content: "Just wrapped up an incredible workshop with 50+ executives on building psychological safety in teams. The energy in the room was electric! Key takeaway: Vulnerability is strength, not weakness.",
      date: '3 days ago',
      likes: 456,
      comments: 67,
      shares: 34,
      image: null,
    },
    {
      id: 5,
      platform: 'youtube',
      content: 'How to Have Difficult Conversations Without Burning Bridges',
      date: '5 days ago',
      likes: 2300,
      comments: 145,
      shares: 234,
      image: 'https://d64gsuwffb70l.cloudfront.net/696a677ac6fed1d4b2d4195b_1768581262587_e94efa7f.jpg',
      isVideo: true,
    },
    {
      id: 6,
      platform: 'instagram',
      content: 'Behind the scenes of today\'s podcast recording. Grateful for these conversations that push my thinking. 🎙️',
      date: '1 week ago',
      likes: 789,
      comments: 56,
      shares: 12,
      image: 'https://d64gsuwffb70l.cloudfront.net/696a677ac6fed1d4b2d4195b_1768581285656_65c7995d.png',
    },
  ];

  const filteredPosts = activeTab === 'all' 
    ? socialPosts 
    : socialPosts.filter(post => post.platform === activeTab);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return <Linkedin className="w-5 h-5 text-[#0A66C2]" />;
      case 'youtube':
        return <Youtube className="w-5 h-5 text-red-500" />;
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-500" />;
      default:
        return null;
    }
  };

  const getPlatformUrl = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return coachProfile.linkedin;
      case 'youtube':
        return coachProfile.youtube;
      case 'instagram':
        return coachProfile.instagram;
      default:
        return '#';
    }
  };

  return (
    <section className={`${fullPage ? 'min-h-screen py-12' : 'py-20'} bg-gray-50`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-sky-100 text-sky-700 text-sm font-medium rounded-full mb-4">
            Social Media
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-sky-900 mb-4">
            Stay Connected
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Follow along for daily insights, behind-the-scenes content, and leadership tips.
          </p>
        </div>

        {/* Platform tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { id: 'all', label: 'All', icon: null },
            { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
            { id: 'youtube', label: 'YouTube', icon: Youtube },
            { id: 'instagram', label: 'Instagram', icon: Instagram },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-sky-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.icon && <tab.icon className="w-4 h-4 mr-2" />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Social feed */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={coachProfile.image}
                      alt={coachProfile.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{coachProfile.name}</h3>
                        {getPlatformIcon(post.platform)}
                      </div>
                      <p className="text-sm text-gray-500">{post.date}</p>
                    </div>
                  </div>
                  <a
                    href={getPlatformUrl(post.platform)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                </div>

                {/* Content */}
                <p className="text-gray-700 mb-4">{post.content}</p>

                {/* Image/Video */}
                {post.image && (
                  <div className="relative rounded-xl overflow-hidden mb-4">
                    <img
                      src={post.image}
                      alt=""
                      className="w-full aspect-video object-cover"
                    />
                    {post.isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                          <Play className="w-7 h-7 text-sky-600 ml-1" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Engagement */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm">{post.likes.toLocaleString()}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 hover:text-sky-500 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm">{post.shares}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Follow CTA */}
        <div className="mt-12 bg-gradient-to-r from-sky-600 to-sky-700 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Follow for Daily Insights</h3>
          <p className="text-sky-100 mb-6 max-w-md mx-auto">
            Join thousands of leaders who get daily tips and inspiration.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={coachProfile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-6 py-3 bg-white text-[#0A66C2] font-medium rounded-lg hover:bg-sky-50 transition-colors"
            >
              <Linkedin className="w-5 h-5 mr-2" />
              LinkedIn
            </a>
            <a
              href={coachProfile.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-6 py-3 bg-white text-red-500 font-medium rounded-lg hover:bg-sky-50 transition-colors"
            >
              <Youtube className="w-5 h-5 mr-2" />
              YouTube
            </a>
            <a
              href={coachProfile.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-6 py-3 bg-white text-pink-500 font-medium rounded-lg hover:bg-sky-50 transition-colors"
            >
              <Instagram className="w-5 h-5 mr-2" />
              Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialFeed;
