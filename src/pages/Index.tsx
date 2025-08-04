import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Hash, Lock, Shield } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-semibold">טוען...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <Hash className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              המאגר שלי למספרים
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              שמור וארגן את כל המספרים החשובים שלך במקום אחד מאובטח
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <Card>
              <CardHeader>
                <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
                <CardTitle>מאובטח</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  המספרים שלך מוצפנים ומאובטחים בענן
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Hash className="w-8 h-8 mx-auto mb-2 text-primary" />
                <CardTitle>מאורגן</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  ארגן את המספרים שלך עם כותרות ותיאורים
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Lock className="w-8 h-8 mx-auto mb-2 text-primary" />
                <CardTitle>פרטי</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  רק אתה יכול לגשת למספרים שלך
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto"
            >
              התחל עכשיו
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto"
            >
              יש לי חשבון
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
