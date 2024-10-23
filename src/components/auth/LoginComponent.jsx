
import { Link, useNavigate } from "react-router-dom" 
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import scenario from '../../assets/scenario.jpg'
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "@/lib/axios"
import toast from "react-hot-toast";




export default function LoginComponent() {


  const navigate = useNavigate()

  const [formData, setFormData] = useState({ 
    username : "",
    password : ""
  })
  const queryClient = useQueryClient()

  const handleSubmit = (e) => {
    e.preventDefault()
    loginMutation(formData) 
  }

  const {mutate: loginMutation , isPending} = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post('/auth/login', formData)
      console.log('response.data = > ',response.data)
    },
    onSuccess:()=>{
      toast.success('Login successful!');
      queryClient.invalidateQueries({queryKey:["authUser"]})
      navigate('/dashboard/view')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
      console.error('Login error:', error);
    }
  })

  





  
  

  return (
    <div className="max-w-[1440px] mx-auto lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12 bg-gray-50 rounded-s-3xl">
        <div className="grid items-center justify-center gap-6 p-8 mx-auto bg-white shadow-md rounded-3xl">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your Username below to login to your account
            </p>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="username"
                placeholder="jonny"
                required
                name="username"
                onChange={(e) => setFormData({ ...formData, username : e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/reset-password-token"
                  className="inline-block ml-auto text-sm underline text-cyan-800"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" 
              type="password" 
              required 
              name="password"
              onChange={(e) => setFormData({ ...formData, password : e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <div className="mt-4 text-sm text-center">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="underline text-cyan-800">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block ">
        <img
          src={scenario}
          alt="Image"
        width={2}
       
          className="h-full w-full object-fit dark:brightness-[0.2] dark:grayscale rounded-e-3xl "
        />
      </div>
    </div>
  )
}