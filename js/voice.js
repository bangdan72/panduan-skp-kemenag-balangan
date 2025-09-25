// voice.js
document.addEventListener("DOMContentLoaded", () => {
  // Tombol kecil
  const voiceToggle = document.createElement("button");
  voiceToggle.id = "voiceToggle";
  voiceToggle.style.position = "fixed";
  voiceToggle.style.bottom = "10px";
  voiceToggle.style.left = "10px";
  voiceToggle.style.zIndex = "9999";
  voiceToggle.style.padding = "5px 10px";
  voiceToggle.style.fontSize = "12px";
  voiceToggle.style.border = "none";
  voiceToggle.style.borderRadius = "4px";
  voiceToggle.style.cursor = "pointer";
  document.body.appendChild(voiceToggle);

  // Ambil status terakhir atau default ON
  let voiceStatus = localStorage.getItem("voiceStatus") || "on";

  function updateButton() {
    voiceToggle.innerText = voiceStatus === "on" ? "Suara ON" : "Suara OFF";
    voiceToggle.style.backgroundColor = voiceStatus === "on" ? "yellow" : "lightgray";
    voiceToggle.style.color = "black";
  }
  updateButton();

  voiceToggle.addEventListener("click", () => {
    // Toggle status
    voiceStatus = voiceStatus === "on" ? "off" : "on";
    localStorage.setItem("voiceStatus", voiceStatus);
    updateButton();

    // hentikan suara jika dimatikan
    if (voiceStatus === "off") window.speechSynthesis.cancel();
  });

  function speak(text) {
    // cek status langsung saat akan bicara
    if (localStorage.getItem("voiceStatus") === "off") return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "id-ID";

      // Pilih suara Indonesia perempuan jika ada
      const voices = speechSynthesis.getVoices();
      const indoVoice = voices.find(v => v.lang === "id-ID" && v.name.toLowerCase().includes("female"))
                        || voices.find(v => v.lang === "id-ID") || voices[0];
      if (indoVoice) utterance.voice = indoVoice;

      window.speechSynthesis.speak(utterance);
    }
  }

  // Baca <title> otomatis saat halaman dibuka
  function speakTitle() {
    if (localStorage.getItem("voiceStatus") === "on") speak(document.title);
  }

  if (speechSynthesis.getVoices().length === 0) {
    speechSynthesis.onvoiceschanged = speakTitle;
  } else {
    speakTitle();
  }

  // Hover / mouseover elemen
  document.body.addEventListener("mouseover", e => {
    // jangan bicara kalau dimatikan
    if (localStorage.getItem("voiceStatus") === "off") return;

    if (e.target && e.target.innerText && e.target.tagName !== "SCRIPT" && e.target.id !== "voiceToggle") {
      speak(e.target.innerText.trim());
    }
  });

  // Seleksi teks
  document.addEventListener("mouseup", () => {
    if (localStorage.getItem("voiceStatus") === "off") return;

    const selected = window.getSelection().toString().trim();
    if (selected) speak(selected);
  });
});
