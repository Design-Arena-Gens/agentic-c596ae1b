"use client";

import { FormEvent, useMemo, useRef, useState } from "react";

type Author = "user" | "assistant";

interface Message {
  id: string;
  author: Author;
  content: string;
  timestamp: string;
}

const closingLine =
  "धन्यवाद! 🙏 Aapka apna VIKAS CSC – Vikas ke sath aapke vikas ki baat.";

const serviceHighlights = [
  {
    title: "Pension / Life Certificate",
    description: "DLC, Jeevan Pramaan, Sparsh submission aur doorstep seva."
  },
  {
    title: "Samman / Sambhal Card",
    description: "Veterans, senior citizens aur patients ke liye sahayata."
  },
  {
    title: "Banking & Government Services",
    description:
      "Aadhaar, PAN, Passport, PM Yojana, bill payment, recharge sab ek jagah."
  }
];

const normalize = (value: string) => value.trim().toLowerCase();

const detectIntent = (input: string) => {
  const keywords: Record<string, string[]> = {
    pension: ["pension", "life certificate", "dlc", "jeevan pramaan", "sparsh"],
    samman: ["samman", "sambhal"],
    banking: ["bank", "account", "withdraw", "deposit", "bc", "loan"],
    aadhaar: ["aadhaar", "aadhar"],
    pan: ["pan", "p.a.n"],
    passport: ["passport"],
    pmSchemes: [
      "pm",
      "pradhan mantri",
      "yojana",
      "scheme",
      "mudra",
      "kisan"
    ],
    bills: ["bill", "bijli", "electricity", "gas", "water", "recharge"]
  };

  for (const [intent, terms] of Object.entries(keywords)) {
    if (terms.some((term) => input.includes(term))) {
      return intent;
    }
  }

  return "generic";
};

const formatSteps = (steps: string[]) =>
  steps.map((step, index) => `${index + 1}. ${step}`).join("\n");

const generateAssistantReply = (rawInput: string, rawName: string) => {
  const trimmed = rawInput.trim();
  const name = rawName.trim();
  const greeting = name ? `Namaste ${name} ji,` : "Namaste,";

  if (!trimmed) {
    return `${greeting}\nKripya apna prashn likhiye ya batayein ki kis seva ke liye madad chahiye.\n${closingLine}`;
  }

  const intent = detectIntent(normalize(trimmed));
  const baseLines: string[] = [greeting];

  switch (intent) {
    case "pension": {
      baseLines.push(
        "Pension ya Life Certificate process bahut aasaan hai. Aap yeh kadam follow kijiye:",
        formatSteps([
          "Apna Aadhaar, PPO number aur mobile number ready rakhiye.",
          "Hamare VIKAS CSC par aakar biometric verification karaiye ya doorstep seva schedule kijiye.",
          "Verification ke turant baad hum DLC / Sparsh portal par certificate submit kar dete hain.",
          "Aapko acknowledgement slip aur SMS confirmation wahi par mil jaayega."
        ]),
        "Saath hi, agar aap Samman Card ya medical sahayata chahte hain to hum turant arrange kar sakte hain.",
        closingLine
      );
      break;
    }
    case "samman": {
      baseLines.push(
        "Samman / Sambhal Card banwane ke liye yeh saral process follow kijiye:",
        formatSteps([
          "Valid ID proof (Aadhaar / Pan) aur recent photo le aayiye.",
          "Hamare center par application form fill kijiye; hum aapko har column samjha denge.",
          "Document verification ke baad hum card request submit kar dete hain.",
          "Card ready hote hi aapko SMS / call se update mil jaayega, aap pickup ya home delivery choose kar sakte hain."
        ]),
        "Hum senior citizens, veterans aur patients ke liye priority service dete hain. Banking, pension aur bill payment ki madad bhi ek hi visit mein mil jaayegi.",
        closingLine
      );
      break;
    }
    case "banking": {
      baseLines.push(
        "Banking aur financial seva ke liye hamari trained team aapki madad karegi:",
        formatSteps([
          "Aap kaunsa kaam (account opening, withdrawal, mini statement, loan enquiry) chahte hain wo batayein.",
          "Valid ID proof aur passbook/cancelled cheque saath laayein.",
          "Hamare CSC terminal par transaction ko secure tarike se process kiya jaata hai.",
          "Transaction slip aur SMS confirmation turant milti hai. Kisi bhi samay helpdesk se status check kar sakte hain."
        ]),
        "Hum PM Jan Dhan, Pension aur DBT related support bhi dete hain. Zaroorat ho to Aadhaar update aur bill payment bhi turant ho jaata hai.",
        closingLine
      );
      break;
    }
    case "aadhaar": {
      baseLines.push(
        "Aadhaar seva ke liye yeh kadam rakhein:",
        formatSteps([
          "Appointment slot book karna ho to hum phone ya WhatsApp par confirm kar dete hain.",
          "Original Aadhaar, ID proof aur agar correction hai to supporting document saath laayein.",
          "Biometric ya demographic update ko UIDAI portal par turant submit kiya jaata hai.",
          "Update request number (URN) aapko milta hai jisse status track kar sakte hain."
        ]),
        "Iske saath PAN linking, bank seeding aur mobile update bhi hum manage karte hain.",
        closingLine
      );
      break;
    }
    case "pan": {
      baseLines.push(
        "PAN related request ke liye simple process follow hota hai:",
        formatSteps([
          "New PAN ya correction decide kijiye; hum dono forms ke liye guide karte hain.",
          "Aadhaar, photo aur signature sample ready rakhiye.",
          "NSDL / UTI portal par application submit karke acknowledgement print turant milta hai.",
          "Card dispatch status hum aapko SMS / call se update karte rahenge."
        ]),
        "Saath hi, hum Aadhaar-PAN link aur income tax e-filing ke liye bhi sahayata dete hain.",
        closingLine
      );
      break;
    }
    case "passport": {
      baseLines.push(
        "Passport service ke liye hum end-to-end guidance dete hain:",
        formatSteps([
          "Fresh passport ya renewal ke liye required documents list hum turant share kar dete hain.",
          "PSK appointment booking aur form filling hamare counter par hoti hai.",
          "Fee payment aur slot confirmation receipt aapko instant mil jaati hai.",
          "Application status track karne aur police verification tips hum step-by-step batate hain."
        ]),
        "Travel insurance, PAN aur bill payment jaise add-on services bhi available hain.",
        closingLine
      );
      break;
    }
    case "pmSchemes": {
      baseLines.push(
        "Pradhan Mantri yojana ya kisi sarkari scheme ke liye hum practical help dete hain:",
        formatSteps([
          "Aap kis scheme mein interested hain (Mudra, PM Kisan, PMSYM, PMAY, etc.) ye batayein.",
          "Eligibility check aur required documents list hum turant nikal dete hain.",
          "Online registration, document upload aur follow-up submission hamare CSC se hota hai.",
          "Approval ya subsidy status hum regular interval par track karke aapko update dete hain."
        ]),
        "Iske alawa pension, bill payment aur insurance seva bhi ek hi counter par uplabdh hai.",
        closingLine
      );
      break;
    }
    case "bills": {
      baseLines.push(
        "Bill payment aur recharge ke liye aapko bas consumer details deni hoti hai:",
        formatSteps([
          "Service type batayein (bijli, pani, gas, mobile, DTH ya FASTag).",
          "Consumer number ya registered mobile saath laayein.",
          "Payment CSC secure gateway se process hota hai, receipt turant milti hai.",
          "Auto-reminder chahiye to hum WhatsApp / SMS alert set kar dete hain."
        ]),
        "Aap ek hi visit mein Aadhaar update, banking aur pension seva bhi utilize kar sakte hain.",
        closingLine
      );
      break;
    }
    default: {
      baseLines.push(
        "Main aapki madad ke liye tayyar hoon. Kripya batayein ki kis seva ya document ke liye guidance chahiye?",
        closingLine
      );
    }
  }

  return baseLines.join("\n");
};

const makeId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const detectNameFromMessage = (text: string) => {
  const patterns = [
    /(?:my name is|mera naam|meri naam|I am|main)\s+([A-Za-z\s]{2,40})/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim().replace(/\s{2,}/g, " ");
    }
  }

  return "";
};

const MessageContent = ({ content }: { content: string }) => {
  const segments = content.split("\n");
  return (
    <>
      {segments.map((line, index) => (
        <span key={`${index}-${line.slice(0, 10)}`}>
          {line}
          {index < segments.length - 1 ? <br /> : null}
        </span>
      ))}
    </>
  );
};

const formatTime = () =>
  new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  });

const initialMessage: Message = {
  id: makeId(),
  author: "assistant",
  content:
    `Namaste, main VIKAS AI Assistant bol raha hoon. Kripya apna naam aur sawaal batayein, main turant madad karunga.\n` +
    `Aap pension, Samman Card, banking, Aadhaar, PAN, passport, PM yojana, bill payment ya recharge jaise kisi bhi seva ke baare mein pooch sakte hain.\n` +
    closingLine,
  timestamp: formatTime()
};

export default function Home() {
  const [customerName, setCustomerName] = useState("");
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const chatRef = useRef<HTMLDivElement | null>(null);

  const greetingName = useMemo(
    () => (customerName.trim() ? `${customerName.trim()} ji` : "dost"),
    [customerName]
  );

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    const nameFromText = detectNameFromMessage(trimmed);
    if (nameFromText) {
      setCustomerName((prev) => (prev ? prev : nameFromText));
    }

    const userMessage: Message = {
      id: makeId(),
      author: "user",
      content: trimmed,
      timestamp: formatTime()
    };

    const assistantMessage: Message = {
      id: makeId(),
      author: "assistant",
      content: generateAssistantReply(
        trimmed,
        nameFromText || customerName || ""
      ),
      timestamp: formatTime()
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setQuery("");
    scrollToBottom();
  };

  return (
    <main>
      <section className="card">
        <div className="brand-section">
          <span className="badge">VIKAS CSC · Fastrac Digital Service Provider</span>
          <h1>VIKAS AI Assistant – Hamisha Aapke Saath</h1>
          <p>
            Humari priority hai bharosa aur samvedansheel sehmat. Seniors,
            veterans aur patients ke liye hum extra care se kaam karte hain.
            Har digital seva ko simple Hinglish mein samjha kar step-by-step
            poora karte hain.
          </p>
          <div className="divider" />
          <div className="services">
            {serviceHighlights.map((service) => (
              <article className="service-card" key={service.title}>
                <strong>{service.title}</strong>
                <span>{service.description}</span>
              </article>
            ))}
          </div>
        </div>
        <div className="chat-container">
          <div className="chat-scroll" ref={chatRef}>
            {messages.map((message) => (
              <div
                className={`message ${message.author}`}
                key={message.id}
                aria-live="polite"
              >
                <div className="bubble">
                  <MessageContent content={message.content} />
                </div>
                <span className="meta">
                  {message.author === "assistant"
                    ? "VIKAS AI Assistant"
                    : `Aap (${greetingName})`}{" "}
                  · {message.timestamp}
                </span>
              </div>
            ))}
          </div>
          <form className="chat-form" onSubmit={handleSubmit}>
            <label>
              Aapka Naam (optional)
              <input
                type="text"
                placeholder="Jaise: Sunita ji"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
              />
            </label>
            <label>
              Aapka Prashn
              <textarea
                placeholder="Apna sawaal Hinglish mein likhiye..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <button type="submit">Reply bhejein</button>
          </form>
        </div>
      </section>
    </main>
  );
}
