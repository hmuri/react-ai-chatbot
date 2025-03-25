const useTextToSpeech = () => {
  const speak = (text) => {
    if (!window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;

    window.speechSynthesis.cancel(); // 중복 방지
    window.speechSynthesis.speak(utterance);
  };

  return { speak };
};

export default useTextToSpeech;
