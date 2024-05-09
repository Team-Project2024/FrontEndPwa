import React from 'react';
import TextTransition, { presets } from 'react-text-transition';

const TEXTS = ['학사', '행사', '과목추천','뭐든' ,'물어봐','LUMOS'];

const TextAnimation = () => {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const intervalId = setInterval(
      () => setIndex((index) => index + 1),
      2000, // 2초마다 변경
    );
    return () => clearTimeout(intervalId);
  }, []);

  return (
    <h1>
      <TextTransition className=' font-gmarket text-8xl text-zinc-300' inline springConfig={presets.stiff}>{TEXTS[index % TEXTS.length]}</TextTransition>
    </h1>
  );
};


export default TextAnimation;