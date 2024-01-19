"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Inputs = {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
};
export default function Login() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    const res: any = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Login successful");
      router.push("/dashboard");
    }

    console.log(res);
  };
  return (
    <main className="w-screen h-screen">
      <div className="w-full h-full flex items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" w-1/4 flex gap-2 flex-col"
        >
          <p>Login</p>
          <Input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: { value: true, message: "Email is required" },
            })}
          />
          <Input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: { value: true, message: "Password is required" },
            })}
          />
          <Button type="submit">Login</Button>
          <p className="text-red-500 text-sm">{errors.password?.message}</p>
          <p className="text-red-500 text-sm">{errors.email?.message}</p>
        </form>
      </div>
    </main>
  );
}
