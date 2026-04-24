// ========================================
// Mobile Menu Toggle
// ========================================
const menuToggle = document.querySelector('.menu-toggle');
const navMenu    = document.querySelector('.nav-menu');
const navLinks   = document.querySelectorAll('.nav-link');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const spans = menuToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
            spans[1].style.opacity   = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px,-6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity   = '1';
            spans[2].style.transform = 'none';
        }
    });
}
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = menuToggle ? menuToggle.querySelectorAll('span') : [];
        spans[0] && (spans[0].style.transform = 'none');
        spans[1] && (spans[1].style.opacity   = '1');
        spans[2] && (spans[2].style.transform = 'none');
    });
});

// ========================================
// Active Nav Link (single-page scroll)
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const sections  = document.querySelectorAll('.section');
    if (!sections.length) return;
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (pageYOffset >= (section.offsetTop - 200)) current = section.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
        });
    });
});

// ========================================
// Copy Code
// ========================================
function copyCode(button) {
    const codeBlock = button.closest('.code-container').querySelector('code');
    const code = codeBlock.textContent;
    navigator.clipboard.writeText(code).then(() => {
        const orig = button.textContent;
        button.textContent = 'Copied!';
        button.style.background    = 'var(--accent-green)';
        button.style.borderColor   = 'var(--accent-green)';
        button.style.color         = 'var(--bg-primary)';
        setTimeout(() => {
            button.textContent = orig;
            button.style.background  = 'transparent';
            button.style.borderColor = 'var(--accent-cyan)';
            button.style.color       = 'var(--accent-cyan)';
        }, 2000);
    }).catch(() => { button.textContent = 'Error!'; });
}

// ========================================
// Toggle Collapsible Item Cards (View button)
// ========================================
function toggleItem(btn) {
    const card = btn.closest('.item-card');
    const body = card.querySelector('.item-card-body');
    const isOpen = body.classList.contains('open');

    if (isOpen) {
        body.classList.remove('open');
        btn.classList.remove('open');
        btn.innerHTML = 'View <span class="btn-arrow">▼</span>';
    } else {
        body.classList.add('open');
        btn.classList.add('open');
        btn.innerHTML = 'Hide <span class="btn-arrow">▲</span>';
        // Trigger syntax highlighting inside newly opened block
        highlightCode(body);
    }
}

// ========================================
// Toggle Quiz Question (collapsible)
// ========================================
function toggleQuestion(header) {
    const content = header.nextElementSibling;
    const isActive = header.classList.contains('active');
    if (isActive) {
        header.classList.remove('active');
        content.classList.remove('show');
    } else {
        header.classList.add('active');
        content.classList.add('show');
    }
}

// ========================================
// Reveal Answer Button
// ========================================
function revealAnswer(button) {
    const answerContent = button.nextElementSibling;
    if (answerContent.style.display === 'none' || answerContent.style.display === '') {
        answerContent.style.display = 'block';
        button.textContent = 'Hide Answer';
        button.classList.add('revealed');
    } else {
        answerContent.style.display = 'none';
        button.textContent = 'Reveal Answer';
        button.classList.remove('revealed');
    }
}

// ========================================
// Search Quiz 2 Questions
// ========================================
function searchQuiz2Question() {
    const searchInput    = document.getElementById('quiz2-search');
    const questionNumber = parseInt(searchInput.value);
    const container      = document.getElementById('quiz2-questions-container');
    const totalQuestions = document.querySelectorAll('#quiz2-questions-container .question-item').length;

    if (isNaN(questionNumber) || questionNumber < 1 || questionNumber > totalQuestions) {
        alert(`⚠️ Please enter a valid question number (1-${totalQuestions})`);
        searchInput.focus();
        return;
    }

    const questionId  = `q${questionNumber}`;
    const questionEl  = document.getElementById(questionId);

    if (questionEl) {
        container.style.display = 'block';
        document.querySelectorAll('.question-item').forEach(item => item.style.display = 'none');
        questionEl.style.display = 'block';

        const header  = questionEl.querySelector('.question-header');
        const content = questionEl.querySelector('.question-content');
        if (header && content) { header.classList.add('active'); content.classList.add('show'); }

        setTimeout(() => container.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        questionEl.style.background = 'rgba(34,211,238,0.15)';
        setTimeout(() => questionEl.style.background = '', 2000);
    } else {
        alert('❌ Question not found');
    }
}

// ========================================
// Syntax Highlighting
// ========================================
function highlightCode(root) {
    root = root || document;
    const codeBlocks = root.querySelectorAll('code.java');
    const keywords = [
        'public','private','protected','class','void','static','return',
        'if','else','for','while','new','this','import','package','extends',
        'implements','try','catch','finally','throw','throws','int','double',
        'boolean','String','float','long','char','byte','short','do','switch',
        'case','break','default','null','true','false'
    ];

    codeBlocks.forEach(block => {
        if (block.dataset.highlighted) return;
        block.dataset.highlighted = '1';
        let code = block.textContent;

        // Strings
        code = code.replace(/"([^"]*)"/g, '<span style="color:var(--accent-yellow)">"$1"</span>');
        // Single-line comments
        code = code.replace(/\/\/(.*)/g, '<span style="color:var(--text-muted);font-style:italic;">//$1</span>');
        // Block comments
        code = code.replace(/\/\*([\s\S]*?)\*\//g, '<span style="color:var(--text-muted);font-style:italic;">/*$1*/</span>');
        // Keywords
        keywords.forEach(kw => {
            const rx = new RegExp(`\\b${kw}\\b`, 'g');
            code = code.replace(rx, `<span style="color:var(--accent-magenta)">${kw}</span>`);
        });
        // Numbers
        code = code.replace(/\b(\d+)\b/g, '<span style="color:var(--accent-cyan)">$1</span>');
        block.innerHTML = code;
    });
}

window.addEventListener('DOMContentLoaded', () => highlightCode(document));

// ========================================
// Scroll Fade-in Animations
// ========================================
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.05 });

document.querySelectorAll('.content-card, .item-card, .category-block, .stat-card, .nav-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ========================================
// Glitch on fast scroll (Home only)
// ========================================
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (Math.abs(scrollTop - lastScrollTop) > 100) {
        document.querySelector('.glitch')?.classList.add('glitch-active');
        setTimeout(() => document.querySelector('.glitch')?.classList.remove('glitch-active'), 200);
    }
    lastScrollTop = scrollTop;
});

// ========================================
// Konami Code Easter Egg
// ========================================
const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIndex = 0;
document.addEventListener('keydown', e => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg(); konamiIndex = 0;
        }
    } else { konamiIndex = 0; }
});
function activateEasterEgg() {
    document.body.style.animation = 'rainbow 2s linear infinite';
    const style = document.createElement('style');
    style.textContent = '@keyframes rainbow{0%{filter:hue-rotate(0deg)}100%{filter:hue-rotate(360deg)}}';
    document.head.appendChild(style);
    setTimeout(() => {
        alert('🎉 You found the secret! You\'re a true coder! 🎉');
        document.body.style.animation = 'none'; style.remove();
    }, 2000);
}

// ========================================
// Console branding
// ========================================
console.log('%c🚀 OOP E-Portfolio', 'color:#22d3ee;font-size:24px;font-weight:bold;');
console.log('%cAlexander Dan E. Cuison | BSIT 2-5', 'color:#00ff88;font-size:12px;');
console.log('%cTip: Try the Konami Code! ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA', 'color:#facc15;font-size:10px;font-style:italic;');
