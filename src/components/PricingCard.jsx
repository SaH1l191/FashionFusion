import React from 'react'
import { Check } from "lucide-react";

const PricingCard = ({ title, price,type, description, isPopular, features, onSubscribe }) => {
    return (
        <div className="relative flex flex-col justify-between h-full p-6 text-left bg-white border shadow-sm rounded-xl hover:shadow-md">
            {
                isPopular && (
                    <div className="absolute top-0 right-0 px-2 py-1 text-white bg-gray-900 rounded-tr-lg rounded-bl-lg">
                        Popular
                    </div>
                )
            }
            <div>
                <div className="inline-flex items-end">
                    <h1 className="text-3xl font-extrabold">₹{price}</h1>
                </div>
                <h2 className="my-2 text-xl font-bold">
                    {title}{" "} {type}
                </h2>
                <p>{description}</p>
                <div className="flex-grow my-3 border-t border-gray-400 opacity-25"></div>
                <ul>
                    {
                        features.map((feature, index) => (
                            <li key={index} className="flex flex-row items-center gap-2 my-2 text-gray-700">
                                <div className="flex items-center justify-center w-4 h-4 mr-2 bg-gray-900 rounded-full">
                                    <Check className="text-white" width={10} height={10} />
                                </div>
                                <p>{feature}</p>
                            </li>
                        ))
                    }
                </ul>
            </div>
            <div>
                <button 
                    className="w-full py-2 mt-3 text-white transition-colors duration-300 bg-gray-900 rounded-lg hover:bg-gray-800"
                    onClick={onSubscribe}
                >
                    Subscribe Now
                </button>
            </div>
        </div>
    )
}

export default PricingCard