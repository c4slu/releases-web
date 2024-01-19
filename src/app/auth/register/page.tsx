"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Inputs = {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
};

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (data.password !== data.confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password,
      }),
    })
      .then((response) => response.json())
      .then((request) => {
        console.log("Resposta da API:", request);
        // If error api
        if (request.error) {
          return toast.error(request.error);
        }
        if (request.message == "UserName already exists") {
          return toast.error("UserName already exists");
        }
        if (request.message == "Email already exists") {
          return toast.error("Email already exists");
        }
        if (request.message == "Sucess...") {
          toast.success("Signed successfully");

          return router.push("/auth/login");
        }
      })
      .catch((error) => {
        console.error("Erro ao enviar a requisição:", error);
      });
  };

  return (
    <main className="w-screen h-screen">
      <div className="w-full h-full flex items-center justify-center">
        <form
          className=" w-1/4 flex gap-2 flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <p>Register</p>
          <Input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: { value: true, message: "Email is required" },
            })}
          />
          <Input
            type="text"
            placeholder="Username"
            {...register("username", {
              required: { value: true, message: "Username is required" },
            })}
          />
          <Input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: { value: true, message: "Password is required" },
            })}
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword", {
              required: {
                value: true,
                message: "Confirm Password is required",
              },
            })}
          />
          <Button type="submit">Sing-Up</Button>
          <p className="text-red-500 text-sm">{errors.username?.message}</p>
          <p className="text-red-500 text-sm">{errors.email?.message}</p>
          <p className="text-red-500 text-sm">{errors.password?.message}</p>
          <p className="text-red-500 text-sm">
            {errors.confirmPassword?.message}
          </p>
        </form>
      </div>
    </main>
  );
}
