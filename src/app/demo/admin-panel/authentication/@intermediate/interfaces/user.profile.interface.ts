import { Observable } from "rxjs";
import { UserProfileComplete } from "../models/user-profile.model";

export interface IUserProfileService
{
  GetUserProfileCompleteAsync(): Observable<UserProfileComplete>;
}
