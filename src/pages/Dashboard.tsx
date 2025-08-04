import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, LogOut } from 'lucide-react';

interface NumberEntry {
  id: string;
  title: string;
  number_value: string;
  description?: string;
  created_at: string;
}

const Dashboard = () => {
  const [numbers, setNumbers] = useState<NumberEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchNumbers();
    }
  }, [user]);

  const fetchNumbers = async () => {
    try {
      const { data, error } = await supabase
        .from('numbers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNumbers(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "שגיאה בטעינת המספרים",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNumber = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const number_value = formData.get('number_value') as string;
    const description = formData.get('description') as string;

    try {
      const { error } = await supabase
        .from('numbers')
        .insert([
          {
            user_id: user?.id,
            title,
            number_value,
            description: description || null,
          },
        ]);

      if (error) throw error;

      toast({
        title: "המספר נשמר בהצלחה!",
        description: `המספר ${title} נוסף לאוסף שלך`,
      });

      setIsDialogOpen(false);
      fetchNumbers();
      e.currentTarget.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "שגיאה בשמירת המספר",
        description: error.message,
      });
    }
  };

  const handleDeleteNumber = async (id: string) => {
    try {
      const { error } = await supabase
        .from('numbers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "המספר נמחק בהצלחה",
        description: "המספר הוסר מהאוסף שלך",
      });

      fetchNumbers();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "שגיאה במחיקת המספר",
        description: error.message,
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "התנתקת בהצלחה",
      description: "תוכל להתחבר שוב בכל עת",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-semibold">טוען...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">המספרים שלי</h1>
            <p className="text-muted-foreground">נהל את אוסף המספרים שלך</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  הוסף מספר
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>הוסף מספר חדש</DialogTitle>
                  <DialogDescription>
                    הוסף מספר חדש לאוסף שלך עם תיאור
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddNumber} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">כותרת</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="למשל: טלפון של דני"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number_value">המספר</Label>
                    <Input
                      id="number_value"
                      name="number_value"
                      placeholder="050-123-4567"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">תיאור (אופציונלי)</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="הוסף פרטים נוספים על המספר..."
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    שמור מספר
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              התנתק
            </Button>
          </div>
        </div>

        {numbers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <h3 className="text-xl font-semibold mb-2">אין מספרים שמורים</h3>
              <p className="text-muted-foreground mb-4">התחל להוסיף מספרים לאוסף שלך</p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    הוסף מספר ראשון
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {numbers.map((number) => (
              <Card key={number.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{number.title}</CardTitle>
                      <CardDescription className="text-xl font-mono">
                        {number.number_value}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNumber(number.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                {number.description && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {number.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;