// src/App.js
import React from 'react';


const messages = [
  { type: 'bot', text: '안녕하세요? 학교생활에 관한 모든 질문에 대해 최대한 답변해드릴게요.\n\n(오늘의 학교생활 팁)\n호서대 재학생은 포털로그인후 우측 호서메일 배너를 통해 office365 프로그램을 무료로 사용할수있어요' },
  { type: 'user', text: '내가 어떤 과목을 들으면 좋을까? 꿀교양 추천해줘' },
];

const Message = ({ type, text }) => (
  <div className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`rounded-lg p-4 max-w-xs ${type === 'user' ? 'bg-gray-300 text-gray-900' : 'bg-gray-200 text-gray-900'}`}>
      {text}
    </div>
  </div>
);

const SidebarItem = ({ text }) => (
  <div className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer">
    <span>{text}</span>
    <button className="text-gray-500 hover:text-gray-900">✖</button>
  </div>
);

const UII = () => {
  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-100 p-4">
        <div className="text-xl font-bold mb-4">LUMOS</div>
        <div className="mb-4">
          <button className="w-full p-2 bg-gray-200 rounded-lg">이전대화 일괄삭제</button>
        </div>
        <div className="mb-8">
          <div className="text-lg mb-2">Today</div>
          <SidebarItem text="어떻게 도와드릴까요?" />
        </div>
        <div className="mb-8">
          <div className="text-lg mb-2">March</div>
          <SidebarItem text="내가 어떤과목을...." />
          <SidebarItem text="졸업요건이 궁금해" />
        </div>
        <div className="mb-8">
          <div className="text-lg mb-2">2023</div>
          <SidebarItem text="도서관이 어디야" />
          <SidebarItem text="이번달 행사가 궁금해" />
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex-1 p-6 overflow-y-auto">
          {messages.map((msg, index) => (
            <Message key={index} type={msg.type} text={msg.text} />
          ))}
        </div>
        <div className="p-4 flex items-center">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-lg"
            placeholder="Message..."
          />
          <button className="ml-4 p-2 bg-blue-500 text-white rounded-lg">Send</button>
        </div>
      </div>
    </div>
  );
};

export default UII;
