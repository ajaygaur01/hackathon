// src/pages/index.tsx
import React, { useState, useEffect } from "react";
import Head from "next/head";
import CourseCard from "./Components/CourseCard";
import Filter from "./Components/Filter";
import AiAssistantButton from "./Components/AiAssitantButton";


export const Page = () => {
  const [allHackathons, setAllHackathons] = useState<Hackathon[]>([]);
  const [filteredHackathons, setFilteredHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [displayCount, setDisplayCount] = useState(10);

  // Add filter states
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [virtualFilter, setVirtualFilter] = useState<boolean | null>(null);
  const [hybridFilter, setHybridFilter] = useState<boolean | null>(null);

  // Sample data
  const hackathons = [
    {
      id: "36JI6A",
      name: "HSHacks",
      website: "https://hshacks.org",
      start: "2025-04-12T13:00:00.000Z",
      end: "2025-04-13T01:00:00.000Z",
      createdAt: "2025-03-27T01:38:35.012Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDUxOSwicHVyIjoiYmxvYl9pZCJ9fQ==--f82b64e6457bc015fa8b861e12a8e75059ba3f84/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/HSHacks%20Logo.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDUyMCwicHVyIjoiYmxvYl9pZCJ9fQ==--5430748c8eaf02c961f2a0d7e54305b54c019eba/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/HSHacks%20Banner.png",
      city: "Arlington Heights",
      state: "Illinois",
      country: "United States",
      countryCode: "US",
      latitude: 42.104026783306,
      longitude: -87.959108123537,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "pmyIwD",
      name: "AdventureX 2025",
      website: "https://adventure-x.org",
      start: "2025-07-23T02:00:00.000Z",
      end: "2025-07-27T15:30:00.000Z",
      createdAt: "2025-03-27T00:00:59.814Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDUxNywicHVyIjoiYmxvYl9pZCJ9fQ==--f4b78a4bbfd1f3777371b1f19a7814648c522b13/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/framer.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDUxOCwicHVyIjoiYmxvYl9pZCJ9fQ==--7cc36c96360a8b663110799f38419cc11d3a7912/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/%E5%A4%A78.png",
      city: "Hangzhou",
      state: "Chekiang Province",
      country: "China",
      countryCode: "CN",
      latitude: 30.29365,
      longitude: 120.16142,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: true,
    },
    {
      id: "01xIj2",
      name: "Codaru",
      website: "https://codaru.org",
      start: "2025-04-14T04:00:00.000Z",
      end: "2025-05-21T04:00:00.000Z",
      createdAt: "2025-03-26T17:18:46.209Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDUxMiwicHVyIjoiYmxvYl9pZCJ9fQ==--ed74ebaa8983b9d2cfc1b07beefe76cff726615f/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/Component%2022.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDUyMywicHVyIjoiYmxvYl9pZCJ9fQ==--4bab99b6cf6766ad063c328ba16f37e718f0cf8b/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/banner-good.png",
      city: null,
      state: null,
      country: null,
      countryCode: null,
      latitude: null,
      longitude: null,
      virtual: true,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "pllI62",
      name: "FutureHacks 7",
      website: "https://futurehacks.net",
      start: "2025-04-18T00:00:00.000Z",
      end: "2025-04-20T23:00:00.000Z",
      createdAt: "2025-03-19T16:13:59.959Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDUwMCwicHVyIjoiYmxvYl9pZCJ9fQ==--5b46171ca7dee5b7cc18db57345775d026938485/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/FH7_Small_Logo-removebg-preview.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDU0MywicHVyIjoiYmxvYl9pZCJ9fQ==--74189b759a3957f9d97a4067c9f46884bc04357b/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/FH7_Banner.png",
      city: null,
      state: null,
      country: null,
      countryCode: null,
      latitude: null,
      longitude: null,
      virtual: true,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "3zvImb",
      name: "Hack the Nest",
      website: "https://www.hackthenest.org/",
      start: "2025-04-05T13:00:00.000Z",
      end: "2025-04-06T17:00:00.000Z",
      createdAt: "2025-03-08T20:27:04.904Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDQ2NCwicHVyIjoiYmxvYl9pZCJ9fQ==--63ac931e54c966cff0b61de4ca3cdf38b13b684d/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/Hack%20the%20Nest%20Logo%20Colored.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDQ2NSwicHVyIjoiYmxvYl9pZCJ9fQ==--d6897a9750ecde3d91002a877f292b426fd952a2/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/Banner%20Background.png",
      city: "Vienna",
      state: "Virginia",
      country: "United States",
      countryCode: "US",
      latitude: 38.912024339154,
      longitude: -77.222328110236,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "rbQIPd",
      name: "Warrior Hacks",
      website: "https://warriorhacks.org",
      start: "2025-04-13T09:00:00.000Z",
      end: "2025-04-13T21:00:00.000Z",
      createdAt: "2025-03-04T23:07:08.836Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDQ2OCwicHVyIjoiYmxvYl9pZCJ9fQ==--ee162c90479f7916102810844bcebc73a2182646/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/warriorhacksfilled.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDQ3MCwicHVyIjoiYmxvYl9pZCJ9fQ==--737adba6d69139f332752e7e30084f4a88936605/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/hackers.png",
      city: "Fremont",
      state: "California",
      country: "United States",
      countryCode: "US",
      latitude: 37.544713265982,
      longitude: -121.935428242169,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "0QMILv",
      name: "Los Altos Hacks",
      website: "https://www.losaltoshacks.com/",
      start: "2025-04-05T08:30:00.000Z",
      end: "2025-04-06T12:00:00.000Z",
      createdAt: "2025-03-04T05:47:00.448Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDQ1OCwicHVyIjoiYmxvYl9pZCJ9fQ==--53bf143980e6fbae7f48b8bcd177c175d1fbfa35/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/logo.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDQ1OSwicHVyIjoiYmxvYl9pZCJ9fQ==--a109e9cfc4707d315c0f7938e06b5056d2bcafa9/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/backdrop.png",
      city: "Sunnyvale",
      state: "California",
      country: "United States",
      countryCode: "US",
      latitude: 37.41087505939,
      longitude: -122.031176901437,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "rD1I8X",
      name: "EurekaHacks",
      website: "https://eurekahacks.ca",
      start: "2025-04-05T13:00:00.000Z",
      end: "2025-04-06T03:00:00.000Z",
      createdAt: "2025-03-03T22:51:05.968Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDQ1NCwicHVyIjoiYmxvYl9pZCJ9fQ==--6cc501cbfe6045f66f835aa4704fd3f5fbbe4941/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/EurekaIcon2024%20(1).png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDQ1NSwicHVyIjoiYmxvYl9pZCJ9fQ==--20d236ae8790f01a2480b5aad161d032b53c22b0/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/DARKWebsiteMainPhoto2024.png",
      city: "Oakville",
      state: "Ontario",
      country: "Canada",
      countryCode: "CA",
      latitude: 43.436557400709,
      longitude: -79.735700702172,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "3KNI41",
      name: "Blu's Hacks 2025",
      website: "https://blushacks.org/",
      start: "2025-03-23T15:00:00.000Z",
      end: "2025-03-24T04:00:00.000Z",
      createdAt: "2025-02-22T23:00:45.511Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDQ0NCwicHVyIjoiYmxvYl9pZCJ9fQ==--c96ace63f1e4720d4a2e29276efd8b4abecc93de/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/Blus_Hacks_2024_1.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDQ0NSwicHVyIjoiYmxvYl9pZCJ9fQ==--32928f4e0c9b64dc8791c4f202a65dd608462714/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGVnIiwicmVzaXplX3RvX2xpbWl0IjpbMTkyMCwxMDgwXX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--6696b5b4ae62e9942d9b6d207dd4968bc47aaf80/unnamed3.jpeg",
      city: "San Jose",
      state: "California",
      country: "United States",
      countryCode: "US",
      latitude: 37.253577414552,
      longitude: -121.898833188181,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "3dzIoG",
      name: "HacKnight",
      website: "https://hacknight.co",
      start: "2025-05-31T14:00:00.000Z",
      end: "2025-06-01T22:30:00.000Z",
      createdAt: "2025-02-19T21:59:14.364Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDQzMCwicHVyIjoiYmxvYl9pZCJ9fQ==--adfe3638dc395e16161e9fe2264dc957fa119190/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/hacknight.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDQzMSwicHVyIjoiYmxvYl9pZCJ9fQ==--ebe984cecba63646f59e80f14016f7322a4dc49a/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/Screenshot%202025-02-19%20at%204.57.32%E2%80%AFPM.png",
      city: "Cambridge",
      state: "Massachusetts",
      country: "United States",
      countryCode: "US",
      latitude: 42.37165642547,
      longitude: -71.135834432736,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "3aDIq8",
      name: "vsHacks",
      website: "https://vshacks.github.io/",
      start: "2025-06-21T11:00:00.000Z",
      end: "2025-06-22T18:00:00.000Z",
      createdAt: "2025-02-19T20:52:38.740Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDQyOCwicHVyIjoiYmxvYl9pZCJ9fQ==--cbbfb24acbe22c8f6cdc4b7f600c43a8f7f24546/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJ3ZWJwIiwicmVzaXplX3RvX2xpbWl0IjpbMTI4LDEyOF19LCJwdXIiOiJ2YXJpYXRpb24ifX0=--a686d78007605c5872c1fba506536ea754ff5af9/original.webp",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDQyOSwicHVyIjoiYmxvYl9pZCJ9fQ==--36e899e52245b57da4d642353399491d9de1e6da/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/Screenshot%202025-02-19%20at%2012.45.20%E2%80%AFPM.png",
      city: "Vancouver",
      state: "British Columbia",
      country: "Canada",
      countryCode: "CA",
      latitude: 49.254271816115,
      longitude: -123.238778814319,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "rg2IRD",
      name: "Submersion",
      website: "https://submersion.dev/",
      start: "2025-07-08T16:00:00.000Z",
      end: "2025-07-12T16:00:00.000Z",
      createdAt: "2025-02-14T20:29:17.752Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDQyMCwicHVyIjoiYmxvYl9pZCJ9fQ==--b1fc38bafe3c9d4c995c7adb71aef2ae312e2da4/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/logo.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDQxOCwicHVyIjoiYmxvYl9pZCJ9fQ==--2936b67cd01f5c47f31b89f8a2e0845f065c3228/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/banner.png",
      city: "Lakeport",
      state: "California",
      country: "United States",
      countryCode: "US",
      latitude: 39.049962386729,
      longitude: -122.917326706508,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "3GnIL2",
      name: "Viking Hacks",
      website: "https://www.vikinghacks.com/",
      start: "2025-02-15T16:00:00.000Z",
      end: "2025-02-16T05:00:00.000Z",
      createdAt: "2025-01-24T03:34:05.927Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDM3NCwicHVyIjoiYmxvYl9pZCJ9fQ==--39e2fbf7c1d29d0159666386a7a415582167254c/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/v_logo_fit.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDM3NSwicHVyIjoiYmxvYl9pZCJ9fQ==--a75cc938ab9cfc54c3372fee130577a6e7d7ce38/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--797f7952fb61db955e058b888e66d8ecb495e15b/Irvington-HS_photo.jpg",
      city: "Fremont",
      state: "California",
      country: "United States",
      countryCode: "US",
      latitude: 37.524887089396,
      longitude: -121.967702844165,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "3aDIqA",
      name: "Hackabyte’s 2025 Winter Hackathon",
      website: "https://www.hackabyte.org/hackathons",
      start: "2025-02-08T08:00:00.000Z",
      end: "2025-02-09T20:00:00.000Z",
      createdAt: "2025-01-11T07:10:43.192Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDM2NSwicHVyIjoiYmxvYl9pZCJ9fQ==--24aa7442814dc2e32cb76703dee67cab5ced853a/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/Logo-background-smaller.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDM2NiwicHVyIjoiYmxvYl9pZCJ9fQ==--2a38fd679be0c66752d014c08554e9c69125d92e/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGVnIiwicmVzaXplX3RvX2xpbWl0IjpbMTkyMCwxMDgwXX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--6696b5b4ae62e9942d9b6d207dd4968bc47aaf80/IMG_1865.jpeg",
      city: "Fremont",
      state: "California",
      country: "United States",
      countryCode: "US",
      latitude: 37.55134438211,
      longitude: -121.971867515432,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "r8QIwL",
      name: "LG Hacks",
      website: "https://lghacks.com/",
      start: "2025-03-22T16:00:00.000Z",
      end: "2025-03-23T06:00:00.000Z",
      createdAt: "2025-01-03T01:02:56.014Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDM0MCwicHVyIjoiYmxvYl9pZCJ9fQ==--752704cc6c57228a9a64b4d4b8c8baa9f81f755f/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/logo.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDM0MSwicHVyIjoiYmxvYl9pZCJ9fQ==--63ef4514e550a6f92318d98e8d596b7646628094/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--797f7952fb61db955e058b888e66d8ecb495e15b/code.jpg",
      city: "San Jose",
      state: "California",
      country: "United States",
      countryCode: "US",
      latitude: 37.241849832815,
      longitude: -121.919542775452,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "r9bI9G",
      name: "MakerHacks",
      website: "https://www.makerhacks.org/",
      start: "2025-02-01T17:30:00.000Z",
      end: "2025-02-02T13:00:00.000Z",
      createdAt: "2025-01-02T09:17:46.992Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDMzOCwicHVyIjoiYmxvYl9pZCJ9fQ==--c9797c7b57735f9ba5ab2234c713fce7f3abdae3/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/Screenshot%202024-12-27%20022345.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDMzOSwicHVyIjoiYmxvYl9pZCJ9fQ==--1253603dab77fdbc07ae116d960b72da0401b2b5/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--797f7952fb61db955e058b888e66d8ecb495e15b/45Fremont_fromMarketSt.jpg",
      city: "San Francisco",
      state: "California",
      country: "United States",
      countryCode: "US",
      latitude: 37.791242011726,
      longitude: -122.397132973372,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "0PvI45",
      name: "HackaScience",
      website: "https://hacka.science",
      start: "2025-02-20T08:00:00.000Z",
      end: "2025-02-20T22:00:00.000Z",
      createdAt: "2024-12-28T21:59:34.103Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDMzMSwicHVyIjoiYmxvYl9pZCJ9fQ==--72c4247dcebba29e66bfee28e195313eb9c3d9bf/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/CS_Club_logo-removebg-preview.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDM0OSwicHVyIjoiYmxvYl9pZCJ9fQ==--085d550a13fc9df19ff7d879b065f8219bfba775/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/Zoom%20Background.png",
      city: "Madīnat Sittah Uktūbar",
      state: "Al Jīzah",
      country: "Egypt",
      countryCode: "EG",
      latitude: 29.81667,
      longitude: 31.05,
      virtual: false,
      hybrid: true,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "0qnIVg",
      name: "United Hacks V4",
      website: "https://unitedhacks.hackunited.org/",
      start: "2025-01-17T01:03:00.000Z",
      end: "2025-01-19T12:04:00.000Z",
      createdAt: "2024-12-27T23:05:31.197Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDMxOCwicHVyIjoiYmxvYl9pZCJ9fQ==--8b1731be78dcc88f396b256ccdab0c4014929a4d/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/Hack%20United%204.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDMxOSwicHVyIjoiYmxvYl9pZCJ9fQ==--3979cf45dc454848acc33513fc2692f39905428a/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/blue-sky-with-altostratus-clouds-background-vector-cartoon-sky-with-cirrus-clouds-concept-all-seasonal-horizon-banner-sunny-day-spring-summer-morning-horizon-four-seasons-background_39190-1131.avif",
      city: null,
      state: null,
      country: null,
      countryCode: null,
      latitude: null,
      longitude: null,
      virtual: true,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "pO7I4w",
      name: "TeenHacks LI",
      website: "https://teenhacksli.com/",
      start: "2025-01-11T13:00:00.000Z",
      end: "2025-01-12T01:00:00.000Z",
      createdAt: "2024-12-27T04:13:36.257Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDMxNiwicHVyIjoiYmxvYl9pZCJ9fQ==--327ebee3d9029c3622880179fcd0cc3bd7c54c6a/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/Copy%20of%20TH(1).png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDMzNCwicHVyIjoiYmxvYl9pZCJ9fQ==--a09b25b523baba381ad3780b3acc4e0b3a755acb/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--797f7952fb61db955e058b888e66d8ecb495e15b/banner_opt1.jpg",
      city: "Garden City",
      state: "New York",
      country: "United States",
      countryCode: "US",
      latitude: 40.73420813807,
      longitude: -73.604838593679,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "reEIgA",
      name: "Random Forest Hackathon",
      website: "https://www.randomforesthacks.com/",
      start: "2025-01-05T08:00:00.000Z",
      end: "2025-01-05T18:00:00.000Z",
      createdAt: "2024-12-01T03:57:12.995Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDI5NywicHVyIjoiYmxvYl9pZCJ9fQ==--9c04a0ad3abb6ba2aad86985636402d89562f0db/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGVnIiwicmVzaXplX3RvX2xpbWl0IjpbMTI4LDEyOF19LCJwdXIiOiJ2YXJpYXRpb24ifX0=--f9d35c5c175a8e3930dd9006c11dc3da4e8961b4/RandomForestHackathon_Logo.jpeg",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDI5OCwicHVyIjoiYmxvYl9pZCJ9fQ==--6356aa2829e515b4e6f20226ccbf5e078ae68d50/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/Banner_Image.png",
      city: "Pleasanton",
      state: "California",
      country: "United States",
      countryCode: "US",
      latitude: 37.686117984208,
      longitude: -121.893773033234,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "pMkI4P",
      name: "Hack Noel",
      website: "https://www.hacknoel.live/",
      start: "2024-12-16T08:00:00.000Z",
      end: "2024-12-16T19:00:00.000Z",
      createdAt: "2024-11-29T09:44:43.289Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDI5MiwicHVyIjoiYmxvYl9pZCJ9fQ==--f08b465ffcd2c9cb6b66d17bab3b6b9b6de5aa76/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/Logo.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDI5MywicHVyIjoiYmxvYl9pZCJ9fQ==--955acf97d9df098c750ab8cb5a3ddbd8f3e3402c/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/youthcodecampbanner%20(1).png",
      city: "Kacyiru",
      state: "Kigali City",
      country: "Rwanda",
      countryCode: "RW",
      latitude: -1.9326845,
      longitude: 30.0782896,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "pvLIjD",
      name: "Boston For Stem Hackathon",
      website: "https://www.bostonforstem.org/hack",
      start: "2024-12-29T13:30:00.000Z",
      end: "2024-12-29T21:30:00.000Z",
      createdAt: "2024-11-29T02:28:06.118Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDI5MCwicHVyIjoiYmxvYl9pZCJ9fQ==--7fad4d645584088d93dd047fde8968beb184c9b3/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/34953194891.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDI5MSwicHVyIjoiYmxvYl9pZCJ9fQ==--eac6f0f76c708da8ac33d02846e0fa182c329d60/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGVnIiwicmVzaXplX3RvX2xpbWl0IjpbMTkyMCwxMDgwXX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--6696b5b4ae62e9942d9b6d207dd4968bc47aaf80/pixel_art_city_dark_black_nigh.jpeg",
      city: "Brighton",
      state: "Massachusetts",
      country: "United States",
      countryCode: "US",
      latitude: 42.350699320599,
      longitude: -71.169196251393,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "0omIzw",
      name: "Wes:Hack",
      website: "https://weshack.me",
      start: "2024-12-13T04:30:00.000Z",
      end: "2024-12-14T12:30:00.000Z",
      createdAt: "2024-11-22T16:33:23.805Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDI4MSwicHVyIjoiYmxvYl9pZCJ9fQ==--130d586ced4253bab4107fc14f3e44dd49428321/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/logo.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDI4MiwicHVyIjoiYmxvYl9pZCJ9fQ==--870067bc69cf903ff0007cbd985b1211e7adc792/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/WESHACK%2024.png",
      city: "Sharjah City",
      state: "Sharjah",
      country: "United Arab Emirates",
      countryCode: "AE",
      latitude: 25.277706463177,
      longitude: 55.515954824515,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "3kjIoq",
      name: "Mill Hacks",
      website: "https://millhacks.com/",
      start: "2024-11-30T14:00:00.000Z",
      end: "2024-12-01T02:00:00.000Z",
      createdAt: "2024-11-20T13:22:15.696Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDI3MiwicHVyIjoiYmxvYl9pZCJ9fQ==--da90adbff5f1698a11741dfa1baedf83f76d887f/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJQTkciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--4be612df813dee8523fd2876c041e9871befabab/logo.PNG",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDI3MywicHVyIjoiYmxvYl9pZCJ9fQ==--7ebb25dc57ecb54ed763cd361f5e8fe68061ee5f/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/Copy%20of%20Mill%20Hacks%20Designs%20(1).png",
      city: "Milton",
      state: "Ontario",
      country: "Canada",
      countryCode: "CA",
      latitude: 43.506099913971,
      longitude: -79.870567284464,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "3LLILE",
      name: "BISV Hacks",
      website: "https://bisvhacks.com",
      start: "2025-03-01T16:00:00.000Z",
      end: "2025-03-01T23:59:00.000Z",
      createdAt: "2024-11-15T01:58:43.743Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDI2OSwicHVyIjoiYmxvYl9pZCJ9fQ==--a39ff3ded30a719333bd54e6b7f877bdcc39801c/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/newpic.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDI3MCwicHVyIjoiYmxvYl9pZCJ9fQ==--ce33d0de56b8e39d63249bfd5ae01ce4f6c0cba0/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--797f7952fb61db955e058b888e66d8ecb495e15b/banner_img.jpg",
      city: "San Jose",
      state: "California",
      country: "United States",
      countryCode: "US",
      latitude: 37.316159008684,
      longitude: -121.910070973407,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "r5KI97",
      name: "CrabHacks",
      website: "https://crabhacks.org",
      start: "2024-12-01T09:00:00.000Z",
      end: "2024-12-01T19:00:00.000Z",
      createdAt: "2024-11-03T20:30:58.309Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDI1NCwicHVyIjoiYmxvYl9pZCJ9fQ==--d81824b3837d92bdf1cc965761efc486265d9995/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/crab.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDI1NSwicHVyIjoiYmxvYl9pZCJ9fQ==--a29ff3095d73d9979d7f7fb1d302ac2d7c077918/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--797f7952fb61db955e058b888e66d8ecb495e15b/White%20Dome%20Building%20Night%20Photo.jpg",
      city: "Bethesda",
      state: "Maryland",
      country: "United States",
      countryCode: "US",
      latitude: 38.94997001111,
      longitude: -77.119574023932,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "3X9IRj",
      name: "MindTheGap Challenge",
      website: "https://mtgchallenge.org",
      start: "2025-03-14T10:30:00.000Z",
      end: "2025-04-16T19:00:00.000Z",
      createdAt: "2024-10-28T11:29:57.172Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDI0MiwicHVyIjoiYmxvYl9pZCJ9fQ==--aefb6ce35a5aa918ff8cb2cca500be8e46225f5f/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/icon.svg.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDI0MywicHVyIjoiYmxvYl9pZCJ9fQ==--df185b5216fb387954d4c166373e423fbe626072/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--797f7952fb61db955e058b888e66d8ecb495e15b/screen10.jpg",
      city: "",
      state: "",
      country: null,
      countryCode: "",
      latitude: null,
      longitude: null,
      virtual: false,
      hybrid: true,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "pllIbQ",
      name: "BobaByte",
      website: "https://bobabyte.org",
      start: "2024-10-26T13:00:00.000Z",
      end: "2024-10-26T21:00:00.000Z",
      createdAt: "2024-10-21T18:12:51.045Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDIxNywicHVyIjoiYmxvYl9pZCJ9fQ==--044e3ad270ab9e2a688a5bfdbe928619d6852913/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/logo%20(2).png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDIxOCwicHVyIjoiYmxvYl9pZCJ9fQ==--d579f345635e0967179caffa17bb0f758eb0c2c5/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/bobabyte%20banner%20(2).png",
      city: "Dorchester",
      state: "Massachusetts",
      country: "United States",
      countryCode: "US",
      latitude: 42.286379026382,
      longitude: -71.05445067913,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "rjZI1w",
      name: "Hack The Ridge",
      website: "https://hacktheridge.ca",
      start: "2024-12-14T12:00:00.000Z",
      end: "2024-12-15T00:00:00.000Z",
      createdAt: "2024-10-14T22:20:05.976Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDIwMiwicHVyIjoiYmxvYl9pZCJ9fQ==--e139288ac43e018c180d093ce89d70c53a875af2/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/HTR_Logo%20(1).png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDI0OSwicHVyIjoiYmxvYl9pZCJ9fQ==--4ad5ea29ae0ca267347b0e91382d6ed7b6ff3f4b/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/image%20(1).png",
      city: "Oakville",
      state: "Ontario",
      country: "Canada",
      countryCode: "CA",
      latitude: 43.488956114039,
      longitude: -79.69805070185,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "r2RIDZ",
      name: "LazyHacks",
      website: "https://www.lazyhacks.ca/",
      start: "2024-12-07T08:00:00.000Z",
      end: "2024-12-07T23:00:00.000Z",
      createdAt: "2024-10-03T00:25:53.533Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDE5MSwicHVyIjoiYmxvYl9pZCJ9fQ==--b2809e8848a37a80a3a40bf052bdcbaf85e7da78/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/2.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDE4MiwicHVyIjoiYmxvYl9pZCJ9fQ==--b8875dfb91ad693d25d516ac7a85e8a8ef6b99fd/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/banner.png",
      city: "Gloucester",
      state: "Ontario",
      country: "Canada",
      countryCode: "CA",
      latitude: 45.315462292785,
      longitude: -75.614208018228,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "rD1IqZ",
      name: "Devil Hack 1.01",
      website: "https://www.d121.org/Page/408",
      start: "2018-01-26T19:00:00.000Z",
      end: "2018-01-27T19:00:00.000Z",
      createdAt: "2020-02-23T20:57:46.000Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDI2LCJwdXIiOiJibG9iX2lkIn19--51e708264902917032c86294c9adf919f6b24df0/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--58e36ae2e45952aecf9cf71735396abeb9897d87/logo.jpg",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDI3LCJwdXIiOiJibG9iX2lkIn19--16ee6e6f9c06e4b3d3695294a20a6f6862db8191/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--797f7952fb61db955e058b888e66d8ecb495e15b/banner.jpg",
      city: "Gurnee",
      state: "Illinois",
      country: "United States",
      countryCode: "US",
      latitude: 42.3702996,
      longitude: -87.9020186,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "3J5I2q",
      name: "QuHacks",
      website: "http://quhacks.tech/",
      start: "2018-12-08T00:00:00.000Z",
      end: "2018-12-08T00:00:00.000Z",
      createdAt: "2020-02-23T20:57:46.000Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDI0LCJwdXIiOiJibG9iX2lkIn19--43e62564bd9cd54e3dd8a9a80f9e7bc6d9955d96/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/Sticker%203.3%20-%20Hannah%20Kim.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDI1LCJwdXIiOiJibG9iX2lkIn19--769597f1507ad11999decb728deb9a754fd95c2b/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGVnIiwicmVzaXplX3RvX2xpbWl0IjpbMTkyMCwxMDgwXX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--6696b5b4ae62e9942d9b6d207dd4968bc47aaf80/bg%20-%20Hannah%20Kim.jpeg",
      city: "Towson",
      state: "Maryland",
      country: "United States",
      countryCode: "US",
      latitude: 39.4018513,
      longitude: -76.6023803,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "3KNIQb",
      name: "SRC Code",
      website: "https://web.archive.org/srchacks.com/",
      start: "2018-09-07T20:00:00.000Z",
      end: "2018-09-08T20:00:00.000Z",
      createdAt: "2020-02-23T20:57:44.000Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDIyLCJwdXIiOiJibG9iX2lkIn19--b12f29fee6e4e8bdf2c2614bf811906fb0120576/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/crane.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDIzLCJwdXIiOiJibG9iX2lkIn19--cba38f63e22fc2ad9e44c1c10405108c76a22b5d/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/Screen-20Shot-202018-09-20-20at-203.34.38-20PM.png",
      city: "Fremont",
      state: "California",
      country: "United States",
      countryCode: "US",
      latitude: 37.5482697,
      longitude: -121.988571,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "3dzIzn",
      name: "TinoHacks II",
      website: "http://tinohacks.tech/",
      start: "2018-04-20T20:00:00.000Z",
      end: "2018-04-21T20:00:00.000Z",
      createdAt: "2020-02-23T20:57:43.000Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDIwLCJwdXIiOiJibG9iX2lkIn19--3873e080aeac68613e52d7afb4c85ebf3b436509/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--58e36ae2e45952aecf9cf71735396abeb9897d87/tu_p_Cgs_400x400.jpg",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDIxLCJwdXIiOiJibG9iX2lkIn19--6400c0ae23a60d8e3b2b70d33cd55ac130102efe/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/1_HJK9f9ANasdPd41dNSXJlQ.png",
      city: "Fremont",
      state: "California",
      country: "United States",
      countryCode: "US",
      latitude: 37.5482697,
      longitude: -121.988571,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "3aDIVx",
      name: "CodeGDL",
      website: "https://codegdl.com/",
      start: "2018-03-16T20:00:00.000Z",
      end: "2018-03-17T20:00:00.000Z",
      createdAt: "2020-02-23T20:57:42.000Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDE4LCJwdXIiOiJibG9iX2lkIn19--4fcbf6df9f2c829b01cbc43ea508309ab76bd7f8/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--58e36ae2e45952aecf9cf71735396abeb9897d87/0l4-BZ7W_400x400.jpg",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDE5LCJwdXIiOiJibG9iX2lkIn19--07092c259bba3d280431266d055ed8e5148e1449/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/Screenshot-202018-03-14-2007.09.24.png",
      city: "Zapopan",
      state: "Jalisco",
      country: "Mexico",
      countryCode: "MX",
      latitude: 20.7211203,
      longitude: -103.3913671,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "3ReIjA",
      name: "Project Helping Hands Business Hackathon",
      website: "https://www.project-helpinghands.com/",
      start: "2018-02-22T00:00:00.000Z",
      end: "2018-02-22T00:00:00.000Z",
      createdAt: "2020-02-23T20:57:40.000Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDE2LCJwdXIiOiJibG9iX2lkIn19--2dc7d28ce3fe13d1cbfce7c03517e4027045e0c1/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/PHH%20Cropped%20logo%20without%20text%20-%20Kevin%20Fang.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDE3LCJwdXIiOiJibG9iX2lkIn19--953c43c734a6a682d43a7b65b3ec9a7a04b340c6/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--797f7952fb61db955e058b888e66d8ecb495e15b/123%20-%20Kevin%20Fang.jpg",
      city: "San Ramon",
      state: "California",
      country: "United States",
      countryCode: "US",
      latitude: 37.7648021,
      longitude: -121.9544387,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "0xoIKd",
      name: "HackBI II",
      website: "http://hackbi.org",
      start: "2018-11-02T20:00:00.000Z",
      end: "2018-11-03T20:00:00.000Z",
      createdAt: "2020-02-23T20:57:26.000Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDE0LCJwdXIiOiJibG9iX2lkIn19--7dc35c903c07e7653492b37f36d8d648d85f56c2/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/HackBI-20II-20Logo.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDE1LCJwdXIiOiJibG9iX2lkIn19--5de56aa58bfae3546dd49a3092222a2a065d4742/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/HackBI-20II-20Banner.png",
      city: "Alexandria",
      state: "Virginia",
      country: "United States",
      countryCode: "US",
      latitude: 38.8051095,
      longitude: -77.0470229,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "rg2Ign",
      name: "McDonogh Hacks I",
      website: "https://mcdonoghhacks.org/",
      start: "2018-11-10T00:00:00.000Z",
      end: "2018-11-11T00:00:00.000Z",
      createdAt: "2020-02-23T20:57:23.000Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDEyLCJwdXIiOiJibG9iX2lkIn19--1c1478be5ac578ab641712de8a68e1a125936a94/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/logo%20(1)%20-%20Mingjie%20Jiang.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDEzLCJwdXIiOiJibG9iX2lkIn19--24aee4b60ca7c292f6a8e26674a1a81448c0816b/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/Untitled%20-%20Mingjie%20Jiang.png",
      city: "Owings Mills",
      state: "Maryland",
      country: "United States",
      countryCode: "US",
      latitude: 39.41484355,
      longitude: -76.7918239959658,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "r8QI4q",
      name: "SPARK",
      website: "https://web.archive.org/spark.stab.org/",
      start: "2018-01-26T19:00:00.000Z",
      end: "2018-01-27T19:00:00.000Z",
      createdAt: "2020-02-23T20:57:21.000Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDEwLCJwdXIiOiJibG9iX2lkIn19--2e7b45ce43d5f97d316d3d7f4a6c822ef174b8d2/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--58e36ae2e45952aecf9cf71735396abeb9897d87/iVirU759_400x400.jpg",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDExLCJwdXIiOiJibG9iX2lkIn19--57b5a7b0e39285c1092e3e2e8e7a81b906641994/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--797f7952fb61db955e058b888e66d8ecb495e15b/hackathon-2018-160_orig.jpg",
      city: "Charlottesville",
      state: "Virginia",
      country: "United States",
      countryCode: "US",
      latitude: 38.029306,
      longitude: -78.4766781,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "r9bI5B",
      name: "EVHacks III",
      website: "https://evhacks.github.io",
      start: "2018-02-09T19:00:00.000Z",
      end: "2018-02-09T19:00:00.000Z",
      createdAt: "2020-02-23T20:57:20.000Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDA4LCJwdXIiOiJibG9iX2lkIn19--6e10d804249ac97ed4eaa6dfcc6735afaec5ccfd/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/evhackslogo2018.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDA5LCJwdXIiOiJibG9iX2lkIn19--b0097865d901965704710db9686b180c99c1f22d/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--797f7952fb61db955e058b888e66d8ecb495e15b/banner.jpg",
      city: "San Jose",
      state: "California",
      country: "United States",
      countryCode: "US",
      latitude: 37.3361663,
      longitude: -121.890591,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "0PvIj2",
      name: "Blueprint",
      website: "https://blueprint.hackmit.org/",
      start: "2018-02-16T19:00:00.000Z",
      end: "2018-02-17T19:00:00.000Z",
      createdAt: "2020-02-23T20:57:20.000Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDA2LCJwdXIiOiJibG9iX2lkIn19--6afc20f8cbe51a543c098622bbe4457c22583127/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/download-1.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDA3LCJwdXIiOiJibG9iX2lkIn19--af776411e565d016d5ae4f3e774d27990dc9c9c1/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/Screenshot-202018-04-11-2021.56.13.png",
      city: "Cambridge",
      state: "Massachusetts",
      country: "United States",
      countryCode: "US",
      latitude: 42.3655767,
      longitude: -71.1040018,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "0qnIGY",
      name: "QuHacks",
      website: "http://quhacks.tech/",
      start: "2017-12-08T19:00:00.000Z",
      end: "2017-12-08T19:00:00.000Z",
      createdAt: "2020-02-23T20:57:18.000Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDA0LCJwdXIiOiJibG9iX2lkIn19--f97d6c38fc0f71f850ca3211610dfd41dbada168/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/quhacksicon.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDA1LCJwdXIiOiJibG9iX2lkIn19--bcb3fba23967b57738fd3315d41557a15119d836/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--797f7952fb61db955e058b888e66d8ecb495e15b/bg.jpg",
      city: "Baltimore",
      state: "Maryland",
      country: "United States",
      countryCode: "US",
      latitude: 39.2908816,
      longitude: -76.610759,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "pO7IBX",
      name: "MetroHacks Women",
      website: "https://women.metrohacks.org/",
      start: "2018-03-23T20:00:00.000Z",
      end: "2018-03-23T20:00:00.000Z",
      createdAt: "2020-02-23T20:57:17.000Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDAyLCJwdXIiOiJibG9iX2lkIn19--86cdc7b15deb403476713c0a6ff22d58a2cd860d/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/women_logo.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDAzLCJwdXIiOiJibG9iX2lkIn19--d32c71b5534a34966ef507bf25c055a7b270c280/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--797f7952fb61db955e058b888e66d8ecb495e15b/girlsbackground.jpg",
      city: "Cambridge",
      state: "Massachusetts",
      country: "United States",
      countryCode: "US",
      latitude: 42.3655767,
      longitude: -71.1040018,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "3BlIYd",
      name: "GunnHacks 4.0",
      website: "https://gunnhacks.com/",
      start: "2017-10-26T20:00:00.000Z",
      end: "2017-10-27T20:00:00.000Z",
      createdAt: "2020-02-23T20:57:16.000Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDAwLCJwdXIiOiJibG9iX2lkIn19--064f3e068b29128b8718ec1e21350999d586e3c6/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/logo.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDAxLCJwdXIiOiJibG9iX2lkIn19--67b1843d98f2a2f3a226ed0d1e13621d405cfa67/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--797f7952fb61db955e058b888e66d8ecb495e15b/banner.jpg",
      city: "Palo Alto",
      state: "California",
      country: "United States",
      countryCode: "US",
      latitude: 37.4443293,
      longitude: -122.1598465,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "3GnI5N",
      name: "Expo Hacks",
      website: "http://www.trivalleyyouthexpo.com/hackathon.html",
      start: "2018-05-19T00:00:00.000Z",
      end: "2018-05-19T00:00:00.000Z",
      createdAt: "2020-02-23T20:57:15.000Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzk4LCJwdXIiOiJibG9iX2lkIn19--128c1f23675d443456f57007034aadb7f03efa7f/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/expohacks%20-%20Nikolai%20Peram.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzk5LCJwdXIiOiJibG9iX2lkIn19--13bc6c44badaf15fb7be52b28dfcb3f9bd82085e/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--797f7952fb61db955e058b888e66d8ecb495e15b/29064223_579499269071757_8365882404912468097_o%20-%20Nikolai%20Peram.jpg",
      city: "Dublin",
      state: "California",
      country: "United States",
      countryCode: "US",
      latitude: 37.7021521,
      longitude: -121.9357918,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "3KNIQO",
      name: "MVHacks 2018",
      website: "https://mv-hacks.com/",
      start: "2018-10-26T20:00:00.000Z",
      end: "2018-10-26T20:00:00.000Z",
      createdAt: "2020-02-23T20:57:14.000Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzk2LCJwdXIiOiJibG9iX2lkIn19--2d5dde4675a9a6c2aa6e02b1ed285d5a02237c62/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/mvhacks2.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzk3LCJwdXIiOiJibG9iX2lkIn19--e5bc37981fbc8eb49a3d4772a26cdbd165ffee50/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/background_2018_3.png",
      city: null,
      state: "California",
      country: "United States",
      countryCode: "US",
      latitude: 37.2333253,
      longitude: -121.6846349,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "3dzIz2",
      name: "HackCCM",
      website: "https://hackccm.com/",
      start: "2018-04-27T20:00:00.000Z",
      end: "2018-04-27T20:00:00.000Z",
      createdAt: "2020-02-23T20:57:14.000Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzk0LCJwdXIiOiJibG9iX2lkIn19--8ab5a2b64637e0ec1df5aa4d28939f40c6a938e4/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/Artboard-12_Transparent-White-150x150-square.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzk1LCJwdXIiOiJibG9iX2lkIn19--135c51b64b082188d88b7f08f6f402684985c10f/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/Screenshot-202018-04-11-2021.50.22.png",
      city: "Randolph Township",
      state: "New Jersey",
      country: "United States",
      countryCode: "US",
      latitude: 40.844265,
      longitude: -74.5857217501825,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "3aDIVd",
      name: "HackATX",
      website: "http://hackatx.net/",
      start: "2018-05-12T20:00:00.000Z",
      end: "2018-05-12T20:00:00.000Z",
      createdAt: "2020-02-23T20:57:12.000Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MzkyLCJwdXIiOiJibG9iX2lkIn19--3a3b10c3e5e614817522082e29de3ec3cf455964/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/battery-full.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MzkzLCJwdXIiOiJibG9iX2lkIn19--63355d4ae1716784837a770f45d586e6dc7ec54c/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/Screen-20Shot-202018-03-26-20at-2011.34.50-20PM.png",
      city: "Austin",
      state: "Texas",
      country: "United States",
      countryCode: "US",
      latitude: 30.2711286,
      longitude: -97.7436995,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "3ReIjG",
      name: "MakeSPP",
      website: "https://makespp.com",
      start: "2018-05-26T00:00:00.000Z",
      end: "2018-05-26T00:00:00.000Z",
      createdAt: "2020-02-23T20:57:10.000Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MzkwLCJwdXIiOiJibG9iX2lkIn19--32b940ed3f002f7678b9b8cc2a69c0a57633bb9b/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/unnamed%20-%20Samay%20Shamdasani.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MzkxLCJwdXIiOiJibG9iX2lkIn19--52d5b65bca6c69e98fd4153006485ef917403853/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/Screen%20Shot%202018-03-15%20at%205.50.22%20PM%20-%20Samay%20Shamdasani.png",
      city: "Jersey City",
      state: "New Jersey",
      country: "United States",
      countryCode: "US",
      latitude: 40.7215682,
      longitude: -74.047455,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "0xoIK9",
      name: "hackWHS II",
      website: "http://hackwhs.com/",
      start: "2018-12-07T19:00:00.000Z",
      end: "2018-12-07T19:00:00.000Z",
      createdAt: "2020-02-23T20:57:02.000Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzg4LCJwdXIiOiJibG9iX2lkIn19--4c243b2c02ebacb8622f5508ad5301f4e99ee88d/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/logo.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzg5LCJwdXIiOiJibG9iX2lkIn19--fb42749168c98f0ed92af15f338ca9642f90e69e/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/Screenshot-202018-08-15-2014.26.05.png",
      city: "Westfield",
      state: "New Jersey",
      country: "United States",
      countryCode: "US",
      latitude: 40.6589912,
      longitude: -74.3473717,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "rg2Ig9",
      name: "The Grand Hack",
      website: "http://thegrandhack.info",
      start: "2018-09-14T00:00:00.000Z",
      end: "2018-09-15T00:00:00.000Z",
      createdAt: "2020-02-23T20:57:01.000Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzg2LCJwdXIiOiJibG9iX2lkIn19--e60f3e2300d2cffacaa89f17397b6ee1e3e1f9d4/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/Logo%20-%20Benjamin%20Lewis.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzg3LCJwdXIiOiJibG9iX2lkIn19--192e245ed5c0c4f6fb6c0e699135df344682b810/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--0cb308658042f2d6b36d86bf03f4df0c63838d0b/banner%20-%20Benjamin%20Lewis.png",
      city: "Reading",
      state: "England",
      country: "United Kingdom",
      countryCode: "GB",
      latitude: 51.456659,
      longitude: -0.9696512,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "r8QI4z",
      name: "hackJA 2018",
      website: "http://www.hackja.com/",
      start: "2018-10-25T20:00:00.000Z",
      end: "2018-10-26T20:00:00.000Z",
      createdAt: "2020-02-23T20:57:00.000Z",
      logo: null,
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzg1LCJwdXIiOiJibG9iX2lkIn19--376abdda203096076d83df6dcc2f34e0f13dabe7/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--797f7952fb61db955e058b888e66d8ecb495e15b/1471239886.jpg",
      city: "Edison",
      state: "New Jersey",
      country: "United States",
      countryCode: "US",
      latitude: 40.518157,
      longitude: -74.4113926,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "r9bI5W",
      name: "hackBCA IV",
      website: "https://www.hackbca.com/",
      start: "2017-03-24T20:00:00.000Z",
      end: "2017-03-25T20:00:00.000Z",
      createdAt: "2020-02-23T20:56:58.000Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MzgzLCJwdXIiOiJibG9iX2lkIn19--e47cda660b1122d0a66a84f832d72baad11d1115/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/logocircular.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzg0LCJwdXIiOiJibG9iX2lkIn19--471be3634cc3f55f30549a91477140309b78b93d/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--797f7952fb61db955e058b888e66d8ecb495e15b/cupstacking.jpg",
      city: "Hackensack",
      state: "New Jersey",
      country: "United States",
      countryCode: "US",
      latitude: 40.8871438,
      longitude: -74.0410865,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
    {
      id: "0PvIjn",
      name: "Oakland Hacks II",
      website: "https://oaklandhacks.github.io/",
      start: "2017-04-21T20:00:00.000Z",
      end: "2017-04-21T20:00:00.000Z",
      createdAt: "2020-02-23T20:56:57.000Z",
      logo: "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MzgxLCJwdXIiOiJibG9iX2lkIn19--792727a608e7d00170acb094bb68465ff53bfb19/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsxMjgsMTI4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--aed3fb345df101cd22ac6ef68ee4e4dbe8543f96/image.png",
      banner:
        "https://dash.hackathons.hackclub.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MzgyLCJwdXIiOiJibG9iX2lkIn19--15a7e22c15050c3dde381cda959364c0dd408f00/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGciLCJyZXNpemVfdG9fbGltaXQiOlsxOTIwLDEwODBdfSwicHVyIjoidmFyaWF0aW9uIn19--797f7952fb61db955e058b888e66d8ecb495e15b/banner.jpg",
      city: "Oakland",
      state: "California",
      country: "United States",
      countryCode: "US",
      latitude: 37.8044557,
      longitude: -122.271356,
      virtual: false,
      hybrid: false,
      mlhAssociated: false,
      apac: false,
    },
  ];

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        // In a real app, you would fetch from API
        // const response = await fetch('https://hackathons.hackclub.com/api/events/all');
        // const data = await response.json();
  
        // Using sample data for now
        setAllHackathons(hackathons);
        applyFilters(hackathons);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching hackathons:", error);
        setLoading(false);
      }
    };
  
    fetchHackathons();
  }, []);
  
  // Apply filters whenever filter states change
  useEffect(() => {
    // Only apply filters if we have hackathons to filter
    if (allHackathons && allHackathons.length > 0) {
      applyFilters(allHackathons);
    }
  }, [locationFilter, virtualFilter, hybridFilter, allHackathons]);
  
  const applyFilters = (hackathons: Hackathon[]) => {
    // Guard clause for empty hackathon array
    if (!hackathons || hackathons.length === 0) {
      setFilteredHackathons([]);
      setDisplayCount(10);
      return;
    }
  
    let filtered = [...hackathons];
  
    // Apply location filter if set and not empty
    if (locationFilter && locationFilter.trim() !== '') {
      const search = locationFilter.toLowerCase().trim();
      filtered = filtered.filter(
        (h) =>
          (h.city && h.city.toLowerCase().includes(search)) ||
          (h.state && h.state.toLowerCase().includes(search)) ||
          (h.country && h.country.toLowerCase().includes(search))
      );
    }
  
    // Apply virtual filter if set
    if (virtualFilter !== null) {
      filtered = filtered.filter((h) => h.virtual === virtualFilter);
    }
  
    // Apply hybrid filter if set
    if (hybridFilter !== null) {
      filtered = filtered.filter((h) => h.hybrid === hybridFilter);
    }
  
    // Update filtered results and reset display count
    setFilteredHackathons(filtered);
    setDisplayCount(10);
  };
  
  const handleFilterChange = (
    location: string,
    virtual: boolean | null,
    hybrid: boolean | null
  ) => {
    // Ensure location is always a string, even if undefined or null
    setLocationFilter(location || '');
    setVirtualFilter(virtual);
    setHybridFilter(hybrid);
  };
  
  const loadMoreHackathons = () => {
    setDisplayCount((prevCount) => prevCount + 10);
  };
  
  // Get displayed hackathons based on current display count
  const displayedHackathons = filteredHackathons.slice(0, displayCount);
  
  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Hackathons for Students</title>
        <meta
          name="description"
          content="Browse the best hackathons for students"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
  
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Filter
          onFilterChange={handleFilterChange}
          locationFilter={locationFilter}
          virtualFilter={virtualFilter}
          hybridFilter={hybridFilter}
        />
  
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center">
              <p className="text-lg">Loading hackathons...</p>
            </div>
          ) : (
            <div>
              {filteredHackathons.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-8 w-8 text-gray-400" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-600 font-medium">
                    No hackathons found matching your filters.
                  </p>
                  <p className="text-gray-500 mt-2">Try adjusting your search criteria.</p>
                  <button
                    onClick={() => handleFilterChange('', null, null)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-4">Found {filteredHackathons.length} hackathon{filteredHackathons.length !== 1 ? 's' : ''}</p>
                  <div className="grid gap-8 md:grid-cols-2">
                    {displayedHackathons.map((hackathon) => (
                      <CourseCard key={hackathon.id} hackathon={hackathon} />
                    ))}
                  </div>
  
                  {displayCount < filteredHackathons.length && (
                    <div className="flex justify-center mt-8">
                      <button
                        onClick={loadMoreHackathons}
                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors shadow-sm"
                      >
                        Load More ({filteredHackathons.length - displayCount} remaining)
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>
  
      <AiAssistantButton />
    </div>
  );
}

export default Page;
