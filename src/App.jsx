import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import './App.css';
import Dummynavbar from './components/Dummynavbar';
import Footer from './components/Footer';
import Loader from './components/Loader';
import { axiosInstance } from './lib/axios';
import toast from 'react-hot-toast';
import styled from "styled-components";
import { useAnimation, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import DemandForcasting from './components/Dashboard/DemandForcasting';

// Lazy-loaded components
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Pricing = lazy(() => import('./pages/Pricing'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const TrendAnalysis = lazy(() => import('./pages/TrendAnalysis'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const UpdatePassword = lazy(() => import('./pages/UpdatePassword'));

// Lazy-loaded dashboard components
const DashboardView = lazy(() => import('./components/Dashboard/DashboardView'));
const Settings = lazy(() => import('./components/Dashboard/Settings'));
const ProductsView = lazy(() => import('./components/Dashboard/ProductsView'));
const SellerView = lazy(() => import('./components/Dashboard/SellerView'));
const TrendNews = lazy(() => import('./components/trendNews/TrendNews'));


const Title = styled.h2`
  font-size: 6rem; /* Increased font size */
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full viewport height */
`;




const Word = styled(motion.span)`
  display: inline-block;
  margin-right: 0.25em;
  white-space: nowrap;
`;

const Character = styled(motion.span)`
  display: inline-block;
  margin-right: -0.05em;
`;

function AnimatedTitle() {
  const text = 'Fashion Fusion';
  
  const ctrls = useAnimation();
  
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });
  
  useEffect(() => {
    if (inView) {
      ctrls.start("visible");
    }
    if (!inView) {
      ctrls.start("hidden");
    }
  }, [ctrls, inView]);
  
  const wordAnimation = {
    hidden: {
      opacity: 0,
      y: `0.25em`,
    },
    visible: {
      opacity: 1,
      y: `0em`,
      transition: {
        duration: 0,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  };
  
  const characterAnimation = {
    hidden: {
      opacity: 0,
      y: `0.25em`,
    },
    visible: {
      opacity: 1,
      y: `0em`,
      transition: {
        duration: 1,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  };

  return (
    <div className='overflow-hidden text-select-none'>
      <Title aria-label={text} role="heading" >
        {text.split(" ").map((word, index) => {
          return (
            <Word
              ref={ref}
              aria-hidden="true"
              key={index}
              initial="hidden"
              animate={ctrls}
              variants={wordAnimation}
              transition={{
                delayChildren: index * 0.25,
                staggerChildren: 0.05,
              }}
            >
              {word.split("").map((character, index) => {
                return (
                  <Character
                    aria-hidden="true"
                    key={index}
                    variants={characterAnimation}
                  >
                    {character}
                  </Character>
                );
              })}
            </Word>
          );
        })}
      </Title>
    </div>
  );
}

// In normal rendering, the entire set of components for a web application is loaded when the page is first accessed.
function AppContent() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/auth/current');
        return res.data;
      } catch (err) {
        console.error('Error fetching auth user:', err);
        return null;
      }
    },
    refetchOnWindowFocus: false,
  });
  console.log(authUser);

  const location = useLocation();

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col min-h-screen font-inter bg-[#ededed]">
      <Dummynavbar className="w-full" />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactPage />} />
          <Route path="/reset-password-token" element={<ForgotPassword />} />
          <Route path="/update-password/:id" element={<UpdatePassword />} />
          <Route path="/dashboard/*" element={!authUser ? <LoginPage /> : <Dashboard />}>
            <Route path="view" element={<DashboardView />} />
            <Route path="products" element={<ProductsView />} />
            <Route path="demand-forcasting" element={<DemandForcasting />} />
            <Route path="maps" element={<SellerView />} />
            <Route path="news" element={<TrendNews />} />
            <Route path="settings" element={<Settings />} />
            <Route path="trend-analysis" element={<TrendAnalysis />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // Show splash screen for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash ? <AnimatedTitle /> : <AppContent />}
    </>
  );
}
