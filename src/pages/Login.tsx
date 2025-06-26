import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, Loader2 } from 'lucide-react';

export default function Login() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Show loading spinner while checking authentication state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const success = await login(credentials.username, credentials.password);
      if (!success) {
        setError('Invalid username or password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-4 shadow-lg">
            <Building2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">UserMS</h1>
          <p className="text-muted-foreground">Enterprise User Management System</p>
        </div>

        <Card className="shadow-xl border bg-card">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold text-card-foreground">Welcome Back</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to your account to access the management dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground">Username or Email</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username or email"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="h-11 bg-background text-foreground border-border"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="h-11 bg-background text-foreground border-border"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription className="text-destructive-foreground">{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
              <h4 className="text-sm font-medium text-foreground mb-2">Demo Credentials</h4>
              <div className="text-sm text-muted-foreground">
                <p><strong>Username:</strong> admin@system.com</p>
                <p><strong>Password:</strong> admin123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          © 2024 UserMS Enterprise. All rights reserved.
        </div>
      </div>
    </div>
  );
}