import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown, ShieldX } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useEffect, useState } from 'react';

const DownloadPage = () => {
    const { token } = useParams<{ token: string }>();
    const { transactions, getProductById } = useAppContext();
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [fileUrl, setFileUrl] = useState<string>('');

    useEffect(() => {
        // Simulate token validation
        const tx = transactions.find(t => t.downloadToken === token && t.verified);
        if (tx) {
            const product = getProductById(tx.productId);
            if (product) {
                setIsValid(true);
                setFileUrl(product.fileUrl);
            } else {
                setIsValid(false);
            }
        } else {
            setIsValid(false);
        }
    }, [token, transactions, getProductById]);

    if (isValid === null) {
        return <div>Loading...</div>; // Or a spinner
    }

    return (
        <div className="container flex items-center justify-center py-24">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle>
                        {isValid ? 'Your Download is Ready' : 'Invalid or Expired Link'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isValid ? (
                        <div className="flex flex-col items-center gap-6">
                            <FileDown className="h-16 w-16 text-primary" />
                            <p className="text-muted-foreground">Click the button below to download your file.</p>
                            <Button asChild size="lg" className="w-full">
                                <a href={fileUrl} download target="_blank" rel="noopener noreferrer">
                                    Download File
                                </a>
                            </Button>
                            <p className="text-xs text-muted-foreground">This link is for single use.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-6">
                            <ShieldX className="h-16 w-16 text-destructive" />
                            <p className="text-muted-foreground">This download link is not valid. Please check the link or contact support.</p>
                            <Button asChild variant="outline">
                                <Link to="/">Return to Store</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default DownloadPage;
