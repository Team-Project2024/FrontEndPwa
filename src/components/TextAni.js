
import React from 'react';
import TextTransition, { presets } from 'react-text-transition';
import { TypeAnimation } from 'react-type-animation';



const TextAni = () => {
 
  return (
    <TypeAnimation
    className="whitespace-pre-line h-400 block text-white text-5xl font-gmarket"
    sequence={[
      `안녕하세요!\n\n호서대에 다니면서 궁금하신것들을\n\n호서대 챗봇 LUMOS에게\n\n무엇이든 물어보세요\n\n`, 
      2000,
      '',
    ]}
    repeat={Infinity}
  />
  );
};


export default TextAni;