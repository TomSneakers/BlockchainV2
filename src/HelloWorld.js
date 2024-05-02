import React, { useState, useEffect } from "react";
import {
  connectWallet,
  helloWorldContract,
  getCurrentWalletConnected,
  sendMessage,
  getSentMessages,
  getReceivedMessages,
  countReceivedMessages // Ajout de cette importation
} from "./util/interact.js";
import alchemylogo from "./alchemylogo.svg";


const HelloWorld = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [status, setStatus] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [sentMessages, setSentMessages] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [receivedMessageCount, setReceivedMessageCount] = useState(0); // Nouvel état pour stocker le nombre de messages reçus
  const [newMessages, setNewMessages] = useState([]); // Déclarer l'état newMessages

  useEffect(() => {
    async function fetchData() {
      const { address, status } = await getCurrentWalletConnected();
      setWalletAddress(address);
      setStatus(status);
      const sent = await getSentMessages();
      setSentMessages(sent);
      const received = await getReceivedMessages();
      setReceivedMessages(received);
      const count = await countReceivedMessages(address); // Appel de la fonction pour compter les messages reçus
      setReceivedMessageCount(count);
    }
    fetchData();

    helloWorldContract.events.MessageSent()
      .on('data', async () => {
        // Met à jour les messages reçus et les nouveaux messages dès qu'un nouveau message est envoyé
        const received = await getReceivedMessages();
        setReceivedMessages(received);
        const count = await countReceivedMessages(walletAddress);
        setReceivedMessageCount(count);

        // Ajouter le dernier message émis à la liste des nouveaux messages
        const latestMessage = received[received.length - 1];
        setNewMessages([latestMessage, ...newMessages]);
      })
      .on('error', (error) => {
        console.error("Error listening to MessageSent event:", error);
      });
  }, []);


  const connectWalletPressed = async () => {
    const { address, status } = await connectWallet();
    setWalletAddress(address);
    setStatus(status);
    const count = await countReceivedMessages(address); // Mettre à jour le nombre de messages reçus après la connexion
    setReceivedMessageCount(count);
  };

  const sendMessagePressed = async () => {
    if (!recipientAddress || !messageContent) {
      setStatus("Recipient address and message content are required.");
      return;
    }
    const { status } = await sendMessage(recipientAddress, messageContent);
    setStatus(status);
    const updatedReceivedMessages = await getReceivedMessages(); // Charger les nouveaux messages reçus après l'envoi
    setReceivedMessages(updatedReceivedMessages); // Mettre à jour les messages reçus
    const count = await countReceivedMessages(walletAddress);
    setReceivedMessageCount(count);
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

      <h2>Received Messages ({receivedMessageCount}):</h2> {/* Affichage du nombre de messages reçus */}
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
      <h2>New Messages with events:</h2>
      <ul>
        {/* Affiche les nouveaux messages */}
        {newMessages.map((message, index) => (
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
