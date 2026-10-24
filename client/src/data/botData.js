// ✅ Yahan se aap aaram se naye questions/answers add ya edit kar sakte hain
export const knowledgeBase = [
  {
    keywords: ["track", "status", "progress", "check", "update", "where is my", "kab hoga"],
    answer: "You can track the live status of your complaint by going to the 'My Complaints' page from your dashboard. Admins also leave a remark there once it's resolved."
  },
  {
    keywords: ["time", "long", "days", "resolve", "solution", "when", "fast"],
    answer: "Resolution time depends on the type of issue. Small issues take 1-2 days, while major ones might take longer. You will get an update in your dashboard."
  },
  {
    keywords: ["login", "password", "forgot", "reset", "signin", "email", "account"],
    answer: "If you forgot your password, please note that automated reset is not available yet. Please contact the Admin via this chat and provide your registered email."
  },
  {
    keywords: ["file", "register", "new", "complaint", "submit", "how to", "raise"],
    answer: "To file a new complaint, go to your dashboard and click on 'New Complaint'. Fill in the required details, attach an image, and click submit."
  },
  {
    keywords: ["edit", "change", "modify", "update complaint", "wrong"],
    answer: "You cannot edit a complaint once submitted. If you made a mistake, please contact the Admin via this chat to delete it and file a new one."
  },
  {
    keywords: ["delete", "removed", "disappear", "missing", "gayab"],
    answer: "Complaints are only deleted if they are found to be spam or duplicates. If you think your complaint was deleted by mistake, please contact the Admin."
  },
  {
    keywords: ["safe", "privacy", "data", "secure", "password safe", "leak"],
    answer: "Yes, we take privacy very seriously. Passwords are encrypted, and your personal details are only accessible to authorized admins."
  }
];

export const quickReplies = [
  { question: "How to track my complaint?" },
  { question: "How long does it take to resolve?" },
  { question: "I can't login / Forgot password" }
];