"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../config";
import { useRouter } from "next/navigation";
import axios from "axios";
import { LandingNavBar } from "@/components/landing-navbar";
import { CheckFeature } from "@/components/checkfeature";
import { motion, stagger } from "framer-motion";

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      staggerChildren: 0.1,
      duration: 0.5
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

interface SigninResponse {
  token: string;
}

export default function SigninPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, []);

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
        username: email,
        password,
      });

      const token = res.data.token;
      
      // Store token consistently
      if (rememberMe) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      // Set global axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex flex-col justify-between">
      <LandingNavBar />
      <div className="flex">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex pt-20 max-w-4xl"
        >
          <div className="flex-1 pt-20 px-4">
            <div className="font-semibold text-3xl pb-4">
              Join millions worldwide who automate their work using Zapier.
            </div>
            <div className="pb-6 pt-4">
              <CheckFeature label={"Easy setup, no coding required"} />
            </div>
            <div className="pb-6">
              <CheckFeature label={"Free forever for core features"} />
            </div>
            <div className="pb-6">
              <CheckFeature label={"14-day trial of premium features & apps"} />
            </div>
          </div>
        </motion.div>
        <div className="ml-20">
          <section>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={formVariants}
              className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
            >
              <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
                Zapier
              </a>
              <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <motion.h1 
                    variants={itemVariants}
                    className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
                  >
                    Sign in to your account
                  </motion.h1>
                  <form className="space-y-4 md:space-y-6" onSubmit={handleSignin}>
                    <motion.div variants={itemVariants}>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="name@gmail.com"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="••••••••"
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="remember"
                              aria-describedby="remember"
                              type="checkbox"
                              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                              onChange={() => setRememberMe(!rememberMe)}
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label className="text-gray-500 dark:text-gray-300">Remember me</label>
                          </div>
                        </div>
                        <a href="/forgotpassword" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
                          Forgot password?
                        </a>
                      </div>
                    </motion.div>
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button className="w-full rounded-full bg-orange-700" type="submit">
                        Sign in
                      </Button>
                    </motion.div>
                    <motion.p 
                      variants={itemVariants}
                      className="text-sm font-light text-gray-500 dark:text-gray-400"
                    >
                      Don’t have an account yet? <a href="/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                    </motion.p>
                  </form>
                </div>
              </div>
            </motion.div>
          </section>
        </div>
      </div>
    </div>
  );
}
