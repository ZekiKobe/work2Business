import { motion } from "framer-motion";

export default function AuthLayout({
  children
}) {
  return (
    <div
      className="
      min-h-screen
      grid
      lg:grid-cols-2
    "
    >
      <div
        className="
        hidden
        lg:flex
        items-center
        justify-center
        bg-blue-600
      "
      >
        <h1
          className="
          text-5xl
          text-white
          font-bold
        "
        >
          Work2Business
        </h1>
      </div>

      <div
        className="
        flex
        items-center
        justify-center
        p-8
      "
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="w-full max-w-lg"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}