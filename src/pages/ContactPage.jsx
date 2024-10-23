import four from '../assets/section_4.png';
import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import toast from "react-hot-toast";
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';

const ContactPage = () => {
  
  const submitContactForm = async (data) => {
    console.log("Logging Data", data);
    contactDataMutation(data);
  };

  const {mutate : contactDataMutation ,isLoading,isError,error} = useMutation({
    mutationFn : async (data) => {
      const response = await axiosInstance.post('/contact', data);
      return response.data;
    },
    onSuccess :()=>{
      toast.success("Message sent successfully");
    },
    onError : (error) => {
      console.log(error.message);
      toast.error("Error sending message");
    }
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <section className="flex flex-col max-w-[1440px] mx-auto mt-32">
      <div className="flex flex-wrap w-11/12 mx-auto mb-20 lg:flex-nowrap mt-14">
        <div className="flex flex-col lg:w-1/2" data-aos="fade-right">
          <img src={four} alt="Section Image" className="object-cover w-full h-full lg:max-h-[600px]" />
        </div>

        <div className="flex flex-col items-center justify-center w-full p-8 mx-auto space-y-6 bg-white shadow-md lg:w-1/2 rounded-xl" data-aos="fade-right">
          <h1 className="text-4xl font-bold text-center">Contact Us</h1>
          <p className="w-full text-lg text-center text-gray-600">
            Explore the future with us. Feel free to get in touch.
          </p>

          <form onSubmit={handleSubmit(submitContactForm)} className="w-full" >
            <div className="flex flex-col gap-7">
              {/* First Name */}
              <div className="flex flex-col gap-2">
                <label htmlFor="firstName" className="font-semibold text-gray-700">
                  First Name
                </label>
                <Input
                  className="placeholder-gray-400 bg-white border-gray-300 rounded-md shadow-sm placeholder:font-semibold"
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter First Name"
                  {...register("name", { required: true  })}
                />
                {errors.name && (
                  <span className="text-xs text-red-500">
                    Please enter your first name
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-semibold text-gray-700">
                  Email Address
                </label>
                <Input
                  className="placeholder-gray-400 bg-white border-gray-300 rounded-md shadow-sm placeholder:font-semibold"
                  type="email"
                  name="email"
                  placeholder="Enter Email Address"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <span className="text-xs text-red-500">
                    Please enter your email address
                  </span>
                )}
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="font-semibold text-gray-700">
                  Message
                </label>
                <Textarea
                  name="message"
                  id="message"
                  cols="30"
                  rows="7"
                  className="placeholder-gray-400 bg-white border-gray-300 rounded-md shadow-sm placeholder:font-semibold"
                  placeholder="Enter Your Message Here"
                  {...register("message", { required: true })}
                />
                {errors.message && (
                  <span className="text-xs text-red-500">
                    Please enter your message
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 font-semibold text-white transition duration-300 bg-blue-500 rounded-md hover:bg-blue-600"
              >{
                "Send Message"
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
