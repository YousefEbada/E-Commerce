// import { useState} from "react";
// import type {FormEvent} from "react";
// import { useForm } from "react-hook-form";
// import { Link } from "react-router";
// import axios from "axios";

// type FormData = {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
// };

// export default function Register() {
//   const { register } = useForm<FormData>();

//   const [firstName, setfirstName] = useState<String>("");
//   const [lastName, setLastName] = useState<String>("");
//   const [email, setEmail] = useState<String>("");
//   const [birthDate, setBirthDate] = useState<Date>(new Date());
//   const [password, setPassword] = useState<String>("");
//   const [confirmPassword, setConfirmPassword] = useState<String>("");
//   const [isLogin, setIsLogin] = useState<boolean>(true);

//    const handleSubmitForm = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const formData = new FormData(e.currentTarget);
//     const data = Object.fromEntries(formData.entries());
//     console.log(data);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//       <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-[5px]">
//           {isLogin ? "Login" : "Register"}
//         </h2>

//         <form onSubmit={handleSubmitForm} className="space-y-2">
//           {/* First Name (Register only) */}
//           {!isLogin && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 First Name
//               </label>
//               <input
//                 type="text"

//                 className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//                 onChange={(e) => setfirstName(e.target.value)}
//               />
//             </div>
//           )}

//           {/* Last Name (Register only) */}
//           {!isLogin && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Last Name
//               </label>
//               <input
//                 type="text"
//                 className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//                 onChange={(e) => setLastName(e.target.value)}
//               />

//             </div>
//           )}

//           {/* Birth Date (Register only) */}
//           {!isLogin && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Birth Date
//               </label>
//               <input
//                 className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//                 onChange={(e) => setBirthDate(new Date(e.target.value))}
//               />
//             </div>
//           )}

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           {/* Confirm Password (only Register) */}
//           {!isLogin && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Confirm Password
//               </label>
//               <input
//                 type="password"
//                 className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//               />
//             </div>
//           )}

//           {/* Submit */}
//           {isLogin ? (
//             <Link to="/Home">
//               <button
//                 type="submit"
//                 className="w-full py-2 bg-indigo-600 text-white cursor-pointer rounded-xl font-medium hover:bg-indigo-700 transition"
//               >
//                 Login
//               </button>
//             </Link>
//           ) : (
//             <button
//               type="submit"
//               className="w-full py-2 bg-indigo-600 text-white rounded-xl font-medium cursor-pointer hover:bg-indigo-700 transition"
//             >
//               Register
//             </button>
//           )}
//         </form>

//         {/* Switch Mode */}
//         <p className="text-center text-sm text-gray-600 mt-5">
//           {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
//           <button
//             onClick={() => setIsLogin(!isLogin)}
//             className="text-indigo-600 font-semibold hover:underline cursor-pointer"
//           >
//             {isLogin ? "Register" : "Login"}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await axios.post("http://localhost:5000/users/login", {
          email: formData.email,
          password: formData.password,
        });
        
        // Check if email verification is required
        if (res.data.isConfirmed === false) {
          alert("❌ Please verify your email before logging in. Check your inbox for the verification link.");
          setError("Please verify your email before logging in.");
          return;
        }
        
        localStorage.setItem("token", res.data.token);
        setError("");
        alert("✅ تم تسجيل الدخول بنجاح");
        localStorage.setItem("welcomeMessage", res.data.message);
        navigate("/Home");
      } else {
        await axios.post("http://localhost:5000/users/register", formData);
        setError("");
        alert("✅ User Registered Successfully, please check your email to verify your account.");
        setFormData({
          firstName: "",
          lastName: "",
          birthDate: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setIsLogin(true);
      }
    } catch (err: any) {
      console.error("Error:", err);

      if (err.response) {
        if (err.response.status === 409) {
          alert("❌ هذا الإيميل موجود بالفعل، من فضلك سجّل دخول"); // 👈 اضفت alert هنا
          setError("❌ هذا الإيميل موجود بالفعل، من فضلك سجّل دخول");
        } else {
          alert("حدث خطأ ما، حاول مرة أخرى"); // 👈 alert للخطأ العام
          setError("حدث خطأ ما، حاول مرة أخرى");
        }
      } else {
        alert("⚠️ مشكلة في الاتصال بالسيرفر");
        setError("⚠️ مشكلة في الاتصال بالسيرفر");
      }
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-[5px]">
          {isLogin ? "Login" : "Register"}
        </h2>

        <form onSubmit={handleSubmitForm} className="space-y-2">
          {/* First Name (Register only) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                required
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-xl"
              />
            </div>
          )}

          {/* Last Name (Register only) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                required
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-xl"
              />
            </div>
          )}

          {/* Birth Date (Register only) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birth Date
              </label>
              <input
                required
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-xl"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              required
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl"
            />
          </div>

          {/* Confirm Password (only Register) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                required
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-xl"
              />
            </div>
          )}

          {/* Submit */}
          {isLogin ? (
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white rounded-xl font-medium cursor-pointer hover:bg-indigo-500"
            >
              Login
            </button>
          ) : (
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white rounded-xl font-medium cursor-pointer hover:bg-indigo-500"
            >
              Register
            </button>
          )}
        </form>

        {/* Switch Mode */}
        <p className="text-center text-sm text-gray-600 mt-5">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 font-semibold hover:underline cursor-pointer"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
