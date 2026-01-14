// src/ui/icons.tsx

export const EyeIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M1 12C3.5 7.5 7.5 5 12 5s8.5 2.5 11 7c-2.5 4.5-6.5 7-11 7S3.5 16.5 1 12z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const EyeOffIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M3 3l18 18"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M1 12C3.5 7.5 7.5 5 12 5c2.1 0 4.1.5 6 1.5M23 12c-2.5 4.5-6.5 7-11 7-2.1 0-4.1-.5-6-1.5"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

export const CheckIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12l4 4L19 6"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const GoogleIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <path fill="#1976d2" d="M43.6 20H42V20H24v8h11.3C33.5 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-4z"/>
  </svg>
);

type IconProps = {
  size?: number;
};

export const ArrowRightIcon = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12h14M13 5l6 7-6 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TrendingUpIcon = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M3 17l6-6 4 4 7-7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 7h7v7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TaskIcon = ({ size = 28 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="4"
      width="18"
      height="16"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M7 8h10M7 12h10M7 16h6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const UsersIcon = ({ size = 28 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
    <circle cx="17" cy="9" r="2" stroke="currentColor" strokeWidth="2" />
    <path
      d="M3 19c0-3 3-5 6-5s6 2 6 5"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M15 19c.3-1.7 1.7-3 3.5-3"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

export const BuildingIcon = ({ size = 28 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect
      x="4"
      y="3"
      width="16"
      height="18"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M8 7h2M12 7h2M8 11h2M12 11h2M8 15h2M12 15h2"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);
