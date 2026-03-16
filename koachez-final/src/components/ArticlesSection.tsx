import React, { useState } from 'react';
import { articles } from '../data/coachData';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';

interface ArticlesSectionProps {
  onReadArticle: (articleId: number) => void;
  onViewAll: () => void;
  fullPage?: boolean;
}

const ArticlesSection: React.FC<ArticlesSectionProps> = ({ onReadArticle, onViewAll, fullPage = false }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', ...Array.from(new Set(articles.map(a => a.category)))];
  
  const filteredArticles = selectedCategory === 'All' 
    ? articles 
    : articles.filter(a => a.category === selectedCategory);

  const displayArticles = fullPage ? filteredArticles : articles.slice(0, 6);
  const featuredArticle = articles.find(a => a.featured);

  return (
    <section className={`${fullPage ? 'min-h-screen py-12' : 'py-20'} bg-white`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <span className="inline-block px-4 py-1 bg-sky-100 text-sky-700 text-sm font-medium rounded-full mb-4">
              Insights & Articles
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-sky-900 mb-2">
              Leadership Insights
            </h2>
            <p className="text-gray-600 max-w-xl">
              Practical wisdom and strategies to elevate your leadership journey.
            </p>
          </div>
          {!fullPage && (
            <button
              onClick={onViewAll}
              className="mt-4 sm:mt-0 text-sky-600 font-medium hover:text-sky-700 transition-colors inline-flex items-center"
            >
              View all articles
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>

        {/* Category filters for full page */}
        {fullPage && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-sky-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Featured article */}
        {featuredArticle && !fullPage && (
          <div 
            onClick={() => onReadArticle(featuredArticle.id)}
            className="mb-12 cursor-pointer group"
          >
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-sky-900 to-sky-700">
              <div className="absolute inset-0">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity"
                />
              </div>
              <div className="relative p-8 sm:p-12 lg:p-16">
                <span className="inline-block px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full mb-4">
                  Featured
                </span>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 max-w-2xl group-hover:text-sky-100 transition-colors">
                  {featuredArticle.title}
                </h3>
                <p className="text-white/80 text-lg mb-6 max-w-xl">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center text-white/70 text-sm">
                  <Clock className="w-4 h-4 mr-2" />
                  {featuredArticle.readTime}
                  <span className="mx-3">•</span>
                  {featuredArticle.date}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Article grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayArticles.filter(a => fullPage || !a.featured).map((article) => (
            <article
              key={article.id}
              onClick={() => onReadArticle(article.id)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-sky-700 text-xs font-medium rounded-full">
                    {article.category}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-sky-900 mb-2 group-hover:text-sky-600 transition-colors line-clamp-2">
                {article.title}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {article.excerpt}
              </p>

              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {article.readTime}
                <span className="mx-2">•</span>
                {article.date}
              </div>
            </article>
          ))}
        </div>

        {fullPage && filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No articles found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ArticlesSection;
