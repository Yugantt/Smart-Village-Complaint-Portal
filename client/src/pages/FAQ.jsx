import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { FaQuestionCircle, FaSearch, FaComments, FaPaperPlane, FaRobot, FaUser, FaEdit, FaTrash } from "react-icons/fa";
import api from "../api/axios";
import { knowledgeBase, quickReplies } from "../data/botData";

function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [chats, setChats] = useState([]);
  const [botChats, setBotChats] = useState([]);
  const [message, setMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [user, setUser] = useState(null);
  
  const chatContainerRef = useRef(null);
  const sessionStartTime = useRef(new Date().toISOString());

  useEffect(() => {
    document.title = "FAQs & Support - Smart Village";
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) setUser(JSON.parse(loggedInUser));
  }, []);

  useEffect(() => {
    let interval = null;
    const fetchChatData = async () => {
      try {
        const res = await api.get("/api/chat/my");
        const newMessages = res.data.chats.filter(chat => new Date(chat.createdAt) >= new Date(sessionStartTime.current));
        setChats(newMessages);
      } catch (err) { console.log("Error fetching chats", err); }
    };

    if (user && user.role === "citizen") {
      fetchChatData();
      interval = setInterval(fetchChatData, 5000); 
    }
    return () => { if (interval) clearInterval(interval); };
  }, [user]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chats, botChats]);

  const getBotAnswer = (userText) => {
    const text = userText.toLowerCase();
    for (let item of knowledgeBase) {
      if (item.keywords.some(keyword => text.includes(keyword))) return item.answer;
    }
    return null; 
  };

  const handleQuickReply = (reply) => {
    const time = new Date().toISOString();
    const userMsg = { _id: Date.now() + "u", senderRole: "citizen", message: reply.question, createdAt: time };
    const botMsg = { _id: Date.now() + "b", senderRole: "bot", message: getBotAnswer(reply.question), createdAt: time };
    setBotChats((prev) => [...prev, userMsg, botMsg]); 
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsgText = message;
    setMessage(""); 
    const time = new Date().toISOString();
    const botAnswerText = getBotAnswer(userMsgText);

    if (botAnswerText) {
      setBotChats((prev) => [
        ...prev, 
        { _id: Date.now() + "u", senderRole: "citizen", message: userMsgText, createdAt: time },
        { _id: Date.now() + "b", senderRole: "bot", message: botAnswerText, createdAt: time }
      ]);
      return;
    }

    setChatLoading(true);
    const tempUserMsg = { _id: Date.now(), senderRole: "citizen", message: userMsgText, createdAt: time };
    setChats((prev) => [...prev, tempUserMsg]);

    try {
      const res = await api.post("/api/chat", { message: userMsgText });
      setChats((prev) => prev.map(msg => msg._id === tempUserMsg._id ? res.data.chat : msg));
    } catch (err) {
      toast.error("Failed to send message to Admin.");
      setChats((prev) => prev.filter(msg => msg._id !== tempUserMsg._id));
    } finally {
      setChatLoading(false);
    }
  };

  const handleEdit = async (id, oldMessage) => {
    const newMessage = window.prompt("Edit message:", oldMessage);
    if (newMessage && newMessage.trim() !== "" && newMessage !== oldMessage) {
      try {
        const res = await api.put(`/api/chat/${id}`, { message: newMessage });
        setChats(chats.map(c => c._id === id ? res.data.chat : c));
        toast.success("Message updated");
      } catch (err) { toast.error("Failed to edit"); }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.delete(`/api/chat/${id}`);
      setChats(chats.filter(c => c._id !== id));
      toast.success("Message deleted");
    } catch (err) { toast.error("Failed to delete"); }
  };

  const faqs = [
    { q: "How do I file a complaint?", a: "You need to register/login, then click on 'New Complaint'. Fill in the details, attach an image, and pin your location." },
    { q: "How long does it take to resolve a complaint?", a: "The resolution time depends on the type of issue. You can track the status (Pending, In Progress, Resolved) in your dashboard." },
    { q: "Can I edit my complaint after submitting?", a: "No, you cannot edit the complaint once submitted. If you need to add more details, please wait for the Admin's remark or contact support." },
    { q: "What should I do if my complaint is deleted?", a: "Complaints are usually deleted if they are spam or duplicates. You can contact support for more information." },
    { q: "Is my personal data safe?", a: "Yes, we take privacy very seriously. Passwords are encrypted, and your personal details are only accessible to authorized admins." }
  ];

  const filteredFaqs = faqs.filter(faq => faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || faq.a.toLowerCase().includes(searchTerm.toLowerCase()));
  const allMessages = [...chats, ...botChats].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <div className="container mt-5 pt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-7 mb-4">
          <div className="text-center mb-4">
            <FaQuestionCircle size={45} className="text-primary mb-2" />
            <h2 className="fw-bold text-dark">Frequently Asked Questions</h2>
          </div>

          <div className="input-group mb-4 shadow-sm" style={{ borderRadius: "10px" }}>
            <span className="input-group-text bg-white border-end-0"><FaSearch className="text-muted" /></span>
            <input type="text" className="form-control border-start-0 py-3" placeholder="Search for a question..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          <div className="accordion shadow-sm" id="faqAccordion">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div className="accordion-item" key={index}>
                  <h2 className="accordion-header">
                    <button className={`accordion-button ${index !== 0 ? 'collapsed' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`}>
                      <span className="fw-bold text-dark">{faq.q}</span>
                    </button>
                  </h2>
                  <div id={`collapse${index}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} data-bs-parent="#faqAccordion">
                    <div className="accordion-body text-muted">{faq.a}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 bg-white rounded shadow-sm">
                <p className="text-muted mb-0">No FAQs found for "{searchTerm}".</p>
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-5">
          <div className="clean-card p-0 shadow-sm border-0" style={{ height: "600px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div className="bg-primary text-white p-3 rounded-top">
              <h5 className="mb-0 fw-bold d-flex align-items-center"><FaComments className="me-2" /> Live Support Chat</h5>
              <small className="text-white-50">Bot will answer common queries instantly</small>
            </div>

            {!user ? (
              <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-muted p-4 text-center">
                <FaComments size={50} className="mb-3 opacity-25" />
                <h6>Please Login to start a chat</h6>
              </div>
            ) : user.role !== "citizen" ? (
              <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-muted p-4 text-center">
                <FaComments size={50} className="mb-3 opacity-25" />
                <h6>You are an Admin</h6>
                <p className="small mb-0">Please go to the Admin Dashboard to reply to users.</p>
              </div>
            ) : (
              <>
                <div className="flex-grow-1 p-3" style={{ overflowY: "auto", backgroundColor: "#f8fafc" }} ref={chatContainerRef}>
                  {allMessages.length === 0 && <p className="text-muted text-center mt-3 small">Hello {user.name}! How can we help you today?</p>}
                  {allMessages.map((chat) => {
                    const isCitizen = chat.senderRole === "citizen";
                    const isBot = chat.senderRole === "bot";
                    return (
                      <div key={chat._id} className={`d-flex mb-3 ${isCitizen ? "justify-content-end" : "justify-content-start"}`}>
                        {!isCitizen && (
                          <div className="me-2 mt-1">
                            {isBot ? <FaRobot size={20} className="text-primary" /> : <FaUser size={20} className="text-success" />}
                          </div>
                        )}
                        
                        <div className="d-flex align-items-center gap-2">
                          {isCitizen && !String(chat._id).includes("u") && (
                            <div className="d-flex gap-1 text-muted" style={{ opacity: 0.7 }}>
                              <FaEdit role="button" size={14} onClick={() => handleEdit(chat._id, chat.message)} className="text-primary" title="Edit" />
                              <FaTrash role="button" size={14} onClick={() => handleDelete(chat._id)} className="text-danger" title="Delete" />
                            </div>
                          )}
                          
                          <div className={`p-2 px-3 rounded-3 ${isCitizen ? "bg-primary text-white" : isBot ? "bg-white border border-primary text-dark" : "bg-white border text-dark"}`} style={{ maxWidth: "80%", fontSize: "14px" }}>
                            {isBot && <span className="badge bg-primary mb-1">Auto-Bot</span>}
                            {chat.message}
                            {chat.isEdited && <span className="ms-2 text-white-50" style={{fontSize: "10px"}}>(edited)</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="px-3 pb-2 bg-white border-top">
                  <small className="text-muted d-block mt-2 mb-1">Quick Questions:</small>
                  <div className="d-flex flex-wrap gap-1">
                    {quickReplies.map((reply, idx) => (
                      <button key={idx} className="btn btn-sm btn-outline-primary rounded-pill" style={{ fontSize: "12px" }} onClick={() => handleQuickReply(reply)}>
                        {reply.question}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-white border-top rounded-bottom">
                  <form onSubmit={sendMessage} className="d-flex align-items-center">
                    <input type="text" className="form-control border-0 bg-light me-2 py-2" placeholder="Type an issue for Admin..." value={message} onChange={(e) => setMessage(e.target.value)} disabled={chatLoading} />
                    <button type="submit" className="btn btn-primary rounded-circle p-2" style={{ width: "40px", height: "40px" }} disabled={chatLoading}><FaPaperPlane size={16} /></button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQ;