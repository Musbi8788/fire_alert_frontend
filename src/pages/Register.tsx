import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button, Input, Card } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import { registerUser } from "@workspace/api-client-react";
import { ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(5, "Valid phone number is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsSubmitting(true);
    try {
      const response = await registerUser(data);
      login(response.user, response.token);
      toast({
        title: "Account Created",
        description: "You can now submit emergency reports.",
      });
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
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
            <ShieldAlert className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold">Create Account</h1>
          <p className="text-muted-foreground mt-2">Register to report emergencies faster</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input 
            label="Full Name" 
            placeholder="John Doe" 
            {...register("fullName")} 
            error={errors.fullName?.message}
          />
          <Input 
            label="Phone Number" 
            type="tel"
            placeholder="+220 XXXXXXX" 
            {...register("phone")} 
            error={errors.phone?.message}
          />
          <Input 
            label="Username" 
            placeholder="Choose a unique username" 
            {...register("username")} 
            error={errors.username?.message}
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="Min. 6 characters" 
            {...register("password")} 
            error={errors.password?.message}
          />
          
          <Button type="submit" className="w-full mt-4" size="lg" isLoading={isSubmitting}>
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}
