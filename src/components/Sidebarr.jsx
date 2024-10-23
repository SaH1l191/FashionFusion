import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
    ChartBarIcon,
    GlobeAltIcon,
    ShoppingCartIcon,
    BookOpenIcon,
    
} from '@heroicons/react/24/outline';
import { IoIosLogOut } from "react-icons/io";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import toast from 'react-hot-toast';
import { ChartSpline, Newspaper, Package, Settings } from 'lucide-react';

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const navigate = useNavigate()

    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();

    

    const {mutate : logout} = useMutation({
        mutationFn : async ()=>{
            axiosInstance.post('/auth/logout')
        },
        onSuccess : ()=>{
            queryClient.invalidateQueries({queryKey:["authUser"]})
            toast.success('Logged out successfully!')
        }
    })



    const handleLogout = () => {
        // Handle logout logic here (e.g., clearing tokens, redirecting, etc.)
        console.log('Logged out!');
        logout()
        setIsDialogOpen(false);
        navigate('/')
    };

    const toggleCollapse = () => {
        setCollapsed((prev) => !prev);
    };
    

    return (
        <div className={`flex bg-black text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
            <div className="flex flex-col w-full ">
                <div className="flex items-center justify-between p-4">
                    <h1 className={`text-lg font-bold ${collapsed ? 'hidden' : 'block'}`}>Dashboard</h1>
                    <button onClick={toggleCollapse} className="p-1 rounded-md hover:bg-gray-800">
                        {collapsed ? <Bars3Icon className="w-6 h-6 mr-2" /> : <XMarkIcon className="w-6 h-6 mr-2" />}
                    </button>
                </div>
                <nav className="flex-grow">
                    <ul className="space-y-2">
                        <li>
                            <Link to="/dashboard/view" className="flex items-center px-5 py-2 rounded-md hover:bg-gray-800">
                                <HomeIcon className="w-5 h-5" />
                                {!collapsed && <span className="ml-3">View</span>}
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard/products" className="flex items-center px-5 py-2 rounded-md hover:bg-gray-800">
                                <Package className="w-5 h-5" />
                                {!collapsed && <span className="ml-3">Products</span>}
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard/maps" className="flex items-center px-5 py-2 rounded-md hover:bg-gray-800">
                                <GlobeAltIcon className="w-5 h-5" />
                                {!collapsed && <span className="ml-3">Sellers</span>}
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard/news" className="flex items-center px-5 py-2 rounded-md hover:bg-gray-800">
                                <Newspaper className="w-5 h-5" />
                                {!collapsed && <span className="ml-3">News</span>} 
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard/trend-analysis" className="flex items-center px-5 py-2 rounded-md hover:bg-gray-800">
                                <ChartSpline className="w-5 h-5" />
                                {!collapsed && <span className="ml-3">Analysis</span>}
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard/demand-forcasting" className="flex items-center px-5 py-2 rounded-md hover:bg-gray-800">
                                <ChartBarIcon  className="w-5 h-5" />
                                {!collapsed && <span className="ml-3">Demand Forcasting</span>}
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard/settings" className="flex items-center px-5 py-2 rounded-md hover:bg-gray-800">
                                <Settings  className="w-5 h-5" />
                                {!collapsed && <span className="ml-3">Settings</span>}
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="mt-auto mb-4">
                    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <button className="flex items-center w-full px-5 py-2 rounded-md hover:bg-gray-800">
                                <IoIosLogOut className="w-5 h-5" />
                                {!collapsed && <span className="ml-3">Logout</span>}
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to log out? Your unsaved changes will be lost.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
