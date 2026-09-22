import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
    title: 'Login | Ecommerce',
    description: 'Login to your account',
};

export default function LoginPage() {
    return (
        <div className="container mx-auto py-12">
            <div className="mx-auto max-w-md">
                <h1 className="mb-6 text-2xl font-bold">Login</h1>
                <LoginForm />
            </div>
        </div>
    );
}
