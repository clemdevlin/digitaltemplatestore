import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader } from 'lucide-react';
import { NewProduct } from '@/types';

const AdminUploadPage = () => {
  const navigate = useNavigate();
  const { addProduct } = useAppContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !price || !thumbnailFile || !productFile) {
        alert("Please fill all fields and select both files.");
        return;
    }
    
    setIsUploading(true);
    try {
        const newProduct: NewProduct = {
            title,
            description,
            price: parseFloat(price),
            thumbnailFile,
            productFile,
        };
        await addProduct(newProduct);
        navigate('/admin');
    } catch (error) {
        console.error(error);
        alert(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <div className="container py-12">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8" disabled={isUploading}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
        </Button>
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Add a New Product</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <fieldset disabled={isUploading} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Product Title</Label>
                                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (GHC)</Label>
                                <Input id="price" type="number" value={price} onChange={e => setPrice(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="thumbnail">Thumbnail Image</Label>
                                <Input id="thumbnail" type="file" accept="image/*" onChange={e => setThumbnailFile(e.target.files ? e.target.files[0] : null)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="file">Product File (ZIP)</Label>
                                <Input id="file" type="file" accept=".zip" onChange={e => setProductFile(e.target.files ? e.target.files[0] : null)} required />
                            </div>
                        </fieldset>
                        <Button type="submit" className="w-full" size="lg" disabled={isUploading}>
                            {isUploading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                            {isUploading ? 'Uploading...' : 'Add Product'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
};

export default AdminUploadPage;
