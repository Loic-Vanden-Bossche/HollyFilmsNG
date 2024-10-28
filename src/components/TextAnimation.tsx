import React, { useEffect, useRef, useState } from "react";

const TextAnimation: React.FC = () => {
  const words = [
    "des films en haute qualité",
    "un service 100% gratuit",
    "un contenu régulièrement mis à jour",
    "des recommendations personnalisés",
    "une synchronisation sur tous vos appareils",
    "vos films sans interruptions ni publicités",
  ];

  const wordElements = useRef<HTMLSpanElement[]>([]);
  const wordArray = useRef<HTMLSpanElement[][]>([]);
  let currentWordIndex = 0;

  const colorFromGradient = (
    colorStart: string,
    colorEnd: string,
    percent: number,
  ) => {
    const start = {
      r: parseInt(colorStart.substring(1, 3), 16),
      g: parseInt(colorStart.substring(3, 5), 16),
      b: parseInt(colorStart.substring(5, 7), 16),
    };
    const end = {
      r: parseInt(colorEnd.substring(1, 3), 16),
      g: parseInt(colorEnd.substring(3, 5), 16),
      b: parseInt(colorEnd.substring(5, 7), 16),
    };
    const r = Math.floor(start.r * (1 - percent) + end.r * percent).toString(
      16,
    );
    const g = Math.floor(start.g * (1 - percent) + end.g * percent).toString(
      16,
    );
    const b = Math.floor(start.b * (1 - percent) + end.b * percent).toString(
      16,
    );
    return `#${pad(r)}${pad(g)}${pad(b)}`;
  };

  const pad = (num: string) => (num.length < 2 ? "0" + num : num);

  const changeWord = () => {
    const cw = wordArray.current[currentWordIndex];
    const nw =
      currentWordIndex === wordArray.current.length - 1
        ? wordArray.current[0]
        : wordArray.current[currentWordIndex + 1];

    cw.forEach((_, i) => animateLetterOut(cw, i));
    nw.forEach((letter, i) => {
      letter.className = "letter behind";
      if (nw[0].parentElement) nw[0].parentElement.style.opacity = "1";
      animateLetterIn(nw, i);
    });

    currentWordIndex =
      currentWordIndex === wordArray.current.length - 1
        ? 0
        : currentWordIndex + 1;
  };

  const splitLetters = (word: HTMLSpanElement) => {
    const content = word.innerHTML;
    word.innerHTML = "";
    const letters: HTMLSpanElement[] = [];

    Array.from(content).forEach((char, i) => {
      const letter = document.createElement("span");
      letter.className = "letter";
      letter.style.color = colorFromGradient(
        "#4ade80",
        "#3b82f6",
        i / content.length,
      );
      letter.innerHTML = char === " " ? "&nbsp;" : char;
      word.appendChild(letter);
      letters.push(letter);
    });
    wordArray.current.push(letters);
  };

  const animateLetterOut = (letters: HTMLSpanElement[], index: number) => {
    setTimeout(() => {
      letters[index].className = "letter out";
    }, index * 10);
  };

  const animateLetterIn = (letters: HTMLSpanElement[], index: number) => {
    setTimeout(
      () => {
        letters[index].className = "letter in";
      },
      340 + index * 10,
    );
  };

  useEffect(() => {
    wordElements.current.forEach((element, i) => splitLetters(element));
    changeWord();
    const intervalId = setInterval(() => changeWord(), 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="text-lg sm:text-xl mb-8 sm:mb-0">
      <p className="sm:inline-block align-top">Découvrez</p>
      <p className="sm:inline-block align-top">
        {words.map((word, index) => (
          <span
            key={index}
            ref={(el) => el && (wordElements.current[index] = el)}
            className={`absolute font-bold flex flex-row sm:ml-2 opacity-0`}
          >
            {word}
          </span>
        ))}
      </p>
    </div>
  );
};

export default TextAnimation;
