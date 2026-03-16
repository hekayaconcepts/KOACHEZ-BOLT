import React, { useState } from 'react';
import { podcasts, coachProfile } from '../data/coachData';
import { Play, Pause, Clock, Headphones, ArrowRight, SkipBack, SkipForward, Volume2 } from 'lucide-react';

interface PodcastSectionProps {
  onViewAll: () => void;
  fullPage?: boolean;
}

const PodcastSection: React.FC<PodcastSectionProps> = ({ onViewAll, fullPage = false }) => {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const displayPodcasts = fullPage ? podcasts : podcasts.slice(0, 4);

  const togglePlay = (id: number) => {
    setPlayingId(playingId === id ? null : id);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className={`${fullPage ? 'min-h-screen py-12' : 'py-20'} bg-gradient-to-b from-sky-50 to-white`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <span className="inline-block px-4 py-1 bg-sky-100 text-sky-700 text-sm font-medium rounded-full mb-4">
              <Headphones className="w-4 h-4 inline mr-1" />
              The Leadership Lab Podcast
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-sky-900 mb-2">
              Listen & Learn
            </h2>
            <p className="text-gray-600 max-w-xl">
              Weekly conversations on leadership, growth, and building a meaningful career.
            </p>
          </div>
          {!fullPage && (
            <button
              onClick={onViewAll}
              className="mt-4 sm:mt-0 text-sky-600 font-medium hover:text-sky-700 transition-colors inline-flex items-center"
            >
              All episodes
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>

        {/* Featured player for full page */}
        {fullPage && playingId && (
          <div className="mb-12 bg-gradient-to-r from-sky-600 to-sky-700 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-6">
              <img
                src={podcasts.find(p => p.id === playingId)?.image}
                alt=""
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <p className="text-sky-200 text-sm mb-1">Now Playing</p>
                <h3 className="font-semibold text-lg">
                  {podcasts.find(p => p.id === playingId)?.title}
                </h3>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-6">
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${(currentTime / 100) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-sky-200 mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{podcasts.find(p => p.id === playingId)?.duration}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <SkipBack className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setPlayingId(null)}
                className="p-4 bg-white text-sky-600 rounded-full hover:bg-sky-100 transition-colors"
              >
                <Pause className="w-6 h-6" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <SkipForward className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors ml-4">
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Podcast grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {displayPodcasts.map((podcast) => (
            <div
              key={podcast.id}
              className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 flex gap-4 ${
                playingId === podcast.id ? 'ring-2 ring-sky-500' : ''
              }`}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={podcast.image}
                  alt={podcast.title}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover"
                />
                <button
                  onClick={() => togglePlay(podcast.id)}
                  className={`absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg opacity-0 hover:opacity-100 transition-opacity ${
                    playingId === podcast.id ? 'opacity-100' : ''
                  }`}
                >
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    {playingId === podcast.id ? (
                      <Pause className="w-5 h-5 text-sky-600" />
                    ) : (
                      <Play className="w-5 h-5 text-sky-600 ml-1" />
                    )}
                  </div>
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <span className="font-medium text-sky-600">Episode {podcast.episode}</span>
                  <span className="mx-2">•</span>
                  <span>{podcast.date}</span>
                </div>

                <h3 className="font-semibold text-sky-900 mb-2 line-clamp-2 hover:text-sky-600 cursor-pointer transition-colors">
                  {podcast.title}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-2 mb-3 hidden sm:block">
                  {podcast.description}
                </p>

                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {podcast.duration}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Subscribe section */}
        <div className="mt-12 bg-sky-900 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Never Miss an Episode</h3>
          <p className="text-sky-200 mb-6 max-w-md mx-auto">
            Subscribe to The Leadership Lab and get new episodes delivered every week.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-white text-sky-900 font-medium rounded-lg hover:bg-sky-100 transition-colors">
              Apple Podcasts
            </button>
            <button className="px-6 py-3 bg-white text-sky-900 font-medium rounded-lg hover:bg-sky-100 transition-colors">
              Spotify
            </button>
            <button className="px-6 py-3 bg-sky-800 text-white font-medium rounded-lg hover:bg-sky-700 transition-colors">
              RSS Feed
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PodcastSection;
