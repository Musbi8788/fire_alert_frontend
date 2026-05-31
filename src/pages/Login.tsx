import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button, Input, Card } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import { loginUser } from "@workspace/api-client-react";
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    try {
      const response = await loginUser(data);
      login(response.user, response.token);
      toast({
        title: "Welcome back",
        description: "You have successfully logged in.",
      });
      setLocation(response.user.isAdmin ? "/admin" : "/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 py-12 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-primary/10 to-transparent -z-10" />
      
      <Card className="w-full max-w-md p-8 shadow-xl border-t-4 border-t-primary relative bg-background/80 backdrop-blur-xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-primary/10 p-3 rounded-full mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your FireAlertGM account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input 
            label="Username" 
            placeholder="Enter your username" 
            {...register("username")} 
            error={errors.username?.message}
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="Enter your password" 
            {...register("password")} 
            error={errors.password?.message}
          />
          
          <Button type="submit" className="w-full mt-2" size="lg" isLoading={isSubmitting}>
            Sign In
          </Button>
        </form>

        <div className="mt-5 grid gap-3 text-sm">
          <div className="rounded-xl border border-border bg-muted/40 px-4 py-3">
            <p className="font-semibold text-foreground">Admin demo login</p>
            <p className="mt-1 text-muted-foreground">
              Username: <span className="font-medium text-foreground">admin</span>
              {" "}Password: <span className="font-medium text-foreground">admin123</span>
            </p>
          </div>
          <div className="rounded-xl border border-border bg-muted/40 px-4 py-3">
            <p className="font-semibold text-foreground">User demo login</p>
            <p className="mt-1 text-muted-foreground">
              Username: <span className="font-medium text-foreground">user</span>
              {" "}Password: <span className="font-medium text-foreground">user123</span>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </Card>
    </div>
  );
}
