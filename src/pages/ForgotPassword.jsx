import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { axiosInstance } from "../lib/axios";
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const { mutate: resetPasswordMutation } = useMutation({
    mutationFn: async (email) => {
      const { data } = await axiosInstance.post('/auth/reset-password-token', { email });
      return data; 
    },
    onSuccess: ({ message }) => {
      setIsSubmitted(true);
      toast.success(message);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    resetPasswordMutation(email);
  }

  if (isSubmitted) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Card className="w-[350px] mx-auto mt-16">
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>We've sent a password reset link to your email.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/login')} className="w-full"> 
              Return to login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <Card className="w-[350px] mx-auto mt-16">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>Enter your email to reset your password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid items-center w-full gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            {resetPasswordMutation.isError && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{resetPasswordMutation.error.response?.data?.message || 'An error occurred. Please try again.'}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full mt-4" disabled={resetPasswordMutation.isPending}>
              {resetPasswordMutation.isPending ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full" onClick={() => navigate('/login')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
