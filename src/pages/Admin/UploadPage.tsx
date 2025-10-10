import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const AdminUploadPage = () => {
  const navigate = useNavigate();
  const { addProduct } = useAppContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !price) {
        alert("Please fill all fields.");
        return;
    }
    addProduct({
      title,
      description,
      price: parseFloat(price),
      // In a real app, these URLs would come from a file upload service
      thumbnailUrl: `https://picsum.photos/seed/${title}/400/300`,
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    });
    navigate('/admin');
  };

  return (
    <div className="container py-12">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8">
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
                            <Input id="thumbnail" type="file" disabled />
                             <p className="text-xs text-muted-foreground">File uploads are disabled in this demo. A placeholder image will be used.</p>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="file">Product File (ZIP)</Label>
                            <Input id="file" type="file" disabled />
                             <p className="text-xs text-muted-foreground">File uploads are disabled in this demo. A dummy file will be used.</p>
                        </div>
                        <Button type="submit" className="w-full" size="lg">Add Product</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
};

export default AdminUploadPage;
