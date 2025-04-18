type SizeKey = 'sm' | 'md' | 'lg' | 'xl';

const sizeClasses: Record<SizeKey, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-32 w-32",
};

interface UserAvatarProps {
  user?: {
    avatar?: string;
    name?: string;
  };
  avatar?: string; // 👈 new prop
  size?: SizeKey;
  className?: string;
}

const UserAvatar = ({ user, avatar, size = 'md', className = '' }: UserAvatarProps) => {
  const avatarSize = sizeClasses[size];

  // Use `avatar` prop if provided, else fallback to `user?.avatar`
  const finalAvatar = avatar || user?.avatar;
  const displayName = user?.name || 'User';

  return (
    <div className={`relative rounded-full ${avatarSize} ${className}`}>
      {finalAvatar ? (
        <img
          src={finalAvatar}
          alt={`${displayName}'s avatar`}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
          {displayName.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
