import React from 'react';

// SVG Icon Components to replace emojis
export const Icons = {
  // User type icons
  Employee: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V6.5C15 5.67 14.33 5 13.5 5H10.5C9.67 5 9 5.67 9 6.5V7.5L3 7V9L9 8.5V21C9 21.55 9.45 22 10 22H11C11.55 22 12 21.55 12 21V16H12V21C12 21.55 12.45 22 13 22H14C14.55 22 15 21.55 15 21V8.5L21 9Z" fill={color}/>
    </svg>
  ),

  Student: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18ZM12 3L1 9L12 15L21 11.09V17H23V9L12 3Z" fill={color}/>
    </svg>
  ),

  // Navigation icons
  Home: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill={color}/>
    </svg>
  ),

  Search: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5S5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14Z" fill={color}/>
    </svg>
  ),

  Calendar: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z" fill={color}/>
    </svg>
  ),

  Archive: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.54 5.23L19.15 3.55C18.88 3.21 18.47 3 18 3H6C5.53 3 5.12 3.21 4.85 3.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V6.5C21 6.02 20.83 5.57 20.54 5.23ZM6.24 5H17.76L18.57 5.97H5.43L6.24 5ZM5 19V8H19V19H5ZM9.5 11V13H14.5V11H9.5Z" fill={color}/>
    </svg>
  ),

  Settings: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" fill={color}/>
    </svg>
  ),

  Forum: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2H4C2.9 2 2.01 2.9 2.01 4L2 22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM6 9H18V11H6V9ZM14 14H6V12H14V14ZM18 8H6V6H18V8Z" fill={color}/>
    </svg>
  ),

  Profile: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill={color}/>
    </svg>
  ),

  Logout: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.59L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill={color}/>
    </svg>
  ),

  Menu: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" fill={color}/>
    </svg>
  ),

  Wave: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 4C7 2.9 6.11 2 5 2S3 2.9 3 4C3 5.1 3.89 6 5 6S7 5.1 7 4ZM11.45 8.5L9.5 6C9.1 5.5 8.5 5.26 7.93 5.33C7.36 5.4 6.85 5.78 6.62 6.31L5 10H7L8.5 7L10.24 9.24L8.33 15.75C8.1 16.66 8.66 17.58 9.58 17.81C10.5 18.04 11.42 17.48 11.65 16.56L12.5 13.5L14.5 15.5V21H16.5V14.5L13.5 11.5C13.1 11.1 12.45 11.1 12.05 11.5L11.45 8.5ZM5.5 12C4.67 12 4 12.67 4 13.5S4.67 15 5.5 15S7 14.33 7 13.5S6.33 12 5.5 12ZM18.5 11C17.67 11 17 11.67 17 12.5S17.67 14 18.5 14S20 13.33 20 12.5S19.33 11 18.5 11Z" fill={color}/>
    </svg>
  ),

  Shield: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" fill={color}/>
    </svg>
  ),

  // Department icon (used in Admin panel)
  Department: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L2 12H5V20H19V12H22L12 3ZM12 8.75C12.69 8.75 13.25 9.31 13.25 10S12.69 11.25 12 11.25 10.75 10.69 10.75 10 11.31 8.75 12 8.75ZM7 19V17C7 15.9 9.79 15 12 15S17 15.9 17 17V19H7Z" fill={color}/>
    </svg>
  ),

  // Course icon (used in Admin panel)
  Course: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM18 20H6V4H18V20ZM7 19H9V17H7V19ZM11 19H13V17H11V19ZM15 19H17V17H15V19ZM7 15H9V13H7V15ZM11 15H13V13H11V15ZM15 15H17V13H15V15ZM7 11H9V9H7V11ZM11 11H13V9H11V11ZM15 11H17V9H15V11ZM7 7H17V5H7V7Z" fill={color}/>
    </svg>
  ),

  // Faculty icon (used in Admin panel)
  Faculty: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4C16.55 4 17 4.45 17 5S16.55 6 16 6 15 5.55 15 5 15.45 4 16 4ZM13 15L15.5 9.5C15.5 9.5 14.5 8 12.5 8S9.5 9.5 9.5 9.5L12 15H13ZM12 6C13.1 6 14 5.1 14 4S13.1 2 12 2 10 2.9 10 4 10.9 6 12 6ZM21 15.5C21 16.88 19.88 18 18.5 18C17.12 18 16 16.88 16 15.5C16 14.12 17.12 13 18.5 13C19.88 13 21 14.12 21 15.5ZM8 4C8.55 4 9 4.45 9 5S8.55 6 8 6 7 5.55 7 5 7.45 4 8 4ZM7.5 22H9L11 13H9.5L7.5 22ZM8 15.5C8 16.88 6.88 18 5.5 18C4.12 18 3 16.88 3 15.5C3 14.12 4.12 13 5.5 13C6.88 13 8 14.12 8 15.5ZM15 22H16.5L14.5 13H13L15 22Z" fill={color}/>
    </svg>
  ),

  // Download icon (for export functionality)
  Download: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 20H19V18H5V20ZM19 9H15V3H9V9H5L12 16L19 9Z" fill={color}/>
    </svg>
  )
};

export default Icons;