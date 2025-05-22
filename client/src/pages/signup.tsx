import { SignupForm } from '@/components/auth/SignupForm';
import { Container } from '@/components/ui/container';

export default function SignupPage() {
  return (
    <Container className="py-12">
      <div className="max-w-md mx-auto">
        <SignupForm />
      </div>
    </Container>
  );
}