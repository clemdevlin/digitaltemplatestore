import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, Loader } from 'lucide-react';
import { Transaction } from '@/types';

const SuccessPage = () => {
  const { reference } = useParams<{ reference: string }>();
  const { verifyTransaction } = useAppContext();
  const [transaction, setTransaction] = useState<Transaction | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reference) {
      // Simulate backend verification
      setTimeout(() => {
        const verifiedTx = verifyTransaction(reference);
        setTransaction(verifiedTx);
        setLoading(false);
      }, 1500);
    }
  }, [reference, verifyTransaction]);

  return (
    <div className="container flex items-center justify-center py-24">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">
            {loading ? 'Verifying Payment...' : 'Payment Successful!'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex flex-col items-center gap-4">
              <Loader className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Please wait while we confirm your transaction.</p>
            </div>
          )}
          {!loading && transaction?.verified && (
            <div className="flex flex-col items-center gap-6">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="text-muted-foreground">Your template is ready for download.</p>
              <Button asChild size="lg" className="w-full">
                <Link to={`/download/${transaction.downloadToken}`}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Now
                </Link>
              </Button>
            </div>
          )}
          {!loading && !transaction?.verified && (
             <div className="flex flex-col items-center gap-4">
                <p className="text-destructive">Could not verify your payment.</p>
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

export default SuccessPage;
