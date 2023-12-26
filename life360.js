export class Life360 {
  constructor(url, email, password, circle) {
    this.email = email;
    this.password = password;
    this.circle = circle;
    this.url = url + "/";
  }

  async init() {
    this.auth = await request(this.url + "oauth2/token", {
      grant_type: "password",
      username: this.email,
      password: this.password,
    });

    console.log(
      "Authorized as",
      this.auth.user.firstName,
      this.auth.user.lastName
    );
  }

  async listCircles() {
    let circles = await request(
      this.url + "circles",
      {},
      this.auth.access_token,
      "GET"
    );
    return circles.circles;
  }

  async getCircle() {
    let circle = await request(
      this.url + "circles/" + this.circle,
      {},
      this.auth.access_token,
      "GET"
    );

    return circle;
  }

  async getMembers() {
    let members = await request(
      this.url + "circles/" + this.circle + "/members",
      {},
      this.auth.access_token,
      "GET"
    );

    return members.members;
  }

  async getMemberPosition(memberId) {
    let members = (
      await request(
        this.url + "circles/" + this.circle + "/members",
        {},
        this.auth.access_token,
        "GET"
      )
    ).members;

    for (let member of members) {
      if (member.id == memberId) return member.location;
    }
  }
}

const request = async (url, body, auth, method = "POST") => {
  return await (
    await fetch(url, {
      body: method == "POST" ? JSON.stringify(body) : null,
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        //"X-Application": "life360-web-client",
        "Cache-Control": "no-cache",
        authorization: auth
          ? "Bearer " + auth
          : "Basic Y2F0aGFwYWNyQVBoZUtVc3RlOGV2ZXZldnVjSGFmZVRydVl1ZnJhYzpkOEM5ZVlVdkE2dUZ1YnJ1SmVnZXRyZVZ1dFJlQ1JVWQ==",
        "User-Agent": "com.life360.android.safetymapd/KOKO/23.49.0_android/13",
        charset: "UTF-8",
      },
    })
  ).json();
};
