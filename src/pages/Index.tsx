import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuthStore } from "@/hooks/use-auth-store";
import { toast } from "sonner";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock login for now since backend is not yet implemented
    // In a real scenario, this would call the API
    setTimeout(() => {
      if (email === "padilha.ctt@gmail.com" && password === "mp469535") {
        const masterUser = {
          id: "1",
          nome: "Master Admin",
          email: "padilha.ctt@gmail.com",
          role: "master_admin" as const,
          tenant_id: null,
          pode_ver_financeiro: true,
          ativo: true,
          created_at: new Date().toISOString(),
        };
        setUser(masterUser);
        setToken("mock-jwt-token");
        toast.success("Bem-vindo ao Mudali!");
        navigate("/admin");
      } else {
        toast.error("Credenciais inválidas");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md border-purple-100 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-600 p-3 rounded-2xl">
              <span className="text-white text-2xl font-bold">M</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">Mudali</CardTitle>
          <CardDescription>
            Organização familiar inteligente e SaaS multitenant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus-visible:ring-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="focus-visible:ring-purple-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
