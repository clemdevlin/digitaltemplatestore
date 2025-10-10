import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
    >
        <Link to={`/product/${product.id}`}>
            <Card className="overflow-hidden h-full flex flex-col">
                <CardHeader className="p-0">
                    <img 
                        src={product.thumbnailUrl} 
                        alt={product.title} 
                        className="object-cover w-full h-48"
                    />
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                    <CardTitle className="text-lg font-semibold mb-2 truncate">{product.title}</CardTitle>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                    <Badge variant="secondary" className="text-md font-bold">GHC {product.price}</Badge>
                </CardFooter>
            </Card>
        </Link>
    </motion.div>
  );
};

export default ProductCard;
