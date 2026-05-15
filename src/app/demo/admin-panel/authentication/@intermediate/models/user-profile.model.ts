export class UserProfileComplete
{
  public UserId?: number;
  public Email?: string;
  public Username?: string;
  public FullName: string;
  public FirstName: string;
  public LastName: string;
  public Phone: string;
  public DateOfBirth?: Date;
  public IsVerified?: boolean;
  public IsActive?: boolean;
  public MemberSince: string;
  public UserLoginStatistic: UserLoginStatistics;
  public RecentUserLogins: Array<UserRecentLogin>;
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

