import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <Tabs defaultValue="client" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="client">Client Login</TabsTrigger><TabsTrigger value="admin">Admin Login</TabsTrigger></TabsList>
          <TabsContent value="client">
            <Card><CardHeader><CardTitle>Client Login</CardTitle><CardDescription>Access your client dashboard here.</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label htmlFor="client-email">Email</Label><Input id="client-email" type="email" placeholder="client@example.com" /></div>
                <div className="space-y-2"><Label htmlFor="client-password">Password</Label><Input id="client-password" type="password" /></div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Login</Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="admin">
            <Card><CardHeader><CardTitle>Admin Login</CardTitle><CardDescription>Access the admin panel.</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label htmlFor="admin-email">Email</Label><Input id="admin-email" type="email" placeholder="admin@example.com" /></div>
                <div className="space-y-2"><Label htmlFor="admin-password">Password</Label><Input id="admin-password" type="password" /></div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Login</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
} 