const alchemyKey = "wss://eth-sepolia.g.alchemy.com/v2/P39DFJvglTWtQLx1_HoXhulMLmsY3RiT";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
const contractABI = require("../contract-abi.json");
const contractAddress = "0xa040B22De966cd8f9B1b102e7f50A410C0D56bA8";

export const helloWorldContract = new web3.eth.Contract(contractABI, contractAddress);

export const loadCurrentMessage = async () => {
    const message = await helloWorldContract.methods.message().call();
    return message;
};
export const countReceivedMessages = async (recipient) => {
    try {
        const count = await helloWorldContract.methods.countReceivedMessages(recipient).call();
        return count;
    } catch (error) {
        console.error("Error counting received messages:", error);
        return 0;
    }
};


export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const obj = {
                status: "👆🏽 Write a message in the text-field above.",
                address: addressArray[0],
            };
            return obj;
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a href={`https://metamask.io/download`}>
                            You must install Metamask, a virtual Ethereum wallet, in your
                            browser.
                        </a>
                    </p>
                </span>
            ),
        };
    }
};

export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_accounts",
            });
            if (addressArray.length > 0) {
                return {
                    address: addressArray[0],
                    status: "👆🏽 Write a message in the text-field above.",
                };
            } else {
                return {
                    address: "",
                    status: "🦊 Connect to Metamask using the top right button.",
                };
            }
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a href={`https://metamask.io/download`}>
                            You must install Metamask, a virtual Ethereum wallet, in your
                            browser.
                        </a>
                    </p>
                </span>
            ),
        };
    }
};

export const sendMessage = async (recipient, content) => {
    try {
        const { address } = await getCurrentWalletConnected();
        const { status } = await helloWorldContract.methods.sendMessage(recipient, content).send({ from: address });
        return { status };
    } catch (error) {
        return {
            status: "😥 " + error.message,
        };
    }
};




export const getSentMessages = async () => {
    try {
        const { address } = await getCurrentWalletConnected();
        const messages = await helloWorldContract.methods.getSentMessages(address).call();
        return messages;
    } catch (error) {
        console.error("Error getting sent messages:", error);
        return [];
    }
};

export const getReceivedMessages = async () => {
    try {
        const { address } = await getCurrentWalletConnected();
        const messages = await helloWorldContract.methods.getReceivedMessages(address).call();
        return messages;
    } catch (error) {
        console.error("Error getting received messages:", error);
        return [];
    }
};


