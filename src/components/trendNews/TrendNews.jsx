import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Markdown from 'react-markdown';

const TrendNews = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const articlesPerPage = 6;
  const ageRestrictedKeywords = ['explicit', 'mature', 'violence', 'drug', 'alcohol'];

  const { data: user } = useQuery({ queryKey: ["authUser"] });

  const fetchNews = async () => {
    const response = await axios.get(
      'https://newsapi.org/v2/everything?' +
      'q=fashion OR clothing OR apparel OR trends OR style OR runway OR designer&' +
      'domains=vogue.com,fashionista.com,elle.com,wwd.com&' +
      'sortBy=popularity&' +
      'language=en&' +
      'apiKey=' // new api key here
    );

    // Filter articles based on age restriction
    const filteredArticles = response.data.articles.filter(article => {
      return !ageRestrictedKeywords.some(keyword => 
        (article.title && article.title.toLowerCase().includes(keyword)) || 
        (article.description && article.description.toLowerCase().includes(keyword))
      );
    });

    return filteredArticles;
  };
  
  useEffect(() => {
    const getArticles = async () => {
      try {
        const fetchedArticles = await fetchNews();
        setArticles(fetchedArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    getArticles();
  }, []);

  const fetchNewsSummary = async () => {
    setIsLoadingSummary(true);
    try {
      const response = await axios.post('http://localhost:8000/api/news_summary/');
      setSummary(response.data.paraphrased_content);
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const totalArticles = articles.length;
  const totalPages = Math.ceil(totalArticles / articlesPerPage);
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles
    .filter(
      (article) =>
        article.title &&
        article.title !== '[Removed]' &&
        article.description &&
        article.description !== '[Removed]' &&
        article.urlToImage &&
        article.urlToImage !== '[Removed]'
    )
    .slice(indexOfFirstArticle, indexOfLastArticle);

  console.log(currentArticles)
  

  return (
    <div className="container p-4 mx-auto bg-white shadow-md rounded-3xl">
      <h1 className="p-5 mb-4 text-3xl font-bold text-center">Trending Fashion News</h1>
      <button
        onClick={fetchNewsSummary}
        className="px-4 py-2 mb-4 text-white bg-black rounded-xl"
        disabled={isLoadingSummary}
      >
        {isLoadingSummary ? 'Loading Summary...' : 'Get Summary'}
      </button>
      {summary && (
        <div className="p-4 mb-6 bg-gray-100 rounded-lg">
          <h2 className="mb-2 text-xl font-bold">News Summary</h2>
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {currentArticles.map((article, index) => (
          <div
            key={index}
            className="overflow-hidden bg-white rounded-lg shadow-lg"
          >
            {article.urlToImage && (
              <img
                className="object-cover w-full h-48"
                src={article.urlToImage}
                alt={article.title}
              />
            )}
            <div className="p-4">
              <h2 className="mb-2 text-lg font-bold">{article.title}</h2>
              <p className="text-sm text-gray-700">{article.description}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-4 text-blue-500 hover:underline"
              >
                Read more
              </a>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 text-white bg-black rounded-xl disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-white bg-black rounded-xl disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TrendNews;
