import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Crown, UserIcon } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import toast from 'react-hot-toast'

export default function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const queryClient = useQueryClient()

  const { data: authUser, isLoading, isError, error } = useQuery({
    queryKey: ['authUser'],
  });

  useEffect(() => {
    if (authUser) {
      setFormData(prevState => ({
        ...prevState,
        name: authUser.name,
        email: authUser.email
      }))
      setPreviewImage(authUser.profilePicture)
    }
  }, [authUser])

  const updateProfileMutation = useMutation({
    mutationFn: (updatedData) => axiosInstance.post('/auth/updateprofile', updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(['authUser'])
      toast.success('Profile updated successfully')
    },
  })

  const updateProfilePictureMutation = useMutation({
    mutationFn: (file) => {
      const formData = new FormData()
      formData.append('displayPicture', file)
      formData.append('email', authUser.email);
      return axiosInstance.post('/auth/updateprofilepicture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['authUser'])
      toast.success('Profile picture updated successfully')
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: (passwordData) => axiosInstance.post('/auth/changepassword', passwordData),
    onSuccess: () => {
      queryClient.invalidateQueries(['authUser'])
      toast.success('Password updated successfully')
    },
  })

  const handleChangeAvatar = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadAvatar = () => {
    const fileInput = document.getElementById('fileInput')
    if (fileInput.files[0]) {
      updateProfilePictureMutation.mutate(fileInput.files[0])
    }
  }

  const handleUpdateProfile = () => {
    updateProfileMutation.mutate({ name: formData.name, email: authUser.email })
  }

  const handleChangePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match")
      return
    }
    changePasswordMutation.mutate({
      email: authUser.email,
      oldPassword: formData.currentPassword,
      newPassword: formData.newPassword
    })
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error: {error.message}</div>

  return (
    <div className="flex flex-col rounded-xl">
      <h1 className="mb-6 text-3xl font-bold">Settings</h1>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={previewImage} alt="Profile picture" />
                    <AvatarFallback><UserIcon className="w-10 h-10" /></AvatarFallback>
                  </Avatar>
                  {authUser.subscription === 'Pro' && (
                    <Crown className="absolute top-0 left-0 w-6 h-6 text-yellow-400" />
                  )}
                </div>
                <div>
                  <Button 
                    className="mb-2 w-fit" 
                    onClick={() => document.getElementById('fileInput').click()}
                    disabled={updateProfilePictureMutation.isLoading}
                  >
                    Choose File
                  </Button>
                  <Button 
                    className="ml-3 w-fit" 
                    onClick={handleUploadAvatar}
                    disabled={updateProfilePictureMutation.isLoading}
                  >
                    Upload
                  </Button>
                </div>
                <Input
                  id="fileInput"
                  type="file"
                  onChange={handleChangeAvatar}
                  accept="image/*"
                  className="hidden"
                  disabled={updateProfilePictureMutation.isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  disabled={updateProfileMutation.isLoading}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleUpdateProfile}
                disabled={updateProfileMutation.isLoading}
              >
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input 
                  id="currentPassword" 
                  type="password" 
                  onChange={handleInputChange} 
                  disabled={changePasswordMutation.isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword" 
                  type="password" 
                  onChange={handleInputChange} 
                  disabled={changePasswordMutation.isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  onChange={handleInputChange} 
                  disabled={changePasswordMutation.isLoading}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleChangePassword}
                disabled={changePasswordMutation.isLoading}
              >
                Update Security Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
