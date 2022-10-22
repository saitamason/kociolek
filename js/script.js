import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Sticky header

const header = document.querySelector('.header');
const headerHeight = header.getBoundingClientRect().height;
const hero = document.querySelector('.hero');

header.classList.remove('header--sticky');

const makeHeaderSticky = entries => {
  const [entry] = entries;
  if (entry.isIntersecting) {
    header.classList.remove('header--sticky');
    hero.style.marginTop = 0;
  } else {
    header.classList.add('header--sticky');
    hero.style.marginTop = `${headerHeight}px`;
  }
};

const heroObserver = new IntersectionObserver(makeHeaderSticky, {
  root: null,
  threshold: 0,
});

heroObserver.observe(hero);

// Mobile navigation

const menuButtonOpen = document.querySelector('.menu-button--open');
const menuButtonClose = document.querySelector('.menu-button--close');

menuButtonOpen.addEventListener('click', function () {
  document.body.classList.add('navigation-open');
});
menuButtonClose.addEventListener('click', function () {
  const animationClass = 'navigation-closing-animation';
  document.body.classList.add(animationClass);
  setTimeout(() => {
    document.body.classList.remove('navigation-open');
    document.body.classList.remove(animationClass);
  }, 300);
});

const topNavigation = document.querySelector('.top-navigation');
const footerNavigation = document.querySelector('.footer-navigation');
const contactButton = document.querySelector('.hero__button--contact');

function isMobile() {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.platform) ||
    window.matchMedia('only screen and (max-width: 55em)').matches
  );
}

if (!isMobile()) {
  // Scroll with offset

  const scrollWithOffset = function (event) {
    event.preventDefault();

    if (!event.target.classList.contains(this)) return;

    document.body.classList.remove('navigation-open');

    const id = event.target.getAttribute('href');
    if (id === '#') {
      location.hash = '#';
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      return;
    }

    let offset;
    if (id === '#oferta') offset = 0;
    else offset = headerHeight / 2;

    const elementPosition = document
      .querySelector(id)
      .getBoundingClientRect().top;
    const finalPosition = elementPosition + window.pageYOffset - offset;

    location.hash = id;
    window.scrollTo({
      top: finalPosition,
      behavior: 'smooth',
    });
  };

  topNavigation.addEventListener(
    'click',
    scrollWithOffset.bind('top-navigation__link')
  );
  footerNavigation.addEventListener(
    'click',
    scrollWithOffset.bind('footer-navigation__link')
  );
  contactButton.addEventListener(
    'click',
    scrollWithOffset.bind('hero__button--contact')
  );

  window.addEventListener('load', () => {
    if (window.scrollY) return;

    // Reveal elements on scroll

    const allSections = document.querySelectorAll('.section');

    const revealSection = (entries, observer) => {
      const [entry] = entries;
      if (!entry.isIntersecting) return;
      const texts = entry.target.querySelectorAll('hgroup, p');
      const images = entry.target.querySelectorAll(
        '.animate--from-left, .animate--from-right'
      );
      texts.forEach(element => {
        element.classList.remove('hidden');
        element.classList.add('animation--fade');
      });
      images.forEach(image => {
        image.classList.remove('hidden');
        if (image.classList.contains('animate--from-right'))
          image.classList.add('animation--slide');
        else image.classList.add('animation--slide-reverse');
      });
      observer.unobserve(entry.target);
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
      root: null,
      threshold: 0.3,
    });

    allSections.forEach(section => {
      const texts = section.querySelectorAll('hgroup, p');
      const images = section.querySelectorAll(
        '.animate--from-left, .animate--from-right'
      );
      texts.forEach(element => element.classList.add('hidden'));
      images.forEach(image => image.classList.add('hidden'));
      sectionObserver.observe(section);
    });

    // Reveal features on scroll

    const featuresBox = document.querySelector('.offer__features');
    const allFeatures = featuresBox.querySelectorAll('li');

    allFeatures.forEach(feature => feature.classList.add('hidden'));

    function revealFeatures(entries, observer) {
      const [entry] = entries;
      if (!entry.isIntersecting) return;
      allFeatures.forEach((feature, i) => {
        setTimeout(() => {
          feature.classList.remove('hidden');
          feature.querySelector('i').style.animationPlayState = 'running';
        }, i * 200);
      });
      observer.unobserve(entry.target);
    }

    const featuresObserver = new IntersectionObserver(revealFeatures, {
      root: null,
      threshold: 0,
    });

    featuresObserver.observe(featuresBox);
  });

  // Animate buttons

  const allButtons = document.querySelectorAll('.button');
  const buttonAnimationClassName = 'button--animation-keyframe-';
  let buttonAnimationInterval;

  allButtons.forEach(button => {
    button.addEventListener('mouseover', function () {
      const element = this;
      let currentKeyframe = setAnimationClasses(
        element,
        buttonAnimationClassName,
        3,
        0
      );
      buttonAnimationInterval = setInterval(function () {
        currentKeyframe = setAnimationClasses(
          element,
          buttonAnimationClassName,
          3,
          currentKeyframe
        );
      }, 300);
    });

    button.addEventListener('mouseleave', function () {
      clearInterval(buttonAnimationInterval);
      removeAnimationClasses(this, buttonAnimationClassName, 3);
    });
  });

  function setAnimationClasses(
    targetElement,
    animationClassName,
    numberOfKeyframes,
    currentKeyframe
  ) {
    targetElement.classList.remove(`${animationClassName}${currentKeyframe}`);
    if (currentKeyframe === numberOfKeyframes) currentKeyframe = 0;
    else
      targetElement.classList.add(`${animationClassName}${++currentKeyframe}`);
    return currentKeyframe;
  }

  function removeAnimationClasses(
    targetElement,
    animationClassName,
    numberOfKeyframes
  ) {
    for (let i = 1; i <= numberOfKeyframes; i++)
      targetElement.classList.remove(`${animationClassName}${i}`);
  }

  // Fade out header on link hover

  fadeOutHeaderOnHover();

  function fadeOutHeaderOnHover() {
    header.addEventListener('mouseover', function (event) {
      if (isNotLinkOrLogo(event.target)) {
        setOpacityAndBlurOfHeaderElements(event.target, 1, 0);
        return;
      }
      setOpacityAndBlurOfHeaderElements(event.target, 0.7, 0.7);
      event.target.style.opacity = 1;
      event.target.style.filter = `blur(0px)`;
    });

    header.addEventListener('mouseleave', function (event) {
      setOpacityAndBlurOfHeaderElements(event.target, 1, 0);
    });

    function isNotLinkOrLogo(targetElement) {
      return !(
        targetElement.classList.contains('top-navigation__link') ||
        targetElement.classList.contains('header__logo')
      );
    }

    function setOpacityAndBlurOfHeaderElements(targetElement, opacity, blur) {
      setOpacityAndBlurOfLinks(targetElement, opacity, blur);
      setOpacityAndBlurOfLogo(targetElement, opacity, blur);
    }

    function setOpacityAndBlurOfLinks(targetElement, opacity, blur) {
      const allLinks = targetElement
        .closest('.header')
        .querySelectorAll('.top-navigation__link');
      allLinks.forEach(link => {
        link.style.opacity = opacity;
        link.style.filter = `blur(${blur}px)`;
      });
    }

    function setOpacityAndBlurOfLogo(targetElement, opacity, blur) {
      const logo = targetElement
        .closest('.header')
        .querySelector('.header__logo');
      logo.style.opacity = opacity;
      logo.style.filter = `blur(${blur}px)`;
    }
  }
} else {
  topNavigation.addEventListener('click', event => {
    if (!event.target.classList.contains('top-navigation__link')) return;
    document.body.classList.remove('navigation-open');
  });
}

// Credits

const credits = document.querySelector('.credits');
const creditsOpenButton = document.querySelector('.footer__heart');

creditsOpenButton.addEventListener('click', () => {
  credits.style.display = 'flex';
});

credits.addEventListener('click', () => {
  credits.style.display = 'none';
});
