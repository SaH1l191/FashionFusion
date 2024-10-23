import { cn } from "@/lib/utils"
import React from "react"

import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet"
import { Button } from "./ui/button"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { PenLine, DollarSign, BarChart3, Presentation, LogOut, Crown } from "lucide-react"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { axiosInstance } from "@/lib/axios"
import toast from "react-hot-toast"
import PremiumDashboardButton from "./ui/PremiumButton"

export default function Dummynavbar() {
    const navigate = useNavigate()
    const location = useLocation(); // Get the current location

    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const queryClient = useQueryClient();

    const {mutate : logoutMutation} = useMutation({
        mutationFn: async () => {
            await axiosInstance.post('/auth/logout')
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] })
            toast.success('Logged out successfully!')
            navigate('/')
        },
        onError: (error) => {
            toast.error('Logout failed. Please try again.')
            console.error('Logout error:', error)
        }
    })

    const handleLogout = () => {
        logoutMutation()
    }

    const isActive = (path) => location.pathname === path;

   

    return (
        <header className="fixed top-0 z-20 flex items-center w-full h-20 px-4 bg-white shrink-0 md:px-6 border-spacing-0.5">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden">
                        <MenuIcon className="w-6 h-6" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <Link href="#" className="hidden mr-6 lg:flex">
                        <div className="relative">
                            <MountainIcon className="w-6 h-6" />
                            {authUser?.subscription === 'Pro' && (
                                <Crown className="absolute top-0 right-0 w-3 h-3 text-yellow-400 transform translate-x-1/2 -translate-y-1/2" />
                            )}
                        </div>
                        <span className="sr-only">Acme Inc</span>
                    </Link>
                    <div className="grid gap-2 py-6">
                        <Button onClick={() => navigate("/")} variant='secondary' className="flex items-center w-full py-2 text-lg font-semibold">
                            Home
                        </Button>
                        <Button onClick={() => navigate("/about-us")} className="flex items-center w-full py-2 text-lg font-semibold">
                            About Us
                        </Button>
                        <Button onClick={() => navigate("/pricing")} className="flex items-center w-full py-2 text-lg font-semibold" variant='secondary'>
                            Pricing
                        </Button>
                        <Button onClick={() => navigate("/contact-us")} className="flex items-center w-full py-2 text-lg font-semibold">
                            Contact
                        </Button>
                        {!authUser && (
                            <>
                                <Button className='px-4 py-2' onClick={() => navigate("/signup")} variant='secondary'>
                                    Sign Up
                                </Button>
                                <Button className='px-4 py-2' onClick={() => navigate("/login")} variant='secondary'>
                                    Sign In
                                </Button>
                            </>
                        )}
                        {authUser && (
                            <>
                                {authUser?.subscription === 'Pro' ? (
                                    <PremiumDashboardButton onClick={() => navigate("/dashboard/view")}>
                                        Dashboard
                                    </PremiumDashboardButton>
                                ) : (
                                    <Button onClick={() => navigate("/dashboard/view")} className="relative">
                                        Dashboard
                                    </Button>
                                )}
                                <Button onClick={handleLogout} className='px-4 py-2' variant='secondary'>
                                    Logout
                                </Button>
                            </>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            <Link to={"/"} className="hidden mr-6 lg:flex">
                <div className="relative">
                    <MountainIcon className="w-6 h-6" />
                    {authUser?.subscription === 'Pro' && (
                        <Crown className="absolute top-0 right-0 w-3 h-3 text-yellow-400 transform translate-x-1/2 -translate-y-1/2" />
                    )}
                </div>
                <span className="sr-only">Acme Inc</span>
            </Link>
            <nav className="items-center hidden gap-6 cursor-auto ml-28 lg:flex ">
                <Link to={"/"} className={`text-base font-medium hover:text-blue-400 ${isActive('/') ? 'text-blue-600' : ''}`}> Home</Link>
                
                <Link to="/pricing" className={`text-base font-medium hover:text-blue-400 ${isActive('/pricing') ? 'text-blue-600' : ''}`}>Pricing</Link>
                <Link to="/about-us" className={`text-base font-medium hover:text-blue-400 ${isActive('/about-us') ? 'text-blue-600' : ''}`}>About Us</Link>
                <Link to="/contact-us" className={`text-base font-medium hover:text-blue-400 ${isActive('/contact-us') ? 'text-blue-600' : ''}`}>Contact</Link>
            </nav>
            <nav className="hidden gap-4 ml-auto lg:flex">
               {!authUser && (
                   <>
                       <Button className='px-4 py-2 font-semibold text-black bg-gray-50 hover:bg-slate-200' onClick={() => navigate("/login")}>
                           Sign In
                       </Button>
                       <Button className='px-4 py-2' onClick={() => navigate("/signup")}>
                           Sign Up
                       </Button>
                   </>
               )}
               {authUser && (
                   <>
                       {authUser?.subscription === 'Pro' ? (
                           <PremiumDashboardButton onClick={() => navigate("/dashboard/view")}>
                               Dashboard
                           </PremiumDashboardButton>
                       ) : (
                           <Button onClick={() => navigate("/dashboard/view")} className="relative">
                               Dashboard
                           </Button>
                       )}
                       <Button onClick={handleLogout} className='px-4 py-2'>
                           Logout
                       </Button>
                   </>
               )}
            </nav>
        </header>
    )
}

function MenuIcon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    )
}

function MountainIcon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
    )
}

const ListItem = React.forwardRef(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a ref={ref} className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground", className)} {...props}>
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="text-sm leading-snug line-clamp-2 text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
