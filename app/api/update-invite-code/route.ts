import {
  findUserByInviteCode,
  findUserByUuid,
  updateUserInviteCode,
} from "@/models/user";
import { respData, respErr } from "@/lib/resp";

import { getUserUuid } from "@/services/user";

export async function POST(req: Request) {
  try {
    const { invite_code } = await req.json();
    if (!invite_code) {
      return respErr("invalid params");
    }

    if (invite_code.length < 2 || invite_code.length > 16) {
      return respErr("invalid invite code, length must be between 2 and 16");
    }

    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth");
    }

    const user_info = await findUserByUuid(user_uuid);
    if (!user_info || !user_info.email) {
      return respErr("invalid user");
    }

    if (user_info.invite_code === invite_code) {
      return respData(user_info);
    }

    const user_by_invite_code = await findUserByInviteCode(invite_code);
    if (user_by_invite_code) {
      if (user_by_invite_code.uuid !== user_uuid) {
        return respErr("invite code already exists");
      }

      return respData(user_by_invite_code);
    }

    await updateUserInviteCode(user_uuid, invite_code);

    user_info.invite_code = invite_code;

    return respData(user_info);
  } catch (e) {
    console.log("update invite code failed", e);
    return respErr("update invite code failed");
  }
}
