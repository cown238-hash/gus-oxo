// ============================================
// MOTSTUDIOS - Content Configuration
// แก้ไขข้อมูลตรงนี้เพื่อปรับเนื้อหาเว็บ
// ============================================

const SITE_CONFIG = {
    // ===== ข้อมูลทั่วไป =====
    brand: {
        name: "MOTSTUDIOS",
        tagline: "Creative Studio",
        description: "MOTSTUDIOS is a creative studio specializing in music production, visual design, and digital experiences that leave lasting impressions."
    },

    // ===== สถิติ =====
    stats: [
        { value: 200, label: "Projects Done" },
        { value: 50, label: "Happy Clients" },
        { value: 5, label: "Years Experience" }
    ],

    // ===== ผลงาน =====
    works: [
        {
            category: "Music Production",
            title: "Album Production",
            gradient: ["#DC2626", "#7F1D1D"]
        },
        {
            category: "Visual Design",
            title: "Brand Identity",
            gradient: ["#991B1B", "#450A0A"]
        },
        {
            category: "Video Production",
            title: "Music Video",
            gradient: ["#7F1D1D", "#DC2626"]
        },
        {
            category: "Sound Design",
            title: "Audio Experience",
            gradient: ["#450A0A", "#991B1B"]
        }
    ],

    // ===== บริการ =====
    services: [
        {
            icon: "music",
            title: "Music Production",
            description: "Professional beat making, composition, and production for artists and brands.",
            features: ["Custom Beats", "Arrangement", "Sound Design"],
            featured: false
        },
        {
            icon: "mic",
            title: "Mixing & Mastering",
            description: "Studio-quality mixing and mastering to make your tracks sound professional.",
            features: ["Studio Quality", "All Platforms", "Fast Delivery"],
            featured: true
        },
        {
            icon: "camera",
            title: "Visual Design",
            description: "Album covers, branding, and visual content that stands out.",
            features: ["Album Covers", "Brand Identity", "Social Media"],
            featured: false
        },
        {
            icon: "video",
            title: "Video Production",
            description: "Music videos, promotional content, and visual storytelling.",
            features: ["Music Videos", "Promotional Content", "Visual Effects"],
            featured: false
        }
    ],

    // ===== ทักษะ =====
    skills: [
        { name: "Music Production", percent: 95 },
        { name: "Visual Design", percent: 90 },
        { name: "Video Production", percent: 85 }
    ],

    // ===== ข้อมูลติดต่อ =====
    contact: {
        email: "contact@motstudios.com",
        location: "Los Angeles, CA",
        responseTime: "Within 24 hours"
    },

    // ===== โซเชียลมีเดีย =====
    socials: [
        { name: "Instagram", url: "#" },
        { name: "YouTube", url: "#" },
        { name: "Spotify", url: "#" },
        { name: "TikTok", url: "#" }
    ],

    // ===== ข้อความ About =====
    about: {
        title: "The Team Behind MOTSTUDIOS",
        paragraphs: [
            "MOTSTUDIOS was founded with a passion for creating exceptional content. We believe in pushing creative boundaries and delivering work that exceeds expectations.",
            "Our team combines technical expertise with artistic vision to produce results that resonate with audiences and elevate brands."
        ]
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SITE_CONFIG;
}
