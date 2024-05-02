import React, { useState, useEffect } from "react";
import {
  connectWallet,
  getCurrentWalletConnected,
  sendMessage,
  getSentMessages,
  getReceivedMessages
} from "./util/interact.js";
import alchemylogo from "./alchemylogo.svg";

const HelloWorld = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [status, setStatus] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [sentMessages, setSentMessages] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);

  useEffect(() => {
    async function fetchWallet() {
      const { address, status } = await getCurrentWalletConnected();
      setWalletAddress(address);
      setStatus(status);
      loadMessages();
    }
    fetchWallet();
  }, []);

  const loadMessages = async () => {
    const sent = await getSentMessages();
    setSentMessages(sent);
    const received = await getReceivedMessages();
    setReceivedMessages(received);
  };

  const connectWalletPressed = async () => {
    const { address, status } = await connectWallet();
    setWalletAddress(address);
    setStatus(status);
    loadMessages();
  };

  const sendMessagePressed = async () => {
    if (!recipientAddress || !messageContent) {
      setStatus("Recipient address and message content are required.");
      return;
    }
    const { status: sendStatus } = await sendMessage(recipientAddress, messageContent);
    setStatus(sendStatus);
    loadMessages();
  };

  return (
    <div id="container">
      <img id="logo" src={alchemylogo} alt="Alchemy Logo" />
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <h2>Sent Messages:</h2>
      <ul>
        {sentMessages.map((message, index) => (
          <li key={index}>
            Sender: {message.sender}<br />
            Recipient: {message.recipient}<br />
            Timestamp: {new Date(message.timestamp * 1000).toLocaleString()}<br />
            Content: {message.content}
          </li>
        ))}
      </ul>

      <h2>Received Messages:</h2>
      <ul>
        {receivedMessages.map((message, index) => (
          <li key={index}>
            Sender: {message.sender}<br />
            Recipient: {message.recipient}<br />
            Timestamp: {new Date(message.timestamp * 1000).toLocaleString()}<br />
            Content: {message.content}
          </li>
        ))}
      </ul>

      <h2>New Message:</h2>
      <div>
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Message Content"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
        />
        <p id="status">{status}</p>
        <button onClick={sendMessagePressed}>Send Message</button>
      </div>
    </div>
  );
};

export default HelloWorld;
