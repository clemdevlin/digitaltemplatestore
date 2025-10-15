import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown, ShieldX, Loader } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useEffect, useState } from 'react';

const DownloadPage = () => {
    const { token } = useParams<{ token: string }>();
    const { getTransactionByToken, getSignedUrl } = useAppContext();
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setIsValid(false);
                setLoading(false);
                return;
            }

            const { transaction, product } = await getTransactionByToken(token);

            if (transaction?.verified && product?.file_path) {
                const url = await getSignedUrl(product.file_path);
                if (url) {
                    setDownloadUrl(url);
                    setIsValid(true);
                } else {
                    setIsValid(false);
                }
            } else {
                setIsValid(false);
            }
            setLoading(false);
        };

        validateToken();
    }, [token, getTransactionByToken, getSignedUrl]);

    if (loading) {
        return (
            <div className="container flex items-center justify-center py-24">
                <Loader className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
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
                            <p className="text-muted-foreground">Click the button below to download your file. The link is valid for 60 seconds.</p>
                            <Button asChild size="lg" className="w-full">
                                <a href={downloadUrl} target='_blank' download>
                                    Download File
                                </a>
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-6">
                            <ShieldX className="h-16 w-16 text-destructive" />
                            <p className="text-muted-foreground">This download link is not valid. It may have been used already or expired.</p>
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
