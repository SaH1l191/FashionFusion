import React, { useState, useEffect } from 'react';
import { PlusIcon, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { axiosInstance } from '@/lib/axios';

const SellerView = () => {
  const [sellers, setSellers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newSeller, setNewSeller] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [isAddSellerOpen, setIsAddSellerOpen] = useState(false);
  const [isEditSellerOpen, setIsEditSellerOpen] = useState(false);
  const [editingSeller, setEditingSeller] = useState(null);

  useEffect(() => { 
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const response = await axiosInstance.get(`/suppliers`);
      setSellers(response.data);
    } catch (error) {
      console.error('Error fetching sellers:', error);
      setSellers([]); 
    }
  };
  console.log(sellers, "sellers");

  const handleAddSeller = async () => {
    try {
      await axiosInstance.post('/suppliers', newSeller);
      setNewSeller({ name: '', phone: '', address: '' });
      setIsAddSellerOpen(false);
      fetchSellers();
    } catch (error) {
      console.error('Error adding seller:', error);
    }
  };

  const handleDeleteSeller = async (id) => {
    try {
      console.log("deleting seller with id => ",id)
      await axiosInstance.delete(`/suppliers/${id}`);
      fetchSellers();
    } catch (error) {
      console.error('Error deleting seller:', error);
    }
  };

  const handleUpdateSeller = async () => {
    try {
      await axiosInstance.put(`/suppliers/${editingSeller._id}`, editingSeller);
      setIsEditSellerOpen(false);
      setEditingSeller(null);
      fetchSellers();
    } catch (error) {
      console.error('Error updating seller:', error);
    }
  };

  const handleEditClick = async (id) => {
    try {
      const response = await axiosInstance.get(`/suppliers/${id}`);
      setEditingSeller(response.data);
      setIsEditSellerOpen(true);
    } catch (error) {
      console.error('Error fetching seller details:', error);
    }
  };

  const filteredSellers = Array.isArray(sellers) ? sellers.filter((seller) =>
    seller.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="p-8 bg-white shadow-md rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sellers ({sellers.length})</h1>
        <Dialog open={isAddSellerOpen} onOpenChange={setIsAddSellerOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" /> Add New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Seller</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Seller Name"
                value={newSeller.name}
                onChange={(e) => setNewSeller({ ...newSeller, name: e.target.value })}
              />
              <Input
                placeholder="Phone"
                value={newSeller.phone}
                onChange={(e) => setNewSeller({ ...newSeller, phone: e.target.value })}
              />
              <Input
                placeholder="Address"
                value={newSeller.address}
                onChange={(e) => setNewSeller({ ...newSeller, address: e.target.value })}
              />
              <Button onClick={handleAddSeller}>Add Seller</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Input
        placeholder="Search sellers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NAME</TableHead>
            <TableHead>PHONE</TableHead>
            <TableHead>ADDRESS</TableHead>
            <TableHead>RELATED PRODUCTS</TableHead>
            <TableHead>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSellers.map((seller) => (
            <TableRow key={seller._id}>
              <TableCell>{seller.name}</TableCell>
              <TableCell>{seller.phone}</TableCell>
              <TableCell>{seller.address}</TableCell>
              <TableCell>
                {seller.productsSupplied && seller.productsSupplied.length > 0
                  ? seller.productsSupplied.length
                  : 'No products'}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => handleEditClick(seller._id)}>
                  <Edit className="w-4 h-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteSeller(seller._id)}>
                  <Trash2 className="w-4 h-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isEditSellerOpen} onOpenChange={setIsEditSellerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Seller</DialogTitle>
          </DialogHeader>
          {editingSeller && (
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Seller Name"
                value={editingSeller.name}
                onChange={(e) => setEditingSeller({ ...editingSeller, name: e.target.value })}
              />
              <Input
                placeholder="Phone"
                value={editingSeller.phone}
                onChange={(e) => setEditingSeller({ ...editingSeller, phone: e.target.value })}
              />
              <Input
                placeholder="Address"
                value={editingSeller.address}
                onChange={(e) => setEditingSeller({ ...editingSeller, address: e.target.value })}
              />
              <Button onClick={handleUpdateSeller}>Update Seller</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellerView;
