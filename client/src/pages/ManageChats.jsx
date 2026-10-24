import { useEffect, useState } from "react";
import axios from "axios";
// ✅ YAHAN FaComments ADD KAR DIYA HAI
import { FaUserCircle, FaPaperPlane, FaComments } from "react-icons/fa";

function ManageChats() {
  const API_BASE_URL = "http://localhost:5000";
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");

  // Saare active users fetch karo jinhone message kiya hai
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/chat/admin`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(res.data.users);
    } catch (err) {
      console.log(err);
    }
  };

  // Specific user ki chat fetch karo
  const fetchChat = async (userId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/chat/admin/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setChats(res.data.chats);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchChat(selectedUser._id._id); 
      const interval = setInterval(() => fetchChat(selectedUser._id._id), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  const sendReply = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser) return;

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/chat`,
        { message, userId: selectedUser._id._id }, 
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setChats([...chats, res.data.chat]);
      setMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container mt-5 pt-4 mb-5">
      <h3 className="fw-bold text-primary mb-4 border-bottom pb-2">Support Inbox (Chats)</h3>
      
      <div className="row clean-card p-0 overflow-hidden" style={{ minHeight: "500px" }}>
        
        {/* Left Side: Users List */}
        <div className="col-md-4 border-end bg-light p-0" style={{ maxHeight: "500px", overflowY: "auto" }}>
          <div className="p-3 bg-white border-bottom fw-bold text-secondary">Active Chats</div>
          {users.length === 0 && <p className="p-3 text-muted small">No active chats yet.</p>}
          {users.map((u) => (
            <div 
              key={u._id._id} 
              className={`p-3 border-bottom d-flex align-items-center cursor-pointer ${selectedUser?._id._id === u._id._id ? "bg-primary text-white" : "bg-white"}`}
              style={{ cursor: "pointer", transition: "0.2s" }}
              onClick={() => setSelectedUser(u)}
            >
              <FaUserCircle size={35} className={`me-2 ${selectedUser?._id._id === u._id._id ? "text-white" : "text-secondary"}`} />
              <div>
                <h6 className="mb-0 fw-bold">{u._id.name}</h6>
                <small className={selectedUser?._id._id === u._id._id ? "text-white-50" : "text-muted"} style={{ display: "block", width: "180px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {u.lastMessage}
                </small>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Chat Window */}
        <div className="col-md-8 d-flex flex-column p-0" style={{ height: "500px" }}>
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-3 border-bottom bg-white shadow-sm z-1">
                <h6 className="mb-0 fw-bold">{selectedUser._id.name}</h6>
                <small className="text-muted">{selectedUser._id.email}</small>
              </div>

              {/* Chat Messages */}
              <div className="flex-grow-1 p-3" style={{ overflowY: "auto", backgroundColor: "#f8fafc" }}>
                {chats.map((chat) => (
                  <div key={chat._id} className={`d-flex mb-3 ${chat.senderRole !== "citizen" ? "justify-content-end" : "justify-content-start"}`}>
                    <div 
                      className={`p-2 px-3 rounded-3 ${chat.senderRole !== "citizen" ? "bg-primary text-white" : "bg-white border text-dark"}`}
                      style={{ maxWidth: "75%", fontSize: "14px" }}
                    >
                      {chat.message}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-3 bg-white border-top">
                <form onSubmit={sendReply} className="d-flex align-items-center">
                  <input
                    type="text"
                    className="form-control bg-light me-2 py-2"
                    placeholder="Type your reply..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary px-4 py-2 fw-bold">
                    Send <FaPaperPlane className="ms-2" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-100 d-flex flex-column justify-content-center align-items-center text-muted">
              <FaComments size={60} className="mb-3 opacity-50" />
              <h5>Select a user to start chatting</h5>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ManageChats;