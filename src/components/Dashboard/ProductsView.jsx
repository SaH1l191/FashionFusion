import React, { useState, useEffect } from 'react';
import { PlusIcon, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { axiosInstance } from '@/lib/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'react-hot-toast';
import { Label } from "@/components/ui/label";


const ProductView = () => {
  const [productsData, setProductsData] = useState([]);
  const queryClient = useQueryClient();

  const { data: products, isLoading: isProductsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosInstance.get("/products/");
      console.log(res.data);
      setProductsData(res.data);
      return res.data;
    }
  });

  const { data: suppliers, isLoading: isSuppliersLoading } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/suppliers");
      return res.data;
    }
  });
  console.log(suppliers, "suppliers");

  const { data: transactions, isLoading: isTransactionsLoading, refetch: refetchTransactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await axiosInstance.get("/transactions?sort=-date");
      return res.data;
    }
  });
  console.log(transactions, "transactions");

  const addProductMutation = useMutation({
    mutationFn: async (newProduct) => {
      const res = await axiosInstance.post("/products/", newProduct);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      queryClient.invalidateQueries(["suppliers"]);
      refetchTransactions();
      toast.success("Product added successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error creating product");
    }
  });
  console.log(products, "products");

  const deleteProductMutation = useMutation({
    mutationFn: async (productId) => {
      await axiosInstance.delete(`/products/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      toast.success("Product deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error deleting product");
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ productId, updatedProduct }) => {
      const res = await axiosInstance.put(`/products/${productId}`, updatedProduct);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      toast.success("Product updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error updating product");
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: 0,
    stockQuantity: 0,
    supplier: null,
    transactionType: 'sale',
  });
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5; 

  const [currentTransactionPage, setCurrentTransactionPage] = useState(1);
  const transactionsPerPage = 5;

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic for products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts?.slice(indexOfFirstProduct, indexOfLastProduct);

  // Pagination logic for transactions
  const indexOfLastTransaction = currentTransactionPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions?.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const handleAddProduct = () => {
    addProductMutation.mutate(newProduct);
    setNewProduct({ name: '', category: '', price: 0, stockQuantity: 0, supplier: null, transactionType: 'sale' });
    setIsAddProductOpen(false);
  };

  const handleDeleteProduct = (productId) => {
    deleteProductMutation.mutate(productId);
  };

  const handleUpdateProduct = () => {
    updateProductMutation.mutate({ productId: editingProduct._id, updatedProduct: editingProduct });
    setIsEditProductOpen(false);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredProducts.length / productsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousTransactionPage = () => {
    if (currentTransactionPage > 1) setCurrentTransactionPage(currentTransactionPage - 1);
  };

  const handleNextTransactionPage = () => {
    if (currentTransactionPage < Math.ceil(transactions?.length / transactionsPerPage)) {
      setCurrentTransactionPage(currentTransactionPage + 1);
    }
  };

  // Get unique categories and product names for suggestions
  const categories = [...new Set(products?.map(product => product.category))];
  const productNames = [...new Set(products?.map(product => product.name))];

  const [isNewCategory, setIsNewCategory] = useState(false);

  return (
    <div className="p-8 bg-white shadow-md rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products({products?.length})</h1>
        <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" /> Add New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Product Name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <div className="flex gap-2">
                  <Button 
                    variant={isNewCategory ? "outline" : "default"}
                    onClick={() => setIsNewCategory(false)}
                  >
                    Existing Category
                  </Button>
                  <Button 
                    variant={isNewCategory ? "default" : "outline"}
                    onClick={() => setIsNewCategory(true)}
                  >
                    New Category
                  </Button>
                </div>
                {isNewCategory ? (
                  <Input
                    id="category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    placeholder="New Category"
                  />
                ) : (
                  <Select
                    id="category"
                    value={newProduct.category}
                    onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stockQuantity">Stock Quantity</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  placeholder="Stock Quantity"
                  value={newProduct.stockQuantity}
                  onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: parseInt(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Select
                  id="supplier"
                  onValueChange={(value) => setNewProduct({ ...newProduct, supplier: value, transactionType: value ? newProduct.transactionType : 'sale' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>N/A</SelectItem>
                    {suppliers?.map((supplier) => (
                      <SelectItem key={supplier._id} value={supplier._id}>
                        {supplier?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Tabs 
                defaultValue="sale" 
                onValueChange={(value) => setNewProduct({ ...newProduct, transactionType: value })}
                value={newProduct.transactionType}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="purchase" >Purchase</TabsTrigger>
                  <TabsTrigger value="sale">Sale</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button onClick={handleAddProduct}>Add Product</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Input
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NAME</TableHead>
            <TableHead>CATEGORY</TableHead>
            <TableHead>PRICE</TableHead>
            <TableHead>STOCK</TableHead>
            <TableHead>SUPPLIER</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentProducts?.map((product) => (
            <TableRow key={product._id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell className={product.stockQuantity < 20 ? 'text-red-500' : ''}>
                {product.stockQuantity}
              </TableCell>
              <TableCell>{product.supplier?.name || 'N/A'}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product._id)}>
                  <Trash2 className="w-4 h-4" />
                  <span className="sr-only">Delete</span>
                </Button>
                <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setEditingProduct(product)}>
                      <MoreHorizontal className="w-4 h-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Product</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Input
                        placeholder="Product Name"
                        value={editingProduct?.name || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      />
                      <Input
                        placeholder="Category"
                        value={editingProduct?.category || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      />
                      <Input
                        type="number"
                        placeholder="Price"
                        value={editingProduct?.price || 0}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                      />
                      <Input
                        type="number"
                        placeholder="Stock Quantity"
                        value={editingProduct?.stockQuantity || 0}
                        onChange={(e) => setEditingProduct({ ...editingProduct, stockQuantity: parseInt(e.target.value) })}
                      />
                      <Select
                        onValueChange={(value) => setEditingProduct({ ...editingProduct, supplier: value, transactionType: value ? editingProduct.transactionType : 'sale' })}
                        defaultValue={editingProduct?.supplier?._id}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={null}>N/A</SelectItem>
                          {suppliers?.map((supplier) => (
                            <SelectItem key={supplier._id} value={supplier._id}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Tabs 
                        defaultValue={editingProduct?.transactionType || 'sale'} 
                        onValueChange={(value) => setEditingProduct({ ...editingProduct, transactionType: value })}
                        value={editingProduct?.transactionType}
                      >
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="purchase" disabled={!editingProduct?.supplier}>Purchase</TabsTrigger>
                          <TabsTrigger value="sale">Sale</TabsTrigger>
                        </TabsList>
                      </Tabs>
                      <Button onClick={handleUpdateProduct}>Update Product</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 text-sm text-gray-500">
        {currentProducts?.length} of {filteredProducts?.length} product(s) selected.
      </div>

      {/* Pagination controls for products */}
      <div className="flex items-center justify-between mt-4">
        <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <div>
          Page {currentPage} of {Math.ceil(filteredProducts?.length / productsPerPage)}
        </div>
        <Button onClick={handleNextPage} disabled={currentPage === Math.ceil(filteredProducts?.length / productsPerPage)}>
          Next
        </Button>
      </div>

      {/* Recent Transactions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {isTransactionsLoading ? (
            <div>Loading transactions...</div>
          ) : transactions && transactions.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PRODUCT NAME</TableHead>
                    <TableHead>QUANTITY</TableHead>
                    <TableHead>TRANSACTION TYPE</TableHead>
                    <TableHead>AMOUNT</TableHead>
                    <TableHead>DATE</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentTransactions.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell>{transaction.productName}</TableCell>
                      <TableCell>{transaction.quantity}</TableCell>
                      <TableCell>{transaction.transactionType}</TableCell>
                      <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                      <TableCell>{new Date(transaction.date).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {/* Pagination controls for transactions */}
              <div className="flex items-center justify-between mt-4">
                <Button onClick={handlePreviousTransactionPage} disabled={currentTransactionPage === 1}>
                  Previous
                </Button>
                <div>
                  Page {currentTransactionPage} of {Math.ceil(transactions.length / transactionsPerPage)}
                </div>
                <Button onClick={handleNextTransactionPage} disabled={currentTransactionPage === Math.ceil(transactions.length / transactionsPerPage)}>
                  Next
                </Button>
              </div>
            </>
          ) : (
            <div>No transactions available</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductView;