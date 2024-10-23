import React from 'react';
import { MarqueeDemo } from './MarqueeDemo';

const testimonials = [
  {
    quote: "Since implementing Lando, our business has seen significant growth.",
    name: "Jack Sibire",
    title: "Lead Manager, Growin",
    rating: 5,
  },
  {
    quote: "I can't imagine running our company without it.",
    name: "Adele Mouse",
    title: "Product Manager, Mousin",
    rating: 5,
  },
  {
    quote: "I highly recommend Lando to any business looking for improvement.",
    name: "Ben Clock",
    title: "CTO, Clockwork",
    rating: 5,
  },
];
//acutal data needs to be fetched from api 
const Testimonials = () => {
  return (
    <MarqueeDemo/>
  );
};

export default Testimonials;
