import Sidebarr from '@/components/Sidebarr'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const Dashboard = () => {



  return (
    <div className='flex w-full min-h-screen mt-20'>
      <Sidebarr/>

      <div className="flex-1 overflow-auto ">
        <div className="w-11/12 py-10 mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard

