import TEMPLATE_ONE_IMG from "../../assets/template-one.png";
import TEMPLATE_TWO_IMG from "../../assets/template-two.png";
import TEMPLATE_THREE_IMG from "../../assets/template-three.png";

export const resumeTemplates = [
  {
    id: "01",
    theme: "01",
    thumbnailImg: TEMPLATE_ONE_IMG,
    colorPaletteCode: "themeOne",
  },
  {
    id: "02",
    theme: "02",
    thumbnailImg: TEMPLATE_TWO_IMG,
    colorPaletteCode: "themeTwo",
  },
  {
    id: "03",
    theme: "03",
    thumbnailImg: TEMPLATE_THREE_IMG,
    colorPaletteCode: "themeThree",
  },
];

export const themeColorPalette = {
  themeOne: ["#205E61", "#A1F4F4", "#E2FCEF", "#006D80", "#A45555"],
  themeTwo: ["#FFF5F5", "#F6AD55", "#FBD38D", "#E53E3E", "#9B2C2C"],
  themeThree: ["#FAF5FF", "#D6BCFA", "#B794F4", "#6B46C1", "#322659"],
  themeFour: ["#E0F7FA", "#00ACC1", "#26C6DA", "#00838F", "#006064"],
  themeFive: ["#FFF8E1", "#FFECB3", "#FFD54F", "#FFA000", "#FF6F00"],
  themeSix: ["#F3E5F5", "#CE93D8", "#AB47BC", "#8E24AA", "#4A148C"],
  themeSeven: ["#FFF3E0", "#FFB74D", "#FF9800", "#F57C00", "#E65100"],
  themeEight: ["#E8F5E9", "#A5D6A7", "#66BB6A", "#43A047", "#1B5E20"],
  themeNine: ["#FCE4EC", "#F8BBD0", "#F48FB1", "#EC407A", "#880E4F"],
  themeTen: ["#FFF", "#E4E4E4", "#CFCFCF", "#444444", "#222222"],
  themeEleven: ["#F2F2F2", "#B0C9F0", "#8DA2E4", "#1E80B5", "#0D47A1"],
};

export const EMPTY_RESUME_DATA = {
  profileInfo: {
    profileImg: null,
    previewUrl: "",
    fullName: "John Doe",
    designation: "Senior Software Engineer",
    summary:
      "Passionate and results-driven developer with 5+ years of experience building frontend applications.",
  },
  contactInfo: {
    email: "john.doe@example.com",
    phone: "+123456789",
    location: "123 Anywhere, Any City, Any Country",
    linkedin: "https://linkedin.com/in/sampleprogram",
    github: "https://github.com/sampleprogram",
    website: "https://timeacprogram.com",
  },
  workExperience: [
    {
      company: "Tech Solutions",
      role: "Senior Frontend Engineer",
      startDate: "2022-03",
      endDate: "2023-08",
      description:
        "Leading the frontend team to build scalable enterprise applications using React.",
    },
    {
      company: "InnovateX",
      role: "Frontend Developer",
      startDate: "2020-01",
      endDate: "2022-02",
      description:
        "Developed user-friendly web interfaces and optimized performance across multiple browsers.",
    },
    {
      company: "WebGenix",
      role: "Junior Web Developer",
      startDate: "2018-07",
      endDate: "2019-12",
      description:
        "Assisted in building responsive web pages using HTML, CSS, and basic JavaScript.",
    },
  ],
  education: [
    {
      degree: "M.Sc. Software Engineering",
      institution: "Tech University",
      startDate: "2021-08",
      endDate: "2023-06",
    },
    {
      degree: "B.Sc. Computer Science",
      institution: "State University",
      startDate: "2018-08",
      endDate: "2021-05",
    },
    {
      degree: "High School Diploma",
      institution: "Central High School",
      startDate: "2015-06",
      endDate: "2017-05",
    },
  ],
  skills: [
    { name: "JavaScript", progress: 95 },
    { name: "React", progress: 90 },
    { name: "Node.js", progress: 85 },
    { name: "TypeScript", progress: 88 },
    { name: "MongoDB", progress: 75 },
  ],
  projects: [
    {
      title: "Project Manager App",
      description:
        "A task and team management app built with MERN stack. Includes user roles, reminders, and drag-drop features.",
      github: "https://github.com/timeatprogram/project-manager-app",
    },
    {
      title: "E-Commerce Platform",
      description:
        "An e-commerce site built with Next.js and Stripe integration. Supports cart, orders, and payments.",
      liveDemo: "https://ecommerce-demo.timeatprogram.com",
    },
    {
      title: "Blog CMS",
      description:
        "A custom CMS for blogging using Express and React. Includes WYSIWYG editor, user auth, and tagging system.",
      github: "https://github.com/timeatprogram/blog-cms",
      liveDemo: "https://blogcms.timeatprogram.dev",
    },
  ],
  certifications: [
    {
      title: "Full Stack Web Developer",
      issuer: "Udemy",
      year: "2023",
    },
    {
      title: "React Advanced Certification",
      issuer: "Coursera",
      year: "2022",
    },
  ],
  languages: [
    { name: "English", progress: 100 },
    { name: "Spanish", progress: 70 },
    { name: "French", progress: 40 },
  ],
  interests: ["Reading", "Open Source Contribution", "Hiking"],
};
