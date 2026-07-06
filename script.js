// 섹션이 화면에 보이면 살짝 떠오르는 효과만 넣었어요. 없어도 사이트는 잘 작동합니다.
document.addEventListener('DOMContentLoaded', () => {
  const targets = document.querySelectorAll('.features, .how, .cta, .feature-card, .steps li');
  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(el => observer.observe(el));
});
