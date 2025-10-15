import { useParams, useNavigate } from "react-router-dom";
import { PaystackButton, usePaystackPayment } from "react-paystack";
import { useAppContext } from "@/context/AppContext";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import NotFoundPage from "@/pages/NotFoundPage";
import { cn } from "../lib/utils";

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
    name: "Digital Product",
    phone: "08012345678",
  };

  // const initializePayment = usePaystackPayment(config);

  const onSuccess = async (reference: any) => {
    console.log("✅ CALLBACK TRIGGERED", reference);
    if (product) {
      await createTransaction({
        email: config.email,
        productId: product.id,
        reference: reference.reference,
      });
      navigate(`/success/${reference.reference}`);
    }
  };

  const onClose = () => {
    console.log("Payment closed");
  };

  if (!product) {
    return <NotFoundPage />;
  }

  const componentProps = {
    email: config.email,
    amount: config.amount,
    publicKey: config.publicKey,
    text: "Buy Now",
    currency: "GHS",
    reference: config.reference,
    onSuccess: (reference: any) => {
      console.log("✅ CALLBACK TRIGGERED", reference);
      (async () => {
        try {
          await createTransaction({
            email: config.email,
            productId: product.id,
            reference: reference.reference,
          });

          navigate(`/success/${reference.reference}`);
        } catch (error) {
          console.error("Error saving transaction:", error);
        }
      })();
    },
    close: onClose, // () => alert("Wait! You need this oil, don't go!!!!"),
  };

  // const handleInitializePayment = () => {
  //   try {
  //     if(paystackKey && !paystackKey.includes("YOUR_")) {
  //         initializePayment({onSuccess, onClose, config: paystackKey});
  //     } else {
  //         alert("Paystack public key not configured. Please add it to your .env file.");
  //     }
  //   } catch(error) {
  //     console.log('ERROR INITIALIZING PAYMENT', error)
  //   }
  // }

  return (
    <div className="container py-12">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Store
      </Button>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div>
          <img
            src={
              product.thumbnail_url ||
              "https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400.png"
            }
            alt={product.title}
            className="w-full rounded-lg shadow-lg object-cover aspect-video"
          />
        </div>
        <div className="flex flex-col h-full">
          <div className="flex-grow">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              {product.title}
            </h1>
            <Badge variant="secondary" className="text-lg font-bold mb-6">
              GHC {product.price}
            </Badge>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>
          <div className="mt-8">
            {/* <Button 
              size="lg" 
              className="w-full"
              onClick={handleInitializePayment}
            >
              Buy Now
            </Button> */}
            <PaystackButton
              className={cn(buttonVariants(), "w-full")}
              {...componentProps}
            />
            <p className="text-xs text-muted-foreground text-center mt-2">
              Secure payment with Paystack
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
