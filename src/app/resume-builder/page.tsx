"use client";
import { Provider } from "react-redux";
import { store } from "lib/redux/store";
import { ResumeForm } from "components/ResumeForm";
import { Resume } from "components/Resume";
import { motion } from "framer-motion";

export default function Create() {
  return (
    <Provider store={store}>
      <main className="relative h-full w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
        <div className="grid grid-cols-3 md:grid-cols-6">
          {/* Left panel — Form (slides in from left) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-3"
          >
            <ResumeForm />
          </motion.div>
          {/* Right panel — Preview (slides in from right) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="col-span-3"
          >
            <Resume />
          </motion.div>
        </div>
      </main>
    </Provider>
  );
}
