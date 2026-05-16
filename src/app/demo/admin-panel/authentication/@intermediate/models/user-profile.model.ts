export class UserProfileComplete
{
  userId: number;
  email: string;
  username: string;
  fullName: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  isVerified: boolean;
  isActive: boolean;
  memberSince: string;
  languageCode: string;
  timezone: string;
  userLoginStatistic: UserLoginStatistics;
  recentUserLogins: UserRecentLogin[];
}

export class UserLoginStatistics
{
  public SuccessfulLogins?: number;
  public FailedLogins?: number;
  public LastSuccessfulLogin?: Date;
  public DaysActive: number;
}
export class UserRecentLogin
{
  public IpAddress?: string;
  public DeviceType?: string;
  public BrowserName?: string;
  public OperatingSystem: string;
  public LoginTime: Date;
  public TimeAgo: string;
}

