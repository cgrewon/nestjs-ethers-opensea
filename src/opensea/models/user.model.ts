

export class UserModel {
    username: string;
    profile_img_url: string;
    address: string;
    config;
    constructor(data) {
      if (data) {
        this.username = data.user ? data.user.username : "";
        this.profile_img_url = data.profile_img_url;
        this.address = data.address;
        this.config = data.config;
      }
    }
  }


