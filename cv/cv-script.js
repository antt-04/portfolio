document.addEventListener('DOMContentLoaded', function() {
  // Animación de entrada
  const sections = document.querySelectorAll('.cv-section');
  
  sections.forEach((section, index) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.5s ease ' + (index * 0.1) + 's';
    
    setTimeout(() => {
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';
    }, 100);
  });

  // Forzar recarga del fondo si es necesario
  const bg = document.querySelector('.background');
  if (bg) {
    bg.style.backgroundImage = 'url("../assets/background.JPG")';
  }

  // Traducciones completas
  const translations = {
    es: {
      title: "Desarrolladora Web Fullstack",
      about: "SOBRE MÍ",
      aboutText: "Desarrolladora web en formación con enfoque en desarrollo fullstack, destacando por la capacidad de adaptación, resolución de problemas y pasión por la tecnología. He colaborado en proyectos reales con impacto social, como la plataforma de ayuda al diagnóstico de enfermedades raras (UOC + Hospital Sant Joan de Déu).",
      experience: "EXPERIENCIA",
      job1Title: "Operaría de rampa",
      job1Desc: "Carga y descarga de mercancías y equipaje de aviones. Mantenimiento del equipo.",
      job2Title: "Prácticas Desarrollo Web",
      job2Desc: "Diseño frontend en HTML, JavaScript y CSS para proyecto de ayuda ciudadana.",
      job3Title: "Gestora de llamadas de emergencia - TI2",
      job4Title: "Mozo de almacén",
      education: "FORMACIÓN",
      edu1Title: "Máster FP en Inteligencia Artificial y Big Data",
      edu1Date: "Fecha de finalización: En curso",
      edu2Title: "CFGS Desarrollo de Aplicaciones Web (Bioinformática)",
      edu2Desc: "Proyecto colaborativo con Hospital Sant Joan de Déu. Desarrollo de plataforma digital para diagnóstico de enfermedades raras.",
      courses: "CURSOS",
      course1Title: "Inteligencia Artificial y productividad",
      course1Hours: "8 horas",
      course2Title: "Desarrollo de aplicaciones multiplataforma",
      course2Hours: "690 horas",
      languages: "IDIOMAS",
      lang1: "Castellano",
      lang1Level: "Nativo",
      lang2: "Catalán",
      lang3: "Inglés"
    },
    en: {
      title: "Fullstack Web Developer",
      about: "ABOUT ME",
      aboutText: "Web developer in training with a focus on fullstack development, known for adaptability, problem-solving skills, and passion for technology. I have collaborated on real projects with social impact, such as the platform for diagnosing rare diseases (UOC + Sant Joan de Déu Hospital).",
      experience: "EXPERIENCE",
      job1Title: "Ramp agent",
      job1Desc: "Loading and unloading aircraft cargo and luggage. Equipment maintenance.",
      job2Title: "Web Development Internship",
      job2Desc: "Frontend design in HTML, JavaScript and CSS for a citizen assistance project.",
      job3Title: "Emergency Call Handler - TI2",
      job4Title: "Warehouse worker",
      education: "EDUCATION",
      edu1Title: "Vocational Master's in Artificial Intelligence and Big Data",
      edu1Date: "Completion date: In progress",
      edu2Title: "Higher Degree in Web Application Development (Bioinformatics)",
      edu2Desc: "Collaborative project with Sant Joan de Déu Hospital. Development of a digital platform to aid in the diagnosis of rare diseases.",
      courses: "COURSES",
      course1Title: "Artificial Intelligence and productivity",
      course1Hours: "8 hours",
      course2Title: "Cross-platform application development",
      course2Hours: "690 hours",
      languages: "LANGUAGES",
      lang1: "Spanish",
      lang1Level: "Native",
      lang2: "Catalan",
      lang3: "English"
    }
  };

  // Función para cambiar idioma
  function changeLanguage(lang) {
    // Actualizar todos los elementos con clase 'translatable'
    document.querySelectorAll('.translatable').forEach(element => {
      const key = element.getAttribute('data-key');
      if (translations[lang][key]) {
        element.textContent = translations[lang][key];
      }
    });
    
    // Actualizar título principal
    document.getElementById('cv-title').textContent = translations[lang].title;
    
    // Animación de cambio
    document.querySelector('.language-selector-top select').style.transform = 'scale(1.1)';
    setTimeout(() => {
      document.querySelector('.language-selector-top select').style.transform = 'scale(1)';
    }, 200);
  }

  // Evento para el selector de idiomas
  document.getElementById('cv-language-select').addEventListener('change', function() {
    changeLanguage(this.value);
  });

  // Inicializar con español
  changeLanguage('es');
});