// ==== AudioContext Global ====
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
function resumeAudioContext() {
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
}

// ==== Sonido de clic ====
let volumeLevel = 1; // volumen de 0 a 1

function playClickSound() {
  if (volumeLevel === 0) return;
  resumeAudioContext();

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = 800;
  gainNode.gain.value = 0.1 * volumeLevel;

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
  oscillator.stop(audioContext.currentTime + 0.2);
}

// Reanuda el contexto con el primer clic
document.addEventListener('click', () => resumeAudioContext(), { once: true });

// ==== Arrastrar íconos ====
function enableDrag(selector) {
  document.querySelectorAll(selector).forEach(elem => {
    let isDragging = false, offsetX = 0, offsetY = 0;

    elem.addEventListener('mousedown', e => {
      isDragging = true;
      const rect = elem.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      elem.style.zIndex = '1000';
      elem.style.cursor = 'grabbing';
      playClickSound();

      function onMouseMove(e) {
        if (!isDragging) return;
        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;
        const maxX = window.innerWidth - elem.offsetWidth;
        const maxY = window.innerHeight - elem.offsetHeight;
        elem.style.left = `${Math.max(0, Math.min(maxX, newX))}px`;
        elem.style.top = `${Math.max(0, Math.min(maxY, newY))}px`;
      }

      function onMouseUp() {
        isDragging = false;
        elem.style.zIndex = '5';
        elem.style.cursor = 'grab';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      e.preventDefault();
    });

    elem.addEventListener('contextmenu', e => e.preventDefault());
  });
}

enableDrag('.draggable');

// ==== Navegación doble clic ====
document.getElementById('cv-icon').addEventListener('dblclick', () => {
  playClickSound();
  window.location.href = 'cv/cv.html';
});
document.getElementById('projects-icon').addEventListener('dblclick', () => {
  playClickSound();
  window.location.href = 'projects.html';
});

// ==== Volumen ====
const volumeButton = document.getElementById('volume-toggle');
const volumeSlider = document.getElementById('volume-slider');
const volumeSliderContainer = document.getElementById('volume-slider-container');
volumeSlider.value = volumeLevel * 100;

volumeButton.addEventListener('click', e => {
  e.stopPropagation();
  volumeSliderContainer.style.display =
    volumeSliderContainer.style.display === 'block' ? 'none' : 'block';
});

volumeSlider.addEventListener('input', function () {
  volumeLevel = this.value / 100;
  const icon = volumeButton.querySelector('i');

  if (volumeLevel === 0) {
    icon.className = 'fas fa-volume-mute';
  } else if (volumeLevel < 0.5) {
    icon.className = 'fas fa-volume-down';
  } else {
    icon.className = 'fas fa-volume-up';
  }

  playClickSound();
});

document.addEventListener('click', e => {
  if (!volumeButton.contains(e.target) && !volumeSliderContainer.contains(e.target)) {
    volumeSliderContainer.style.display = 'none';
  }
});

// ==== Traducción ====
const translations = {
  es: {
    cv: "Mi CV",
    projects: "Mis Proyectos",
    humidity: "Humedad",
    location: "Ubicación",
    weather: {
      sunny: "Soleado",
      clouds: "Nublado",
      rain: "Lluvioso",
      clear: "Despejado",
      thunderstorm: "Tormenta",
      drizzle: "Llovizna",
      snow: "Nieve",
      mist: "Niebla"
    }
  },
  en: {
    cv: "My CV",
    projects: "My Projects",
    humidity: "Humidity",
    location: "Location",
    weather: {
      sunny: "Sunny",
      clouds: "Cloudy",
      rain: "Rainy",
      clear: "Clear",
      thunderstorm: "Thunderstorm",
      drizzle: "Drizzle",
      snow: "Snow",
      mist: "Mist"
    }
  }
};

function changeLanguage(lang) {
  document.getElementById('cv-text').textContent = translations[lang].cv;
  document.getElementById('projects-text').textContent = translations[lang].projects;
  document.querySelector('#humidity').previousElementSibling.textContent = translations[lang].humidity + ':';
  updateClock(lang);
  document.getElementById('location-text').textContent = lang === 'es' ? 'Barcelona, ES' : 'Barcelona, Spain';

  const weatherDesc = document.getElementById('weather-description');
  if (weatherDesc.textContent) {
    const currentDesc = weatherDesc.textContent.toLowerCase();
    const weatherKeys = Object.keys(translations[lang].weather);
    for (const key of weatherKeys) {
      if (currentDesc.includes(key) || currentDesc.includes(translations['es'].weather[key].toLowerCase())) {
        weatherDesc.textContent = translations[lang].weather[key];
        break;
      }
    }
  }
}

document.getElementById('language-select').addEventListener('change', function () {
  const lang = this.value;
  changeLanguage(lang);
  updateWeather(lang);
});

// ==== Reloj ====
function updateClock(lang = 'es') {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');

  document.getElementById('time-display').textContent = `${h}:${m}:${s}`;
  document.getElementById('taskbar-clock').textContent = `${h}:${m}`;

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('date-display').textContent = now.toLocaleDateString(lang, options);
}

// ==== Clima (usando OpenWeatherMap) ====
async function updateWeather(lang = 'es') {
  try {
    const apiKey = '4313c4fbd390d44705a95434ca0bf596';
    const city = 'Barcelona';
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=${lang}&appid=${apiKey}`
    );
    const data = await response.json();

    if (data.cod === 200) {
      const temp = `${Math.round(data.main.temp)}°C`;
      const iconCode = data.weather[0].icon;
      const mainWeather = data.weather[0].main.toLowerCase();
      const translated = translations[lang].weather[mainWeather] || data.weather[0].description;

      document.getElementById('temperature').textContent = temp;
      document.getElementById('weather-description').textContent = translated;
      document.getElementById('humidity').textContent = `${translations[lang].humidity}: ${data.main.humidity}%`;
      document.getElementById('location-text').textContent = `${data.name}, ${data.sys.country}`;
      document.getElementById('weather-icon').innerHTML =
        `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${translated}">`;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.warn('Error obteniendo clima, usando valores por defecto.', error);
    document.getElementById('temperature').textContent = '24°C';
    document.getElementById('weather-description').textContent = translations[lang].weather.sunny;
    document.getElementById('humidity').textContent = `${translations[lang].humidity}: 45%`;
    document.getElementById('location-text').textContent = lang === 'es' ? 'Barcelona, ES' : 'Barcelona, Spain';
    document.getElementById('weather-icon').innerHTML = '<i class="fas fa-sun"></i>';
  }
}

// ==== Inicialización ====
document.querySelectorAll('.draggable').forEach(item =>
  item.addEventListener('mousedown', playClickSound)
);

changeLanguage('es');
updateWeather('es');

setInterval(() => {
  const lang = document.getElementById('language-select').value;
  updateClock(lang);
}, 1000);

setInterval(() => {
  const lang = document.getElementById('language-select').value;
  updateWeather(lang);
}, 30 * 60 * 1000); // cada 30 minutos