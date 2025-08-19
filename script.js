// Complete Restaurant Website JavaScript - Fixed Version
// Combines all functionality without scroll blocking issues

class GalleryManager {
  constructor() {
    this.boxContainer = document.getElementById("boxContainer");
    this.seeMoreBtn = document.getElementById("see-more-btn");
    this.seeLessBtn = document.getElementById("see-less-btn");
    this.categoryBtns = document.querySelectorAll(".category-btn");
    this.currentCategory = "all";
    this.itemsPerLoad = 8;
    this.currentVisibleCount = 8;
    this.isExpanded = false;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateVisibility();
    this.setupScrollAnimations();
    this.animateInitialItems();
  }

  setupEventListeners() {
    // See More/Less buttons
    if (this.seeMoreBtn) {
      this.seeMoreBtn.addEventListener("click", () => this.toggleMoreItems());
    }
    if (this.seeLessBtn) {
      this.seeLessBtn.addEventListener("click", () => this.showLess());
    }

    // Category filter buttons
    this.categoryBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.filterByCategory(e.target.dataset.category);
        this.setActiveCategory(e.target);
      });
    });

    // IMPORTANT: Use passive event listeners to avoid blocking scroll
    document.addEventListener("wheel", (e) => {
      // Don't prevent default - allow natural scrolling
    }, { passive: true });

    document.addEventListener("touchmove", (e) => {
      // Don't prevent default - allow natural scrolling
    }, { passive: true });
  }

  getAllBoxes() {
    return Array.from(this.boxContainer?.querySelectorAll(".box") || []);
  }

  getVisibleBoxes() {
    return this.getAllBoxes().filter(
      (box) =>
        this.currentCategory === "all" ||
        box.dataset.category === this.currentCategory
    );
  }

  toggleMoreItems() {
    if (!this.isExpanded) {
      this.showMoreItems();
    } else {
      this.hideMoreItems();
    }
  }

  showMoreItems() {
    const visibleBoxes = this.getVisibleBoxes();
    const totalVisible = visibleBoxes.length;

    if (this.currentVisibleCount < totalVisible) {
      this.currentVisibleCount = Math.min(
        this.currentVisibleCount + this.itemsPerLoad,
        totalVisible
      );
      
      this.updateVisibility();
      
      // Update button text
      if (this.seeMoreBtn) {
        if (this.currentVisibleCount >= totalVisible) {
          this.seeMoreBtn.innerHTML = 'Show Less <span class="arrow">↑</span>';
          this.isExpanded = true;
        }
      }
    }
  }

  hideMoreItems() {
    this.currentVisibleCount = this.itemsPerLoad;
    this.isExpanded = false;
    this.updateVisibility();
    
    // Update button text
    if (this.seeMoreBtn) {
      this.seeMoreBtn.innerHTML = 'See More Items <span class="arrow">→</span>';
    }

    // Smooth scroll to top of gallery
    const gallery = document.getElementById("gallery");
    if (gallery) {
      gallery.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }

  showLess() {
    this.hideMoreItems();
  }

  filterByCategory(category) {
    this.currentCategory = category;
    this.currentVisibleCount = this.itemsPerLoad;
    this.isExpanded = false;
    this.updateVisibility();
    
    // Reset button text
    if (this.seeMoreBtn) {
      this.seeMoreBtn.innerHTML = 'See More Items <span class="arrow">→</span>';
    }
  }

  setActiveCategory(activeBtn) {
    this.categoryBtns.forEach((btn) => btn.classList.remove("active"));
    activeBtn.classList.add("active");
  }

  updateVisibility() {
    const allBoxes = this.getAllBoxes();
    const visibleBoxes = this.getVisibleBoxes();

    // Hide all boxes first
    allBoxes.forEach((box, index) => {
      if (index >= this.currentVisibleCount || !visibleBoxes.includes(box)) {
        box.classList.add("hidden");
        box.style.animation = "none";
      }
    });

    // Show relevant boxes with animation
    visibleBoxes.forEach((box, index) => {
      if (index < this.currentVisibleCount) {
        setTimeout(() => {
          box.classList.remove("hidden");
          box.style.animation = `fadeInUp 0.6s ease forwards`;
          box.style.animationDelay = `${index * 0.1}s`;
        }, 50);
      }
    });

    // Update button states
    this.updateButtonStates();
  }

  updateButtonStates() {
    const visibleBoxes = this.getVisibleBoxes();
    const totalVisible = visibleBoxes.length;

    // Show/hide See More button
    if (this.seeMoreBtn) {
      if (this.currentVisibleCount >= totalVisible) {
        if (!this.isExpanded) {
          this.seeMoreBtn.style.display = "none";
        } else {
          this.seeMoreBtn.innerHTML = 'Show Less <span class="arrow">↑</span>';
        }
      } else {
        this.seeMoreBtn.style.display = "flex";
        this.seeMoreBtn.innerHTML = 'See More Items <span class="arrow">→</span>';
      }
    }

    // Show/hide See Less button (if separate)
    if (this.seeLessBtn) {
      if (this.currentVisibleCount > this.itemsPerLoad) {
        this.seeLessBtn.style.display = "flex";
      } else {
        this.seeLessBtn.style.display = "none";
      }
    }
  }

  hasMoreItemsForCategory(category, currentlyShown) {
    const allBoxes = this.getAllBoxes();
    let count = 0;

    allBoxes.forEach((box) => {
      const boxCategory = box.dataset.category;
      if (category === "all" || boxCategory === category) {
        count++;
      }
    });

    return count > currentlyShown;
  }

  animateInitialItems() {
    const initialBoxes = this.getAllBoxes().slice(0, this.itemsPerLoad);
    initialBoxes.forEach((box, index) => {
      setTimeout(() => {
        box.classList.add("visible");
      }, index * 150);
    });
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll(".fade-in").forEach((el) => {
      observer.observe(el);
    });
  }
}

// Main Website Functionality Class
class RestaurantWebsite {
  constructor() {
    this.init();
  }

  init() {
    this.setupMenuToggle();
    this.setupSmoothScrolling();
    this.setupScrollEffects();
    this.setupFormHandling();
    this.setupInteractiveEffects();
    this.setupLoader();
  }

  setupMenuToggle() {
    const menuBar = document.getElementById("menu-bar");
    const navbar = document.querySelector(".navbar");

    if (menuBar && navbar) {
      menuBar.addEventListener("click", () => {
        navbar.classList.toggle("active");
      });

      // Close menu when clicking on links
      document.querySelectorAll(".navbar a").forEach((link) => {
        link.addEventListener("click", () => {
          navbar.classList.remove("active");
        });
      });
    }
  }

  setupSmoothScrolling() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  setupScrollEffects() {
    // Scroll to top button
    const scrollTop = document.getElementById("scroll-top");
    if (scrollTop) {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
          scrollTop.style.display = "grid";
        } else {
          scrollTop.style.display = "none";
        }
      });
    }

    // Navbar scroll effect
    window.addEventListener("scroll", () => {
      const header = document.querySelector("header");
      if (header) {
        if (window.scrollY > 100) {
          header.style.background =
            "linear-gradient(180deg, rgba(255,255,255,.98), rgba(255,255,255,.95))";
          header.style.boxShadow = "0 4px 20px rgba(0,0,0,.1)";
        } else {
          header.style.background =
            "linear-gradient(180deg, rgba(255,255,255,.95), rgba(255,255,255,.85))";
          header.style.boxShadow = "none";
        }
      }
    });
  }

  setupFormHandling() {
    // Form submission
    const form = document.querySelector("form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Thank you for your order! We will contact you soon.");
      });
    }

    // Handle order button clicks
    document.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("btn") &&
        e.target.getAttribute("href") === "#order"
      ) {
        e.preventDefault();
        const orderSection = document.getElementById("order");
        if (orderSection) {
          orderSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  }

  setupInteractiveEffects() {
    // Add hover effects to boxes
    document.querySelectorAll(".box").forEach((box) => {
      box.addEventListener("mouseenter", () => {
        box.style.transform = "translateY(-8px) rotateX(5deg)";
        box.style.transition = "transform 0.3s ease";
      });

      box.addEventListener("mouseleave", () => {
        box.style.transform = "translateY(0) rotateX(0)";
      });
    });
  }

  setupLoader() {
    window.addEventListener("load", () => {
      const loader = document.querySelector(".loader-container");
      if (loader) {
        loader.style.opacity = "0";
        setTimeout(() => {
          loader.style.display = "none";
        }, 500);
      }

      // Add fade-in class to elements
      document.querySelectorAll(".fade-in").forEach((el) => {
        el.style.opacity = "1";
      });
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize main website functionality
  new RestaurantWebsite();
  
  // Initialize gallery manager
  new GalleryManager();

  // Prevent horizontal body scroll issues
  document.body.style.overflowX = "hidden";
  document.documentElement.style.overflowX = "hidden";
});

// Export classes for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GalleryManager, RestaurantWebsite };
} else {
  window.GalleryManager = GalleryManager;
  window.RestaurantWebsite = RestaurantWebsite;
}