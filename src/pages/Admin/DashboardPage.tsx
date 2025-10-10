import { Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Trash2, Loader } from 'lucide-react';

const AdminDashboardPage = () => {
  const { products, deleteProduct, loading } = useAppContext();

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button asChild>
          <Link to="/admin/upload">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Product
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {loading ? (
            <div className="flex justify-center items-center py-16">
                <Loader className="h-12 w-12 animate-spin text-primary" />
            </div>
        ) : products.length > 0 ? products.map(product => (
          <Card key={product.id} className="flex items-center">
            <CardHeader>
              <img src={product.thumbnail_url || 'https://img-wrapper.vercel.app/image?url=https://placehold.co/96x64.png'} alt={product.title} className="w-24 h-16 object-cover rounded-md" />
            </CardHeader>
            <CardContent className="flex-grow p-4">
              <CardTitle className="text-lg">{product.title}</CardTitle>
            </CardContent>
            <CardFooter className="p-4 flex items-center gap-4">
              <Badge variant="secondary">GHC {product.price}</Badge>
              <Button variant="destructive" size="icon" onClick={() => deleteProduct(product.id)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </CardFooter>
          </Card>
        )) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No products found. Add your first one!</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
