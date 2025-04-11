
import { Link } from "react-router-dom";
import LoginForm from "@/components/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 px-6 border-b">
        <div className="container mx-auto">
          <Link to="/" className="text-2xl font-bold">
            Ylê Axé Xangô & Oxum
          </Link>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6">
        <LoginForm />
      </main>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>Ylê Axé Xangô & Oxum &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
