import ProductCard from '@/components/ProductCard';
import { useAppContext } from '@/context/AppContext';
import { Loader } from 'lucide-react';

const HomePage = () => {
  const { products, loading } = useAppContext();

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Digital Marketplace</h1>
        <p className="mt-4 text-lg text-muted-foreground">High-quality templates, ready for your next project.</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-16">
            <Loader className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <p className="text-muted-foreground">No products available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
