import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signIn, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('signup-email') as string;
    const password = formData.get('signup-password') as string;

    const { error } = await signUp(email, password);

    if (error) {
      toast({
        variant: "destructive",
        title: "שגיאה ברישום",
        description: error.message,
      });
    } else {
      toast({
        title: "נרשמת בהצלחה!",
        description: "בדוק את האימייל שלך לאימות החשבון",
      });
    }

    setIsLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('signin-email') as string;
    const password = formData.get('signin-password') as string;

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        variant: "destructive",
        title: "שגיאה בהתחברות",
        description: error.message,
      });
    } else {
      toast({
        title: "התחברת בהצלחה!",
        description: "ברוך הבא למערכת המספרים שלך",
      });
      navigate('/');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">ברוך הבא</CardTitle>
          <CardDescription>
            הירשם או התחבר כדי לנהל את המספרים שלך
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">התחברות</TabsTrigger>
              <TabsTrigger value="signup">רישום</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">אימייל</Label>
                  <Input
                    id="signin-email"
                    name="signin-email"
                    type="email"
                    placeholder="הכנס את האימייל שלך"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">סיסמה</Label>
                  <Input
                    id="signin-password"
                    name="signin-password"
                    type="password"
                    placeholder="הכנס את הסיסמה שלך"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "מתחבר..." : "התחבר"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">אימייל</Label>
                  <Input
                    id="signup-email"
                    name="signup-email"
                    type="email"
                    placeholder="הכנס את האימייל שלך"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">סיסמה</Label>
                  <Input
                    id="signup-password"
                    name="signup-password"
                    type="password"
                    placeholder="בחר סיסמה חזקה"
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "נרשם..." : "הירשם"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;