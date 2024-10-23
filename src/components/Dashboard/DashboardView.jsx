import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, ShoppingCart, Package, TrendingUp, BarChart2, List, TrendingDown } from "lucide-react" // Added TrendingDown icon
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { useState } from 'react'

export default function Dashboard() {
  const [graphType, setGraphType] = useState('bar')

  const { data: recentSales, isLoading: salesLoading, error: salesError } = useQuery({
    queryKey: ['recentSales'],
    queryFn: async () => {
      const response = await axiosInstance.get('/transactions')
      return response.data
    }
  })

  const { data: totalProfit, isLoading: profitLoading, error: profitError } = useQuery({
    queryKey: ['totalProfit'],
    queryFn: async () => {
      const response = await axiosInstance.get('/transactions/profit')
      return response.data
    }
  })

  const { data: products, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await axiosInstance.get('/products')
      return response.data
    }
  })

  const { data: monthlyProfit, isLoading: monthlyProfitLoading, error: monthlyProfitError } = useQuery({
    queryKey: ['monthlyProfit'],
    queryFn: async () => {
      const response = await axiosInstance.get('/transactions/monthly-profit')
      return response.data
    }
  })

  const { data: productSummary, isLoading: productSummaryLoading, error: productSummaryError } = useQuery({
    queryKey: ['productSummary'],
    queryFn: async () => {
      const response = await axiosInstance.get('/transactions/product-summary')
      return response.data
    }
  })

  const { data: trendingProduct, isLoading: trendingProductLoading, error: trendingProductError } = useQuery({
    queryKey: ['trendingProduct'],
    queryFn: async () => {
      const response = await axiosInstance.get('/products/trending')
      return response.data
    }
  })
  console.log(trendingProduct)  

  const formatMonthlyData = (data) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, index) => ({
      name: month,
      value: data[index] || 0
    }));
  }

  const renderGraph = () => {
    if (monthlyProfitLoading) {
      return <p>Loading...</p>
    }
    if (monthlyProfitError) {
      return <p>Error loading monthly profit data</p>
    }
    const data = formatMonthlyData(monthlyProfit)
    return (
      <ResponsiveContainer width="100%" height={300}>
        {graphType === 'bar' ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#000000" radius={[5,5,0,0]}/>
          </BarChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#000000" />
          </LineChart>
        )}
      </ResponsiveContainer>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white shadow-md rounded-xl">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <div className="flex flex-col items-start justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p>Get overview of your sales</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
              <DollarSign className="w-4 h-4" />
            </CardHeader>
            <CardContent>
              {profitLoading ? (
                <p>Loading...</p>
              ) : profitError ? (
                <p>Error loading profit</p>
              ) : (
                <div className="text-2xl font-bold">${totalProfit.toFixed(2)}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Top Trending Product Sold this Month</CardTitle>
              <TrendingDown className="w-4 h-4" />
            </CardHeader>
            <CardContent>
              {trendingProductLoading ? (
                <p>Loading...</p>
              ) : trendingProductError ? (
                <p>Error loading trending product</p>
              ) : (
                <div className="text-2xl font-bold">{trendingProduct?.product?.name || 'N/A'}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Monthly Profit</CardTitle>
              <TrendingUp className="w-4 h-4" />
            </CardHeader>
            <CardContent>
              {monthlyProfitLoading ? (
                <p>Loading...</p>
              ) : monthlyProfitError ? (
                <p>Error loading monthly profit</p>
              ) : (
                <div className="text-2xl font-bold">${monthlyProfit[new Date().getMonth()].toFixed(2)}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Recent Sales</CardTitle>
              <ShoppingCart className="w-4 h-4" />
            </CardHeader>
            <CardContent>
              {salesLoading ? (
                <p>Loading...</p>
              ) : salesError ? (
                <p>Error loading sales</p>
              ) : (
                <div className="text-2xl font-bold">{recentSales.length+ " "} sales</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="w-4 h-4" />
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <p>Loading...</p>
              ) : productsError ? (
                <p>Error loading products</p>
              ) : (
                <div className="text-2xl font-bold">{products.length +" "}products</div>
              )}
            </CardContent>
          </Card>
         
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Transaction Types</CardTitle>
              <List className="w-4 h-4" />
            </CardHeader>
            <CardContent>
              {salesLoading ? (
                <p>Loading...</p>
              ) : salesError ? (
                <p>Error loading transactions</p>
              ) : (
                <div className="text-2xl font-bold">
                  {recentSales.filter(sale => sale.transactionType === 'sale').length} sales:
                  {recentSales.filter(sale => sale.transactionType === 'purchase').length} purchases
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Profit Overview</CardTitle>
              <div>
                <button onClick={() => setGraphType('bar')} className={`mr-2 ${graphType === 'bar' ? 'font-bold' : ''}`}>Bar</button>
                <button onClick={() => setGraphType('line')} className={graphType === 'line' ? 'font-bold' : ''}>Line</button>
              </div>
            </CardHeader>
            <CardContent>
              {renderGraph()}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              {salesLoading ? (
                <p>Loading...</p>
              ) : salesError ? (
                <p>Error loading recent sales</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Transaction Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentSales.slice(0, 5).map((sale) => (
                      <TableRow key={sale._id}>
                        <TableCell>{sale?.product?.name}</TableCell>
                        <TableCell>${sale.amount.toFixed(2)}</TableCell>
                        <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                        <TableCell>{sale.transactionType}</TableCell>
                        <TableCell>{sale.transactionType === 'sale' ? 'Sale' : 'Purchase'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
