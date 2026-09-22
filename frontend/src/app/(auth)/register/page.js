import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = {
    title: 'Register | Ecommerce',
    description: 'Create a new account',
};

export default function RegisterPage() {
    return (
        <div className="container mx-auto py-12">
            <div className="mx-auto max-w-md">
                <h1 className="mb-6 text-2xl font-bold">Register</h1>
                <RegisterForm />
            </div>
        </div>
    );
}
