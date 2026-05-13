export type TeamMember = {
  id: string
  name: string
  role: string
  bio: string
  photo: string 
  linkedin?: string
  facebook?: string
  instagram?: string
  twitter?: string
  youtube?: string
}

export const teamMembers: TeamMember[] = [
  {
    id: "ben",
    name: "Ben Riak Changdar",
    role: "Founder & Project Lead",
    bio: "Ben founded St Stephen Tech Bridge with a vision of bridging the digital divide for displaced youth in South Sudan and Uganda. He leads the organisation's strategy, partnerships, and technology development.",
    photo: "ben-riak.jpeg",
    linkedin: "https://www.linkedin.com/in/ben-riak-changdar/",
    facebook: "#",
    instagram: "#",
    twitter: "#",
  },
  {
    id: "volunteer1",
    name: "Chuong Tiutiu Nyang",
    role: "Computer Literacy Instructor",
    bio: "Passionate about technology education and empowering youth with practical digital skills. Leads the computer literacy module across all cohorts.",
    photo: "chuong-tiutiu.jpg",
    linkedin: "https://linkedin.com/in/yourprofile",
  },
  {
    id: "volunteer2",
    name: "Nyelinga Binen Machar",
    role: "Project Manager",
    bio: "An experienced English language educator committed to helping students communicate confidently in academic and professional environments.",
    photo: "nyelinga-binen.jpg",
    linkedin: "https://linkedin.com/in/yourprofile",
  },
  {
    id: "volunteer3",
    name: "Pout Chop Jal Madeng",
    role: "Partnerships Coordinator",
    bio: "Manages the organisation's financial records, student fee tracking, and ensures transparent and accountable use of all funds.",
    photo: "pout-chop.jpeg",
    linkedin: "#",
  },
]