import { useParams, useNavigate } from 'react-router-dom';
import { usePaystackPayment } from 'react-paystack';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import NotFoundPage from '@/pages/NotFoundPage';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, createTransaction } = useAppContext();
  
  const product = id ? getProductById(id) : undefined;

  const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "";

  const config = {
      reference: new Date().getTime().toString(),
      email: "user@example.com", // In a real app, get this from the user
      amount: product ? product.price * 100 : 0, // Amount in kobo
      publicKey: paystackKey,
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference: any) => {
    if (product) {
      createTransaction({
        email: config.email,
        productId: product.id,
        reference: reference.reference,
      });
      navigate(`/success/${reference.reference}`);
    }
  };

  const onClose = () => {
    console.log('Payment closed');
  };

  if (!product) {
    return <NotFoundPage />;
  }

  return (
    <div className="container py-12">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Store
      </Button>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div>
          <img 
            src={product.thumbnailUrl} 
            alt={product.title}
            className="w-full rounded-lg shadow-lg object-cover aspect-video"
          />
        </div>
        <div className="flex flex-col h-full">
          <div className="flex-grow">
            <h1 className="text-4xl font-bold tracking-tight mb-4">{product.title}</h1>
            <Badge variant="secondary" className="text-lg font-bold mb-6">GHC {product.price}</Badge>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>
          <div className="mt-8">
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => {
                if(paystackKey && paystackKey !== "YOUR_PAYSTACK_PUBLIC_KEY") {
                    initializePayment({onSuccess, onClose});
                } else {
                    alert("Paystack public key not configured. Please add it to your .env file.");
                }
              }}
            >
              Buy Now
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">Secure payment with Paystack</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
