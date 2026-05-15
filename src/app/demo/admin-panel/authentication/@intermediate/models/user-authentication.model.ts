export class RegisterLoginRequest
{
  public Email: string;
  public Username: string;
  public Password: string;
  public FirstName: string;
  public LastName: string;
  public Phone: string;
  public DateOfBirth: Date;
}

export class RegisterLoginResponse
{
  public UserId?: number;
  public Email?: string;
  public Username?: string;
  public Message: string;
  public Success: boolean;
  public AccessToken: string;
  public RefreshToken: Date;
}
export class LoginRequest
{
  public EmailOrUserName: string;
  public Password: string;
  public DeviceInfo?: string;
  public IpAddress?: string;
}

export class LoginResponse
{
  public Success: boolean;
  public Message: string;
  public accessToken?: string;
  public refreshToken?: string;
  public UserInfo?: UserInfoDto;
  public AccessTokenExpiry?: string;
}

export class UserInfoDto
{
  public UserId: number;
  public Email: string;
  public Username?: string;
  public FirstName?: string;
  public LastName?: string;
  public FullName?: string;
  public IsVerified?: boolean;
  public LanguageCode?: string;
  public Timezone?: string;
}

