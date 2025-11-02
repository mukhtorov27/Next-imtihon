"use client";

import { useState } from "react";
import styles from "./accordion.module.css";

type AccordionItemType = {
  title: string;
  content: string;
  isOpen: boolean;
  onClick: () => void;
};

const AccordionItem = ({
  title,
  content,
  isOpen,
  onClick,
}: AccordionItemType) => {
  return (
    <div className={styles.accordionItem}>
      <button
        className={styles.accordionHeader}
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.rotate : ""}`}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div
        className={`${styles.accordionContent} ${isOpen ? styles.open : ""}`}
      >
        <div className={styles.contentInner}>{content}</div>
      </div>
    </div>
  );
};

function AccordionPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const items = [
    {
      title: "Accordion 1",
      content: "Nimadir mazmuni 1",
    },
    {
      title: "Accordion 2",
      content: "Nimadir mazmuni 2",
    },
    {
      title: "Accordion 3",
      content: "Nimadir mazmuni 3",
    },
  ];

  return (
    <div className={styles.accordionContainer}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          isOpen={openItems.includes(index)}
          onClick={() => toggleItem(index)}
        />
      ))}
    </div>
  );
}

export default AccordionPage;
