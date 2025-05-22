import { LoginForm } from '@/components/auth/LoginForm';
import { Container } from '@/components/ui/container';

export default function LoginPage() {
  return (
    <Container className="py-12">
      <div className="max-w-md mx-auto">
        <LoginForm />
      </div>
    </Container>
  );
}