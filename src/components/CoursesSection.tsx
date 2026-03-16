import React, { useState } from 'react';
import { courses } from '../data/coachData';
import { Play, Clock, BookOpen, ArrowRight, Lock, CheckCircle } from 'lucide-react';

interface CoursesSectionProps {
  onViewCourse: (courseId: number) => void;
  onViewAll: () => void;
  fullPage?: boolean;
  isLoggedIn?: boolean;
  enrolledCourses?: number[];
}

const CoursesSection: React.FC<CoursesSectionProps> = ({ 
  onViewCourse, 
  onViewAll, 
  fullPage = false,
  isLoggedIn = false,
  enrolledCourses = []
}) => {
  const [selectedLevel, setSelectedLevel] = useState('All');
  
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  
  const filteredCourses = selectedLevel === 'All' 
    ? courses 
    : courses.filter(c => c.level === selectedLevel);

  const displayCourses = fullPage ? filteredCourses : courses.slice(0, 6);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-700';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'Advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <section className={`${fullPage ? 'min-h-screen py-12' : 'py-20'} bg-white`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <span className="inline-block px-4 py-1 bg-sky-100 text-sky-700 text-sm font-medium rounded-full mb-4">
              <BookOpen className="w-4 h-4 inline mr-1" />
              Video Courses
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-sky-900 mb-2">
              Learn at Your Own Pace
            </h2>
            <p className="text-gray-600 max-w-xl">
              Comprehensive video courses designed to accelerate your leadership development.
            </p>
          </div>
          {!fullPage && (
            <button
              onClick={onViewAll}
              className="mt-4 sm:mt-0 text-sky-600 font-medium hover:text-sky-700 transition-colors inline-flex items-center"
            >
              View all courses
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>

        {/* Level filters for full page */}
        {fullPage && (
          <div className="flex flex-wrap gap-2 mb-8">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedLevel === level
                    ? 'bg-sky-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        )}

        {/* Course grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCourses.map((course) => {
            const isEnrolled = enrolledCourses.includes(course.id);
            
            return (
              <div
                key={course.id}
                onClick={() => onViewCourse(course.id)}
                className="group cursor-pointer bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-video">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      {isLoggedIn || isEnrolled ? (
                        <Play className="w-6 h-6 text-sky-600 ml-1" />
                      ) : (
                        <Lock className="w-5 h-5 text-sky-600" />
                      )}
                    </div>
                  </div>

                  {/* Level badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                  </div>

                  {/* Enrolled badge */}
                  {isEnrolled && (
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Enrolled
                      </span>
                    </div>
                  )}

                  {/* Progress bar for enrolled courses */}
                  {isEnrolled && course.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                      <div 
                        className="h-full bg-sky-500 transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-sky-900 mb-2 group-hover:text-sky-600 transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {course.lessons} lessons
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.duration}
                    </div>
                  </div>

                  {isEnrolled && course.progress > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-medium text-sky-600">{course.progress}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {fullPage && filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No courses found at this level.</p>
          </div>
        )}

        {/* CTA for non-logged in users */}
        {!isLoggedIn && fullPage && (
          <div className="mt-12 bg-gradient-to-r from-sky-500 to-sky-600 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-3">Unlock All Courses</h3>
            <p className="text-sky-100 mb-6 max-w-md mx-auto">
              Sign up for a coaching package to get full access to our entire course library.
            </p>
            <button className="px-8 py-3 bg-white text-sky-600 font-semibold rounded-lg hover:bg-sky-50 transition-colors">
              View Packages
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesSection;
