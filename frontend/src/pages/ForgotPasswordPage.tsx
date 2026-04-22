import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Lógica de envio de e-mail será implementada na Phase 2/3
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Recuperar Senha</CardTitle>
          <CardDescription>
            {submitted 
              ? "Se o e-mail existir em nossa base, você receberá instruções em instantes."
              : "Informe seu e-mail para receber as instruções de recuperação."}
          </CardDescription>
        </CardHeader>
        {!submitted && (
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full h-12" type="submit">Enviar Instruções</Button>
              <a href="/login" className="text-sm text-muted-foreground hover:text-primary">Voltar para o login</a>
            </CardFooter>
          </form>
        )}
        {submitted && (
          <CardFooter>
            <Button className="w-full h-12" onClick={() => window.location.href = '/login'}>Voltar para o login</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
