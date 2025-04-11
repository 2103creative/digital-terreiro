
import { Link } from "react-router-dom";
import RegisterForm from "@/components/RegisterForm";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center p-6">
        <RegisterForm />
      </main>
      
      <footer className="py-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>Ylê Axé Xangô & Oxum &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Register;
