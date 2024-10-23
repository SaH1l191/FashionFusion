import React from 'react';
import { useNavigate } from 'react-router-dom';
import PricingSection from '../components/PricingSection';
import AccordianC from '@/components/AccordianC';
import question from '../assets/questionmark.png';
import section_3 from '../assets/section_3.png'; // Assuming this is the correct import for the 3D Graphic
import { FaCheckCircle } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const features = [
  { name: "Inventory Management", basic: true, pro: true },
  { name: "Trend News", basic: true, pro: true },
  { name: "Basic Analytics", basic: true, pro: true },
  { name: "Customer Management", basic: true, pro: true },
  { name: "Order Processing", basic: true, pro: true },
  { name: "Demand Forecasting", basic: false, pro: true },
  { name: "Trend Analysis", basic: false, pro: true },
  { name: "Advanced Analytics Dashboard", basic: false, pro: true },
  { name: "Predictive Inventory Optimization", basic: false, pro: true },
  { name: "Customizable AI-driven Insights", basic: false, pro: true },
];

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <div className='mt-32'>
      <section className='flex flex-col w-[1440px] mx-auto gap-y-6'>
        <PricingSection />

        <div className="py-12">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-extrabold text-gray-900">Compare Features</h2>
            <div className="max-w-screen-xl mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-2">
              {[
                { name: "Basic", priceId: "price_1Q5BbkF7SFjppaAMz1fbaTfN" },
                { name: "Pro", priceId: "price_1Q5Bc9F7SFjppaAMQre6SpqQ" }
              ].map((tier) => (
                <div key={tier.name} className="justify-between bg-white shadow-md cursor-pointer rounded-xl">
                  <div className="p-6">
                    <h3 className="text-3xl font-semibold leading-6 text-gray-900">{tier.name}</h3>
                  </div>
                  <div className="px-6 pt-6 pb-8 rounded-lg">
                    <ul className="space-y-4">
                      {features.map((feature) => {
                        const isIncluded = feature[tier.name.toLowerCase()];
                        return (
                          <li key={feature.name} className="flex items-center">
                            {isIncluded ? (
                              <FaCheckCircle className="text-green-500" />
                            ) : (
                              <RxCross2 className="text-red-500" />
                            )}
                            <span className={`ml-3 text-base ${isIncluded ? 'text-gray-700' : 'text-gray-400'}`}>
                              {feature.name}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className='flex flex-col h-3/6 w-[1440px] mx-auto'>
        <div className='flex items-center justify-center'>
          <img src={question} width={200} alt="Pricing" />
        </div>
        <div className='w-4/12 mx-auto'>
          <AccordianC />
        </div>
      </section>
      <section className="bg-[#ededed] py-16 flex justify-center">
        <div className="flex items-center w-full max-w-5xl p-8 bg-white rounded-lg shadow-md">
          <div className="w-full md:w-1/2">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">Get started with FashionFusion today</h2>
            <p className="mb-6 text-lg text-gray-600">Start optimizing your processes today.</p>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-3 font-semibold text-white transition duration-300 bg-blue-600 rounded hover:bg-blue-500"
            >
              Sign up now
            </button>
          </div>
          <div className="flex justify-center w-full mt-8 md:w-1/2 md:mt-0">
            <img
              src={section_3}
              alt="3D Graphic"
              className="w-64 md:w-80"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;