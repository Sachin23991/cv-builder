"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, PaperAirplaneIcon, SparklesIcon } from "@heroicons/react/24/outline";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are a helpful AI assistant for ResumeMaker - a free, open-source resume builder web application. You help users with:

1. Understanding how to use the resume builder
2. Explaining resume sections (personal info, experience, education, skills, projects, summary)
3. Providing tips on what to write in each section
4. Explaining the HTML configuration feature for customizing resume scaling
5. Answering questions about the parser and ATS compatibility
6. Giving recommendations for improving their resume content

Keep responses helpful, concise, and focused on resume building. If users ask about unrelated topics, gently redirect them to resume-related questions.

The app has these main sections:
- Home page: Landing page with feature overview
- Resume Builder (/resume-builder): Create and edit resumes with live preview
- Resume Parser (/resume-parser): Test existing resumes for ATS readability
- Resume Import (/resume-import): Import existing resumes

Available resume sections: Personal Info, Summary, Experience, Education, Skills, Projects, Publications (academic), Courses (academic).

Always be friendly, professional, and encouraging.`;

// Simple mock responses for demo - in production, this would call the backend AI
const generateResponse = async (messages: Message[]): Promise<string> => {
  const lastUserMessage = messages.filter(m => m.role === "user").pop()?.content.toLowerCase() || "";

  // Simulate typing delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

  // Simple pattern matching for demo
  if (lastUserMessage.includes("experience") || lastUserMessage.includes("work")) {
    return "Great question about work experience! When writing your experience section, focus on:\n\n• **Action verbs**: Use strong verbs like 'Led', 'Developed', 'Implemented', 'Increased'\n• **Quantify results**: Add numbers where possible (e.g., 'Managed a team of 5' or 'Increased sales by 20%')\n• **Relevance**: Focus on experiences most relevant to the job you're applying for\n• **Recent first**: List most recent positions first\n\nWould you like more specific tips for your situation?";
  }

  if (lastUserMessage.includes("skill")) {
    return "For the skills section, I recommend:\n\n• **Relevant skills**: List skills that match the job description\n• **Categorize**: Group similar skills (e.g., Technical, Languages, Soft Skills)\n• **Specificity**: Instead of 'Microsoft Office', say 'Advanced Excel (pivot tables, VLOOKUP)'\n• **Balance**: Include both technical and soft skills\n\nPro tip: The ATS parser works best when you use common industry terms for your skills!";
  }

  if (lastUserMessage.includes("template") || lastUserMessage.includes("theme")) {
    return "ResumeMaker offers multiple theme options! You can:\n\n• **Choose a theme** that matches your industry (Professional for corporate, Creative for design roles)\n• **Use HTML config** to customize scaling and layout\n• **Preview live** as you make changes\n\nThe themes available include: basic, professional, creative, modern, minimal, and more. Each affects the overall visual style while keeping your content the same.";
  }

  if (lastUserMessage.includes("pdf") || lastUserMessage.includes("download")) {
    return "You can download your resume as PDF! Here's how:\n\n1. Go to the Resume Builder\n2. Make your changes with the live preview\n3. Use the download button in the control bar at the bottom\n4. Choose between A4 and Letter size\n\nThe PDF is generated using @react-pdf/renderer, so it's high quality and preserves all formatting!";
  }

  if (lastUserMessage.includes("html") || lastUserMessage.includes("scaling") || lastUserMessage.includes("config")) {
    return "The HTML configuration feature lets you customize how your resume appears and scales! You can:\n\n• **Adjust scaling** for different page sizes\n• **Customize margins and padding**\n• **Set font sizes** for different sections\n• **Configure layout** to fit more or less content\n\nThis is especially useful when you need your resume to fit specific application requirements or when exporting to different formats.";
  }

  if (lastUserMessage.includes("summary") || lastUserMessage.includes("objective")) {
    return "A strong summary can make a big difference! Key tips:\n\n• **Keep it 2-3 sentences**: Be concise\n• **Highlight value**: What makes you unique?\n• **Include goals**: Where do you want to go?\n• **Tailor it**: Match the job description\n\nExample: 'Detail-oriented software engineer with 5+ years of experience in full-stack development. Passionate about building scalable web applications and solving complex problems. Seeking to leverage expertise in a challenging role.'";
  }

  if (lastUserMessage.includes("education")) {
    return "For the education section:\n\n• **Most recent first**: List your highest degree first\n• **Include relevant coursework**: Especially for recent graduates\n• **GPA**: Only if it's impressive (3.5+)\n• **Achievements**: Academic honors, relevant projects\n• **Format**: Degree, Institution, Location, Year\n\nFor experienced professionals, keep education brief. For recent graduates, you can expand on relevant coursework and projects.";
  }

  if (lastUserMessage.includes("parser") || lastUserMessage.includes("ats")) {
    return "The Resume Parser helps you understand how ATS (Applicant Tracking Systems) view your resume:\n\n• **Upload your PDF** to see how well it extracts information\n• **Check completeness**: Ensure all sections are recognized\n• **Fix issues**: Look at the algorithm explanation to understand parsing\n\nTips for ATS-friendly resumes:\n• Use standard section headings\n• Avoid tables and columns\n• Use common fonts\n• Include keywords from the job description";
  }

  if (lastUserMessage.includes("recommend") || lastUserMessage.includes("suggest")) {
    return "Here are my top recommendations for resume success:\n\n1. **Tailor for each job**: Customize your resume to match the job description\n2. **Quantify achievements**: Numbers stand out to both humans and ATS\n3. **Use action verbs**: Led, Built, Designed, Implemented, Improved\n4. **Keep it concise**: 1-2 pages maximum\n5. **Proofread**: Typos can disqualify you immediately\n6. **Use the AI tailor feature**: Let our AI help optimize your resume for specific jobs\n\nStart with the Resume Builder to create or improve your resume!";
  }

  return "Thanks for your question! I'm here to help you build the best resume possible. You can ask me about:\n\n• Resume sections (experience, skills, education, etc.)\n• Using the builder and parser\n• Tips for ATS compatibility\n• The HTML configuration feature\n• General resume advice\n\nWhat would you like to know more about?";
};

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Hi! I'm your AI assistant for ResumeMaker. I can help you with:\n\n• Understanding resume sections\n• Tips for writing content\n• Using the HTML config feature\n• ATS compatibility questions\n\nWhat can I help you with today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await generateResponse([...messages, userMessage]);
      const assistantMessage: Message = { role: "assistant", content: response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating button (glowing indigo orb) */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span
          className="absolute h-16 w-16 rounded-full"
          style={{
            background: "conic-gradient(from 0deg, rgba(139,92,246,0.35), rgba(99,102,241,0.35))",
            filter: "blur(8px)",
            zIndex: -1,
          }}
        />
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] shadow-[0_6px_20px_rgba(139,92,246,0.18)]">
          <SparklesIcon className="h-6 w-6 text-white" />
        </span>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 26 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 28 } }}
            exit={{ opacity: 0, scale: 0.92, y: 26, transition: { duration: 0.15 } }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 flex h-[520px] w-[400px] flex-col rounded-2xl bg-[rgba(17,17,19,0.88)] backdrop-filter backdrop-blur-lg border border-[rgba(255,255,255,0.06)] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] shadow-sm">
                  <SparklesIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI Assistant</h3>
                  <p className="text-xs text-[rgba(255,255,255,0.6)]">ResumeMaker Help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.03)]"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-white"
                        : "bg-[rgba(255,255,255,0.03)] text-[rgba(255,255,255,0.9)]"
                    }`}
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="mb-4 flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl bg-[rgba(255,255,255,0.03)] px-4 py-2.5">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-[rgba(255,255,255,0.6)]" style={{ animationDelay: "0ms" }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-[rgba(255,255,255,0.6)]" style={{ animationDelay: "150ms" }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-[rgba(255,255,255,0.6)]" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-[rgba(255,255,255,0.04)] px-4 py-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about resume building..."
                  className="flex-1 rounded-full border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-4 py-2.5 text-sm text-white outline-none placeholder:text-[rgba(255,255,255,0.5)] focus:border-[rgba(99,102,241,0.6)] focus:ring-2 focus:ring-[rgba(99,102,241,0.12)]"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-white disabled:opacity-50"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}