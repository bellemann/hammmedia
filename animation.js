(function () {
  // Register GSAP plugins once
  gsap.registerPlugin(ScrollTrigger, Flip);

  // Utility: Check if device is touch-enabled (consolidated from duplicates)
  function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  // === Benefits Cards Fade In ===
  const items = gsap.utils.toArray(".features_item");
  items.forEach((item) => {
    gsap.fromTo(
      item,
      { opacity: 0, yPercent: 10 },
      {
        opacity: 1,
        yPercent: 0,
        scrollTrigger: {
          trigger: item,
          start: 'top bottom',
          end: 'top center',
          scrub: true,
        },
      }
    );
  });

  // === Big Button Flip ===
  if (!isTouchDevice()) {
    gsap.defaults({
      duration: 0.35,
      ease: "power1.inOut",
    });

    $('.cta_btn_wrap').each(function () {
      let $btn = $(this);
      let $circle = $btn.find('.cta_btn_circle');
      let $paddingLeft = $btn.find(".cta_btn_space_left");
      let $paddingRight = $btn.find(".cta_btn_space_right");
      let $svg = $btn.find(".cta_btn_svg");
      let $shadow = $btn.find(".cta_btn_shadow");

      $btn.on('mouseenter', function () {
        let state = Flip.getState($circle);
        $circle.addClass('is-active');
        Flip.from(state);
        gsap.to($btn, { backgroundColor: "#e4ff4b", color: "black" });
        gsap.to($paddingLeft, { width: "2.25rem" });
        gsap.to($paddingRight, { width: "8.25rem" });
        gsap.to($svg, { rotate: 360 });
        gsap.to($shadow, { opacity: 0.5 });
      });

      $btn.on('mouseleave', function () {
        let state = Flip.getState($circle);
        $circle.removeClass('is-active');
        Flip.from(state);
        gsap.to($btn, { backgroundColor: "rgba(255, 255, 255, 0.1)", color: "white" });
        gsap.to($paddingLeft, { width: "8.25rem" });
        gsap.to($paddingRight, { width: "2.25rem" });
        gsap.to($svg, { rotate: 0 });
        gsap.to($shadow, { opacity: 0 });
      });
    });
  }

  // === Regular Button Flip ===
  if (!isTouchDevice()) {
    gsap.defaults({
      duration: 0.3,
      ease: "quart.inOut",
    });

    $('.btn_flip_wrap').each(function () {
      let $btn = $(this);
      let $circle = $btn.find('.btn_flip_circle');
      let $text = $btn.find('.btn_flip_text_double');
      let $arrow = $btn.find('.btn_flip_arrow_wrap');
      let $shadow = $btn.find(".cta_btn_shadow");

      $btn.on('mouseenter', function () {
        let state = Flip.getState($circle);
        $circle.addClass('is-active');
        Flip.from(state);
        gsap.to($text, { y: -15 });
        gsap.to($arrow, { x: -24 });
        gsap.to($shadow, { opacity: 0.5 });
      });

      $btn.on('mouseleave', function () {
        let state = Flip.getState($circle);
        $circle.removeClass('is-active');
        Flip.from(state);
        gsap.to($text, { y: 2 });
        gsap.to($arrow, { x: 0 });
        gsap.to($shadow, { opacity: 0 });
      });
    });
  }

  // === Case Study Tabs ===
  function initTabSystem() {
    const wrappers = gsap.utils.toArray('[data-tabs="wrapper"]');
    wrappers.forEach((wrapper) => {
      const contentItems = wrapper.querySelectorAll('[data-tabs="content-item"]');
      const autoplay = wrapper.dataset.tabsAutoplay === "true";
      const autoplayDuration = parseInt(wrapper.dataset.tabsAutoplayDuration) || 5000;
      let activeContent = null;
      let isAnimating = false;
      let progressBarTween = null;

      function startProgressBar(index) {
        if (progressBarTween) progressBarTween.kill();
        const bar = contentItems[index].querySelector('[data-tabs="item-progress"]');
        if (!bar) return;
        gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
        progressBarTween = gsap.to(bar, {
          scaleX: 1,
          duration: autoplayDuration / 1000,
          ease: "power1.inOut",
          onComplete: () => {
            if (!isAnimating) {
              const nextIndex = (index + 1) % contentItems.length;
              switchTab(nextIndex);
            }
          },
        });
      }

      function switchTab(index) {
        if (isAnimating || contentItems[index] === activeContent) return;
        isAnimating = true;
        if (progressBarTween) progressBarTween.kill();
        const outgoingContent = activeContent;
        const outgoingBar = outgoingContent?.querySelector('[data-tabs="item-progress"]');
        const incomingContent = contentItems[index];
        const incomingBar = incomingContent.querySelector('[data-tabs="item-progress"]');
        outgoingContent?.classList.remove("active");
        incomingContent.classList.add("active");
        const tl = gsap.timeline({
          defaults: { duration: 0.65, ease: "power3" },
          onComplete: () => {
            activeContent = incomingContent;
            isAnimating = false;
            if (autoplay) startProgressBar(index);
          },
        });
        if (outgoingContent) {
          tl.set(outgoingBar, { transformOrigin: "right center" })
            .to(outgoingBar, { scaleX: 0, duration: 0.3 }, 0)
            .to(outgoingContent.querySelector('[data-tabs="item-details"]'), { height: 0 }, 0);
        }
        tl.fromTo(
          incomingContent.querySelector('[data-tabs="item-details"]'),
          { height: 0 },
          { height: "auto" },
          0
        ).set(incomingBar, { scaleX: 0, transformOrigin: "left center" }, 0);
      }

      switchTab(0);
      contentItems.forEach((item, i) =>
        item.addEventListener("click", () => {
          if (item === activeContent) return;
          switchTab(i);
        })
      );
    });
  }
  initTabSystem();

  // === FAQ Accordion ===
  gsap.utils.toArray('[data-accordion-css-init]').forEach((accordion) => {
    const closeSiblings = accordion.getAttribute('data-accordion-close-siblings') === 'true';
    accordion.addEventListener('click', (event) => {
      const toggle = event.target.closest('[data-accordion-toggle]');
      if (!toggle) return;
      const singleAccordion = toggle.closest('[data-accordion-status]');
      if (!singleAccordion) return;
      const isActive = singleAccordion.getAttribute('data-accordion-status') === 'active';
      singleAccordion.setAttribute('data-accordion-status', isActive ? 'not-active' : 'active');
      if (closeSiblings && !isActive) {
        accordion.querySelectorAll('[data-accordion-status="active"]').forEach((sibling) => {
          if (sibling !== singleAccordion) sibling.setAttribute('data-accordion-status', 'not-active');
        });
      }
    });
  });

  // === Project Process Fade ===
  const steps = gsap.utils.toArray(".steps_timeline-step");
  steps.forEach((step) => {
    const progressLine = step.querySelector(".steps_timeline_progress");
    gsap.fromTo(
      step,
      { opacity: 0 },
      {
        opacity: 1,
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: step,
          start: 'clamp(top bottom)',
          end: 'clamp(top 20%)',
          scrub: true,
        },
      }
    );
    gsap.fromTo(
      progressLine,
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: "top",
        ease: 'none',
        scrollTrigger: {
          trigger: step,
          start: 'clamp(top center)',
          end: 'clamp(bottom center)',
          scrub: true,
        },
      }
    );
  });

  // === Marquee Fade In ===
  gsap.to(".marquee-advanced", {
    opacity: 1,
    duration: 2,
    delay: 0.5,
  });

  // === Marquee Scroll Direction ===
  function initMarqueeScrollDirection() {
    gsap.utils.toArray('[data-marquee-scroll-direction-target]').forEach((marquee) => {
      const marqueeContent = marquee.querySelector('[data-marquee-collection-target]');
      const marqueeScroll = marquee.querySelector('[data-marquee-scroll-target]');
      if (!marqueeContent || !marqueeScroll) return;
      const { marqueeSpeed, marqueeDirection, marqueeDuplicate } = marquee.dataset;
      const marqueeSpeedAttr = parseFloat(marqueeSpeed) || 1;
      const marqueeDirectionAttr = marqueeDirection === 'right' ? 1 : -1;
      const duplicateAmount = parseInt(marqueeDuplicate) || 0;
      const speedMultiplier = window.innerWidth < 479 ? 0.25 : window.innerWidth < 991 ? 0.5 : 1;
      let marqueeSpeed = marqueeSpeedAttr * (marqueeContent.offsetWidth / window.innerWidth) * speedMultiplier;
      if (duplicateAmount > 0) {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < duplicateAmount; i++) {
          fragment.appendChild(marqueeContent.cloneNode(true));
        }
        marqueeScroll.appendChild(fragment);
      }
      const marqueeItems = marquee.querySelectorAll('[data-marquee-collection-target]');
      gsap.to(marqueeItems, {
        xPercent: marqueeDirectionAttr === 1 ? 100 : -100,
        repeat: -1,
        duration: marqueeSpeed,
        ease: 'linear',
        modifiers: {
          xPercent: gsap.utils.wrap(-100, 100),
        },
      });
    });
  }
  initMarqueeScrollDirection();

  // === Navbar Close ===
  $("a[href^='#']").click(function () {
    $(".w-nav-menu").removeClass("w--nav-menu-open");
    $(".w-nav-button").removeClass("w--nav-button-open");
    $(".w-nav-overlay").css("display", "none");
  });

  // === Split Text ===
  document.fonts.ready.then(() => {
    document.querySelectorAll(".statement_text").forEach((element) => {
      if (element.dataset.scriptInitialized) return;
      element.dataset.scriptInitialized = "true";
      const text = element.textContent;
      element.innerHTML = text
        .split(' ')
        .map((word) => `<span class="word">${word}</span>`)
        .join(' ');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom center",
          scrub: true,
        },
      });
      tl.from(element.querySelectorAll(".word"), {
        "--text_1_line-width": "0%",
        stagger: 0.5,
        ease: "none",
      });
    });
  });

  // === Team Hover ===
  if (!isTouchDevice()) {
    for (let i = 1; i <= 3; i++) {
      const item = document.querySelector(`#team-item-${i}`);
      item.addEventListener('mouseenter', () => {
        gsap.to(`#team-${i}`, { opacity: 1, duration: 0.3 });
      });
      item.addEventListener('mouseleave', () => {
        gsap.to(`#team-${i}`, { opacity: 0, duration: 0.3 });
      });
    }
  }

  // === Services Pinned Scroll ===
  const slides = gsap.utils.toArray('.gsap_wrap .gsap_slide');
  slides.forEach((slide) => {
    const contentWrapper = slide.querySelector('.gsap_content_wrap');
    const content = slide.querySelector('.gsap_content');
    gsap.to(content, {
      scale: 0.7,
      borderRadius: "32px",
      ease: 'none',
      scrollTrigger: {
        pin: contentWrapper,
        trigger: slide,
        start: 'clamp(top 0%)',
        end: '+=' + window.innerHeight,
        scrub: true,
      },
    });
    gsap.to(content, {
      autoAlpha: 0,
      borderRadius: "32px",
      ease: 'none',
      scrollTrigger: {
        trigger: content,
        start: 'clamp(top -80%)',
        end: '+=' + 0.2 * window.innerHeight,
        scrub: true,
      },
    });
  });

})();
