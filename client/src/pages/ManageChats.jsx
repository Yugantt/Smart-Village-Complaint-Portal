import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaUserCircle, FaPaperPlane, FaComments, FaEdit, FaTrash } from "react-icons/fa";
import api from "../api/axios";

function ManageChats() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/chat/admin");
      setUsers(res.data.users);
    } catch (err) { console.log(err); }
  };

  const fetchChat = async (userId) => {
    try {
      const res = await api.get(`/api/chat/admin/${userId}`);
      setChats(res.data.chats);
    } catch (err) { console.log(err); }
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
      const res = await api.post("/api/chat", { message, userId: selectedUser._id._id });
      setChats([...chats, res.data.chat]);
      setMessage("");
    } catch (err) { toast.error("Failed to send message"); }
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

  return (
    <div className="container mt-5 pt-4 mb-5">
      <h3 className="fw-bold text-primary mb-4 border-bottom pb-2">Support Inbox (Chats)</h3>
      
      <div className="row clean-card p-0 overflow-hidden" style={{ minHeight: "500px" }}>
        
        <div className="col-md-4 border-end bg-light p-0" style={{ maxHeight: "500px", overflowY: "auto" }}>
          <div className="p-3 bg-white border-bottom fw-bold text-secondary">Active Chats</div>
          {users.length === 0 && <p className="p-3 text-muted small">No active chats yet.</p>}
          {users.map((u) => (
            <div key={u._id._id} className={`p-3 border-bottom d-flex align-items-center cursor-pointer ${selectedUser?._id._id === u._id._id ? "bg-primary text-white" : "bg-white"}`} style={{ cursor: "pointer", transition: "0.2s" }} onClick={() => setSelectedUser(u)}>
              <FaUserCircle size={35} className={`me-2 ${selectedUser?._id._id === u._id._id ? "text-white" : "text-secondary"}`} />
              <div>
                <h6 className="mb-0 fw-bold">{u._id.name}</h6>
                <small className={selectedUser?._id._id === u._id._id ? "text-white-50" : "text-muted"} style={{ display: "block", width: "180px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.lastMessage}</small>
              </div>
            </div>
          ))}
        </div>

        <div className="col-md-8 d-flex flex-column p-0" style={{ height: "500px" }}>
          {selectedUser ? (
            <>
              <div className="p-3 border-bottom bg-white shadow-sm z-1">
                <h6 className="mb-0 fw-bold">{selectedUser._id.name}</h6>
                <small className="text-muted">{selectedUser._id.email}</small>
              </div>

              <div className="flex-grow-1 p-3" style={{ overflowY: "auto", backgroundColor: "#f8fafc" }}>
                {chats.map((chat) => (
                  <div key={chat._id} className={`d-flex mb-3 ${chat.senderRole !== "citizen" ? "justify-content-end" : "justify-content-start"}`}>
                    <div className="d-flex align-items-center gap-2">
                      {chat.senderRole !== "citizen" && (
                        <div className="d-flex gap-1 text-muted" style={{ opacity: 0.7 }}>
                          <FaEdit role="button" size={14} onClick={() => handleEdit(chat._id, chat.message)} className="text-primary" title="Edit" />
                          <FaTrash role="button" size={14} onClick={() => handleDelete(chat._id)} className="text-danger" title="Delete" />
                        </div>
                      )}
                      <div className={`p-2 px-3 rounded-3 position-relative ${chat.senderRole !== "citizen" ? "bg-primary text-white" : "bg-white border text-dark"}`} style={{ maxWidth: "75%", fontSize: "14px" }}>
                        {chat.message}
                        {chat.isEdited && <span className="ms-2 text-white-50" style={{fontSize: "10px"}}>(edited)</span>}
                      </div>
                      {chat.senderRole === "citizen" && (
                        <div className="d-flex gap-1 text-muted" style={{ opacity: 0.7 }}>
                          <FaEdit role="button" size={14} onClick={() => handleEdit(chat._id, chat.message)} className="text-primary" title="Edit" />
                          <FaTrash role="button" size={14} onClick={() => handleDelete(chat._id)} className="text-danger" title="Delete" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-white border-top">
                <form onSubmit={sendReply} className="d-flex align-items-center">
                  <input type="text" className="form-control bg-light me-2 py-2" placeholder="Type your reply..." value={message} onChange={(e) => setMessage(e.target.value)} />
                  <button type="submit" className="btn btn-primary px-4 py-2 fw-bold">Send <FaPaperPlane className="ms-2" /></button>
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