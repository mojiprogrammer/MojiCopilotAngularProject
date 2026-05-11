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


