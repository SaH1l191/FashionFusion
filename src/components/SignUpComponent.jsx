//to do  - check all input fields for performing  validation

import { Link, useNavigate } from "react-router-dom"
import scenario from '../assets/scenario.jpg'
import { Button } from "../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { axiosInstance } from "@/lib/axios"
import toast from "react-hot-toast"

export default function SignUpComponent() {
  const queryClient = useQueryClient()
  const { data: authUser } = useQuery({ queryKey: ["authUser"] })
  const [show, setShow] = useState(false)
  const navigate = useNavigate()
  const [formData,setFormData] = useState({
    name:"",
    username:"",
    email:"",
    password:"",
    otp : ""
  })
  
  const handleSendOtp = (e)=>{
    e.preventDefault()
    sendOtpMutation.mutate(formData)
  }

  const handleOtpChange = (value) => {
    setFormData({ ...formData, otp: value })
  }
  const REGEXP_ALL_CHARS = /^[\s\S]*$/;
 
  const sendOtpMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post('/auth/sendotp', formData)
      console.log('OTP sent response:', response.data)
    },
    onSuccess: () => {
      toast.success('OTP sent successfully!')
      setShow(true)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.')
      console.error('Send OTP error:', error)
    }
  })

  const signUpMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post('/auth/signup', formData)
      console.log('Sign up response:', response.data)
    },
    onSuccess: () => {
      toast.success('Sign up successful!')
      queryClient.invalidateQueries({queryKey:["authUser"]})
      navigate('/login')
      // Redirect or perform any other action after successful sign up
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Sign up failed. Please try again.')
      console.error('Sign up error:', error)
    }
  })

  const handleSignUpSubmit = (e) => {
    e.preventDefault()
    signUpMutation.mutate(formData)
  }

  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">

        <div className="hidden lg:block rounded-3xl">
          <img
            src={scenario}
            alt="Image"
            //   height="250px"
            className="w-full h-full rounded-s-3xl object-fit"
          />
        </div>

        <div className="flex items-center justify-center py-12 bg-gray-50 rounded-e-3xl">


          <Card className="max-w-sm mx-auto border-none shadow-md rounded-3xl">
            <CardHeader>
              <CardTitle className="text-xl text-center">Sign Up</CardTitle>
              <CardDescription className="text-center">
                Enter your information to create an account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4" type='submit' onSubmit={handleSendOtp}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Max" required 
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}/>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" placeholder="Robinson" required 
                    name="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}/>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" placeholder='****' type="password" 
                  name="password"
                  value={formData.password} 
                  onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}/>
                </div>
                <Button type="submit" className="w-full">
                  Send OTP
                </Button>
              </form>
              {
                show && (
                  <form className="grid gap-4 mt-4" type='submit' onSubmit={handleSignUpSubmit}>
                    <div className="grid gap-2">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <InputOTP maxLength={6} pattern={REGEXP_ALL_CHARS}
                      name="otp" 
                      value={formData.otp}
                      onChange={handleOtpChange}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                      <Button type="submit" className="w-full mt-4">
                        Verify OTP and Sign Up
                      </Button>
                    </div>
                  </form>
                )
              }
              <div className="mt-4 text-sm text-center">
                Already have an account?{" "}
                <Link to="/login" className="underline">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
