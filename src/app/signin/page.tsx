import { Suspense } from "react";
import Signin from "@/components/Auth/Signin";

export default function SigninPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue" /></div>}>
      <Signin />
    </Suspense>
  );
}

